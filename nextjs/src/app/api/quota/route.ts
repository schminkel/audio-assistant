/**
 * This API endpoint returns the quota for the user and the global quota
 * for the current day and calculates if free requests are available.
 *
 * http://localhost:3001/api/quota?userId=6f97d05b34e86b4e9b12dc2c152e30df
 */
import { NextRequest, NextResponse } from 'next/server'
import {
  DynamoDBClient,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { QueryCommandInput } from '@aws-sdk/client-dynamodb/dist-types/commands/QueryCommand'

const dynClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const ENTRIES_PER_REQUEST = 3
const REQUESTS_LIMIT_PER_USER = 60
const REQUESTS_LIMIT_GLOBAL = 600

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

    let entriesPerUser =
      (await getNumberDatabaseEntriesCurrentDayPerUser(userId)) || 0
    let entriesGlobal = (await getNumberDatabaseEntriesCurrentDay()) || 0
    let freeAvailable =
      freeAvailableCheck(entriesPerUser, entriesGlobal) || false
    let allEntriesPerUser =
      (await getNumberOfAllDatabaseEntriesPerUser(userId)) || 0

    return NextResponse.json(
      {
        userRequests: entriesPerUser / ENTRIES_PER_REQUEST,
        allUserRequests: allEntriesPerUser / ENTRIES_PER_REQUEST,
        globalRequests: entriesGlobal / ENTRIES_PER_REQUEST,
        freeAvailable: freeAvailable,
        userLimit: REQUESTS_LIMIT_PER_USER,
        globalLimit: REQUESTS_LIMIT_GLOBAL,
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
 * Check if free requests are available considering the limits
 */
function freeAvailableCheck(entriesPerUser: number, entriesGlobal: number) {
  return (
    entriesPerUser >= 0 &&
    entriesGlobal >= 0 &&
    entriesPerUser / ENTRIES_PER_REQUEST < REQUESTS_LIMIT_PER_USER &&
    entriesGlobal / ENTRIES_PER_REQUEST < REQUESTS_LIMIT_GLOBAL
  )
}

/**
 * Get the number of entries for the current day for a specific user from the database
 */
async function getNumberDatabaseEntriesCurrentDayPerUser(userID: string) {
  const params: QueryCommandInput = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME || '',
    KeyConditionExpression: 'userID = :u and actionUpdated >= :d',
    ExpressionAttributeValues: marshall({
      ':u': userID,
      ':d': getISODateStringMidnightYesterday(),
    }),
    ScanIndexForward: false, // This will sort the items by 'actionUpdated' in descending order
    Select: 'COUNT',
  }
  const command = new QueryCommand(params)
  try {
    const data = await dynClient.send(command)
    return data.Count
  } catch (error) {
    console.error(error)
  }
}

/**
 * Get the number of all entries for a specific user from the database
 */
async function getNumberOfAllDatabaseEntriesPerUser(userID: string) {
  const params: QueryCommandInput = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME || '',
    KeyConditionExpression: 'userID = :u',
    ExpressionAttributeValues: marshall({
      ':u': userID,
    }),
    ScanIndexForward: false, // This will sort the items by 'actionUpdated' in descending order
    Select: 'COUNT',
  }
  const command = new QueryCommand(params)
  try {
    const data = await dynClient.send(command)
    return data.Count
  } catch (error) {
    console.error(error)
  }
}

/**
 * Get the ISO date string for midnight yesterday
 */
function getISODateStringMidnightYesterday() {
  const date = new Date()
  let daysAgoISOString

  date.setDate(date.getDate())
  date.setHours(0, 0, 0, 0)

  const timezoneOffsetInMs = date.getTimezoneOffset() * 60 * 1000
  date.setTime(date.getTime() - timezoneOffsetInMs)

  daysAgoISOString = date.toISOString()

  return daysAgoISOString
}

/**
 * Get the number of entries for the current day from the database
 */
async function getNumberDatabaseEntriesCurrentDay() {
  const params: QueryCommandInput = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME || '',
    FilterExpression: 'actionUpdated >= :d',
    ExpressionAttributeValues: marshall({
      ':d': getISODateStringMidnightYesterday(),
    }),
    ScanIndexForward: false, // this will sort the items by 'actionUpdated' in descending order
    Select: 'COUNT',
  }
  const command = new ScanCommand(params)
  try {
    const data = await dynClient.send(command)
    return data.Count
  } catch (error) {
    console.error(error)
  }
}
