/**
 * This API endpoint soft deletes all actions for a given user id.
 */
import { NextRequest, NextResponse } from 'next/server'
import {
  DynamoDBClient,
  QueryCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'

const dynClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    if (!userId) {
      return NextResponse.json(
        {
          error: '[1] invalid parameter, userId missing',
        },
        { status: 500 },
      )
    }

    let itemsUpdated = await softDeleteAllActionsForUser(userId)
    return NextResponse.json(
      {
        itemsUpdated: itemsUpdated,
        userId: userId,
      },
      { status: 200 },
    )
  } catch (err: any) {
    return NextResponse.json(
      {
        error: '[2] invalid parameter, invalid result form database',
        message: err.message,
        stack: err.stack,
      },
      { status: 500 },
    )
  }
}

/**
 * Soft delete all actions for a given user
 */
async function softDeleteAllActionsForUser(userID: string): Promise<number> {
  const queryParams = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME || '',
    KeyConditionExpression: 'userID = :u',
    ExpressionAttributeValues: marshall({
      ':u': userID,
    }),
  }

  try {
    const data = await dynClient.send(new QueryCommand(queryParams))

    // If no items to update, exit the function.
    if (!data.Items || data.Items.length === 0) {
      return 0
    } else {
      console.log(
        'Found ' +
          data.Items.length +
          ' items to update for the provided userID.',
      )
    }

    // Update each item.
    for (const item of data.Items) {
      // Skip items that are already marked as deleted
      if (item.isDeleted.BOOL !== true) {
        const updateParams = {
          TableName: process.env.AWS_DYNAMODB_TABLE_NAME || '',
          Key: {
            userID: item.userID,
            actionUpdated: item.actionUpdated,
          },
          ExpressionAttributeNames: {
            '#isDeleted': 'isDeleted',
          },
          ExpressionAttributeValues: marshall({
            ':val': true,
          }),
          UpdateExpression: 'SET #isDeleted = :val',
        }
        const command = new UpdateItemCommand(updateParams)
        await dynClient.send(command)
      }
    }
    return data.Items.length
  } catch (err: any) {
    console.error(err)
    throw new Error(err)
  }
}
