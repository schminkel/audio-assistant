import { S3Event } from 'aws-lambda/trigger/s3';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { Configuration, OpenAIApi } from 'openai';
import { Readable } from 'stream';
import { ChatCompletionRequestMessage } from 'openai/dist/api';
import { v4 as uuidv4 } from 'uuid';

const REGION = 'eu-central-1';
const TABLE_NAME = 'assistent.one';
const ACTION_VERSION = '1.0';
const NOT_DELETED_FLAG = false;
const s3 = new S3Client({ region: REGION });
const dyn = new DynamoDBClient({ region: REGION });
const openaiConfiguration = new Configuration({
    organization: process.env.OPENAI_ORG_ID,
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Lambda handler
 * @param event
 */
export const lambdaHandler = async (event: S3Event) => {
    console.info('\n\n🟢 starting lambda function... \n');

    const eventJson = JSON.stringify(event);
    console.log('### eventJson: ', eventJson);

    const key = event.Records?.at(0)?.s3.object.key;
    const bucket = event.Records?.at(0)?.s3.bucket.name;

    if (key === undefined) {
        throw new Error('S3 key is undefined!');
    }
    if (bucket === undefined) {
        throw new Error('S3 bucket is undefined!');
    }

    console.log('### key: ', key); // e.g. ec62043a-cbe6-4f71-84fc-c1f37956d30d_8751796668704289_d72dd6c9.json
    console.log('### bucket: ', bucket);

    const fileContent: string = await readFileFromS3(key, bucket);
    const fileContentObj = JSON.parse(fileContent);
    const transcriptionJobName: string = fileContentObj.jobName;
    // const audioUuid: string = fileContentObj.jobName.split('_')[0];
    const transcriptionUuid: string = uuidv4();
    const chatGptUuid: string = uuidv4();
    const transcript: string = fileContentObj.results.transcripts[0].transcript;
    console.log('### transcript: ', transcript);

    const userID = getUserIdFromKey(key);

    await createDynamoDBTranscription(transcriptionUuid, transcript, transcriptionJobName, userID);

    const chatGptMessage = await getOpenAiMessage(transcript);
    console.log('### chatGPT: ', chatGptMessage);

    await createDynamoDBChatGpt(chatGptUuid, chatGptMessage, transcriptionJobName, userID);

    console.info('\n\n🔴 ending lambda function... \n');
    return chatGptUuid;
};

/**
 * Parse the userID from the key
 * @param key
 * @returns userID
 */
function getUserIdFromKey(key: string) {
    let userID = '';
    const lastUnderscorePosition = key.lastIndexOf('_');
    const penultimateUnderscorePosition = key.lastIndexOf('_', lastUnderscorePosition - 1);
    if (penultimateUnderscorePosition !== -1 && lastUnderscorePosition !== -1) {
        userID = key.substring(penultimateUnderscorePosition + 1, lastUnderscorePosition);
        console.log('### userID: ', userID);
    } else {
        console.error('### userID not found in key: ', key);
    }
    return userID;
}

/**
 * Read file content from S3
 * @param key The key of the file
 * @param bucket The bucket of the file
 * @returns The file content
 */
async function readFileFromS3(key: string, bucket: string) {
    const input = {
        Bucket: bucket,
        Key: key,
    };
    const getObjectCommand = new GetObjectCommand(input);
    const response = await s3.send(getObjectCommand);
    const fileContent = await streamToString(response.Body as Readable);
    if (fileContent === undefined || fileContent === null) {
        throw new Error('File content is undefined or null!');
    } else {
        return fileContent;
    }
}

/**
 * Convert stream to string
 * @param stream
 */
function streamToString(stream: Readable | undefined): Promise<string> {
    if (stream === undefined) {
        throw new Error('Stream is undefined!');
    }
    const chunks: any[] = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    });
}

// /**
//  * Update DynamoDB with the transcript
//  * @param uuid
//  * @param transcript
//  */
// async function updateDynamoDBTranscript(uuid: string, transcript: string) {
//     const dynamoDbData = {
//         TableName: 'assistent.one',
//         Key: {
//             uuid: uuid,
//         },
//         UpdateExpression: 'SET #transcript = :transcript',
//         ExpressionAttributeNames: { '#transcript': 'transcript' },
//         ExpressionAttributeValues: { ':transcript': transcript },
//     };
//
//     const ddbDocClient = DynamoDBDocument.from(dyn);
//     try {
//         const result = await ddbDocClient.update(dynamoDbData);
//         console.log('### Success DynamoDB: ', result);
//     } catch (error) {
//         console.error('### Error adding data to DynamoDB:', error);
//     }
// }

