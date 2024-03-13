/**
 * This API endpoint returns the action history for a given user id,
 * considering a given number of days ago to show limited results.
 */
import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

const dynClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

/**
 * Entry point for the request
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const daysAgo = searchParams.get('daysAgo')
    let items: Record<string, any>[]
    const date = new Date()
    let daysAgoISOString

    if (daysAgo) {
      date.setDate(date.getDate() - Number.parseInt(daysAgo))
      daysAgoISOString = date.toISOString()
    } else {
      date.setDate(date.getDate() - 365)
      daysAgoISOString = date.toISOString()
    }

    if (userId) {
      items = await getItemsForUserId(userId, daysAgoISOString)
    } else {
      items = await getAllItems(daysAgoISOString)
    }

    // remove actionResult from items that are marked as deleted
    for (let obj of items) {
      if (obj.isDeleted) {
        if (obj.actionType === 'audio') {
          obj.actionResult = ''
        } else {
          obj.actionResult = 'gelöscht'
        }
      }
    }

    if (items) {
      return NextResponse.json(items, { status: 200 })
    } else {
      return NextResponse.json('[1] NO ITEMS found in action history', {
        status: 200,
      })
    }
  } catch (err: any) {
    return NextResponse.json(
      {
        error: '[2] failed to get action history',
        message: err.message,
        stack: err.stack,
      },
      { status: 500 },
    )
  }
}

/**
 * Get items from DynamoDB filtered by 'actionUpdated' attribute
 */
async function getAllItems(
  daysAgoISOString: string,
): Promise<Record<string, any>[]> {
  const params = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME || '',
    KeyConditionExpression: 'actionVersion = :v and actionUpdated >= :d',
    ExpressionAttributeValues: marshall({
      ':v': '1.0',
      ':d': daysAgoISOString,
    }),
    ScanIndexForward: false, // sort items by 'actionUpdated' in descending order
  }

  const command = new QueryCommand(params)

  try {
    const data = await dynClient.send(command)
    return data.Items ? data.Items.map((item) => unmarshall(item)) : []
  } catch (error) {
    console.error(error)
    return []
  }
}

/**
 * Get items from DynamoDB filtered by 'actionUpdated' attribute and 'userID'
 */
async function getItemsForUserId(
  userID: string,
  daysAgoISOString: string,
): Promise<Record<string, any>[]> {
  const params = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME || '',
    KeyConditionExpression: 'userID = :u and actionUpdated >= :d',
    ExpressionAttributeValues: marshall({
      ':u': userID,
      ':d': daysAgoISOString,
    }),
    ScanIndexForward: false, // sort the items by 'actionUpdated' in descending order
  }

  const command = new QueryCommand(params)

  try {
    const data = await dynClient.send(command)
    return data.Items ? data.Items.map((item) => unmarshall(item)) : []
  } catch (error) {
    console.error(error)
    return []
  }
}
