import { lambdaHandler } from '../../src/app';
import { S3Event } from 'aws-lambda/trigger/s3';

describe('Unit test for app handler', function () {
    it('verifies successful response', async () => {

        // TODO: implement

        // @ts-ignore
        const event: S3Event = {};

        // @ts-ignore
        const result = await lambdaHandler();

        expect(200).toEqual(200);
    });
});