/**
 * Create an TRANSCRIPTION entry in the "assistent.one" table
 * @param transcriptionUuid
 * @param transcript
 * @param transcriptionJobName
 * @param userID
 */
async function createDynamoDBTranscription(
    transcriptionUuid: string,
    transcript: string,
    transcriptionJobName: string,
    userID: string,
) {
    const dynamoDbData = {
        userID: userID,
        actionUuid: transcriptionUuid,
        actionType: 'transcription',
        actionResult: transcript,
        actionUpdated: new Date().toISOString(),
        transcriptionJobName: transcriptionJobName,
        actionVersion: ACTION_VERSION,
        isDeleted: NOT_DELETED_FLAG,
    };
    const ddbDocClient = DynamoDBDocument.from(dyn);
    try {
        const result = await ddbDocClient.put({
            TableName: TABLE_NAME,
            Item: dynamoDbData,
        });
        console.log('### TRANSCRIPTION added to DynamoDB:', dynamoDbData);
        console.log('### Success DynamoDB TRANSCRIPTION: ', result);
    } catch (error) {
        console.error('### Error adding TRANSCRIPTION to DynamoDB:', error);
    }
}

/**
 * Create an TRANSCRIPTION entry in the "assistent.one" table
 * @param chatGptUuid
 * @param chatGptMessage
 * @param transcriptionJobName
 * @param userID
 */
async function createDynamoDBChatGpt(
    chatGptUuid: string,
    chatGptMessage: string,
    transcriptionJobName: string,
    userID: string,
) {
    const dynamoDbData = {
        userID: userID,
        actionUuid: chatGptUuid,
        actionType: 'chatgpt',
        actionResult: chatGptMessage,
        actionUpdated: new Date().toISOString(),
        transcriptionJobName: transcriptionJobName,
        actionVersion: ACTION_VERSION,
        isDeleted: NOT_DELETED_FLAG,
    };
    const ddbDocClient = DynamoDBDocument.from(dyn);
    try {
        const result = await ddbDocClient.put({
            TableName: TABLE_NAME,
            Item: dynamoDbData,
        });
        console.log('### TRANSCRIPTION added to DynamoDB:', dynamoDbData);
        console.log('### Success DynamoDB TRANSCRIPTION: ', result);
    } catch (error) {
        console.error('### Error adding TRANSCRIPTION to DynamoDB:', error);
    }
}

// /**
//  * Update DynamoDB with the transcript
//  * @param uuid
//  * @param transcript
//  */
// async function updateDynamoDBChatGPT(uuid: string, chatGPT: string) {
//     const dynamoDbData = {
//         TableName: 'assistent.one',
//         Key: {
//             uuid: uuid,
//         },
//         UpdateExpression: 'SET #chatGPT = :chatGPT',
//         ExpressionAttributeNames: { '#chatGPT': 'chatGPT' },
//         ExpressionAttributeValues: { ':chatGPT': chatGPT },
//     };
//
//     const ddbDocClient = DynamoDBDocument.from(dyn);
//     try {
//         const result = await ddbDocClient.update(dynamoDbData);
//         console.log('### Success DynamoDB: ', result);
//     } catch (error) {
//         console.error('### Error adding data to DynamoDB:', error);
//     }
// }

/**
 * Ask chatGPT for a message
 * @param transcript
 */
async function getOpenAiMessage(transcript: string): Promise<string> {
    const openaiMessages: ChatCompletionRequestMessage[] = [];
    openaiMessages.push({ role: 'user', content: transcript });
    if (openaiConfiguration.organization === undefined) {
        throw new Error('OpenAI organization is undefined!');
    }
    if (openaiConfiguration.apiKey === undefined) {
        throw new Error('OpenAI API key is undefined!');
    }
    const openai = new OpenAIApi(openaiConfiguration);
    const chatGPT = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: openaiMessages,
    });
    console.log('### chatGPT: ', chatGPT);
    const chatGPTMessage = chatGPT.data.choices[0].message;
    console.log('### chatGPTMessage: ', chatGPTMessage);
    return chatGPTMessage?.content ?? '';
}
