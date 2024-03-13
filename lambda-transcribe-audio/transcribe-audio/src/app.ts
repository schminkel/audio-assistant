import { StartTranscriptionJobCommand, TranscribeClient } from '@aws-sdk/client-transcribe';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { S3Event } from 'aws-lambda/trigger/s3';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const REGION = 'eu-central-1';
const TABLE_NAME = 'assistent.one';
const ACTION_VERSION = '1.0';
const NOT_DELETED_FLAG = false;
const outputBucket = 'schminkel-transcribe-audio-output-bucket';
const dynamoDBClient = new DynamoDBClient({ region: REGION });
const transcribeClient = new TranscribeClient({ region: REGION });

export const lambdaHandler = async (event: S3Event) => {
    console.info('\n\n🟢 starting lambda function... \n');

    const eventJson = JSON.stringify(event);
    console.log('### eventJson: ', eventJson);

    const key: string | undefined = event.Records?.at(0)?.s3?.object?.key;
    const inputBucket: string | undefined = event.Records?.at(0)?.s3?.bucket?.name;

    if (key === undefined) {
        throw new Error('S3 key is undefined!');
    }
    if (inputBucket === undefined) {
        throw new Error('S3 inputBucket is undefined!');
    }

    console.log('### key: ', key); // e.g. ec62043a-cbe6-4f71-84fc-c1f37956d30d_8751796668704289.webm
    console.log('### inputBucket: ', inputBucket);
    console.log('### outputBucket: ', outputBucket);

    const userID = getUserIdFromKey(key);

    const shortUuid = uuidv4().split('-')[0];
    console.log('### uuid: ', shortUuid);

    let extension: string = path.extname(key);
    extension = extension.slice(1, extension.length);

    console.log('### converting from ', `https://${inputBucket}.s3.amazonaws.com/${key}`);

    if (!['mp3', 'mp4', 'wav', 'flac', 'webm'].includes(extension)) {
        throw new Error(
            'Invalid file extension, the only supported AWS Transcribe file types are MP3, MP4, WAV, FLAC, WEBM.',
        );
    }

    const fileNameWithoutExtension: string = path.basename(key, path.extname(key));
    const jobName: string = key.replace('/', '-').replace('.' + extension, '') + '_' + shortUuid;
    const fileUri = `https://${inputBucket}.s3.amazonaws.com/${key}`;

    console.log('### fileNameWithoutExtension: ', fileNameWithoutExtension);
    console.log('### extension: ', extension);
    console.log('### jobName: ', jobName);
    console.log('### fileUri: ', fileUri);

    const response = await startTranscription(jobName, extension, fileUri);

    await createDynamoDBAudio(fileNameWithoutExtension, fileUri, jobName, userID);

    console.info('\n\n🔴 ending lambda function... \n');
    return response;
};

/**
 * Parse the userID from the key
 * @param key
 * @returns userID
 */
function getUserIdFromKey(key: string) {
    let userID = '';
    const underscorePosition = key.lastIndexOf('_');
    const dotPosition = key.lastIndexOf('.');
    if (underscorePosition !== -1 && dotPosition !== -1) {
        userID = key.substring(underscorePosition + 1, dotPosition);
        console.log('### userID: ', userID);
    } else {
        console.log('### userID not found in key: ', key);
    }
    return userID;
}

/**
 * Create an AUDIO entry in the "assistent.one" table
 * @param fileNameWithoutExtension
 * @param fileUri
 * @param jobName
 * @param userID
 */
async function createDynamoDBAudio(fileNameWithoutExtension: string, fileUri: string, jobName: string, userID: string) {
    const dynamoDbData = {
        userID: userID,
        actionUuid: fileNameWithoutExtension,
        actionType: 'audio',
        actionResult: fileUri,
        actionUpdated: new Date().toISOString(),
        transcriptionJobName: jobName,
        actionVersion: ACTION_VERSION,
        isDeleted: NOT_DELETED_FLAG,
    };
    const ddbDocClient = DynamoDBDocument.from(dynamoDBClient);
    try {
        const result = await ddbDocClient.put({
            TableName: TABLE_NAME,
            Item: dynamoDbData,
        });
        console.log('Data added to DynamoDB:', dynamoDbData);
        console.log('### Success DynamoDB: ', result);
    } catch (error) {
        console.error('Error adding data to DynamoDB:', error);
    }
}

/**
 * Start a new AWS Transcribe job
 * @param jobName
 * @param extension
 * @param fileUri
 */
async function startTranscription(jobName: string, extension: string, fileUri: string) {
    const params = {
        TranscriptionJobName: jobName,
        LanguageCode: 'de-DE', // For example, 'en-US'
        MediaFormat: extension, // For example, 'wav'
        Media: {
            MediaFileUri: fileUri,
            // The S3 object location of the input media file. The URI must be in the same region
            // as the API endpoint that you are calling.For example,
            // "https://transcribe-demo.s3-REGION.amazonaws.com/hello_world.wav"
        },
        OutputBucketName: outputBucket,
    };

    let response = undefined;
    try {
        const command = new StartTranscriptionJobCommand(params);
        response = await transcribeClient.send(command);
        console.log('### Success TranscriptionJob: ', response);
    } catch (err) {
        response = err;
        console.error('### ERROR TranscriptionJob: ', err);
    }
    return response;
}
