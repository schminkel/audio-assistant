import { S3 } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { v4 } from 'uuid'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Conditions } from '@aws-sdk/s3-presigned-post/dist-types/types'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export async function POST() {
  try {
    const userId = headers().get('userid')
    const filename = headers().get('filename')
    if (userId === null || filename === null) {
      return NextResponse.json(
        {
          error: 'missing required header userid or filename',
          message: 'missing required header userid or filename',
          url: '',
          fields: '',
        },
        { status: 500 },
      )
    }

    const response = await fetch(`${baseUrl}/api/quota?userId=${userId}`)
    const { freeAvailable } = await response.json()

    if (freeAvailable) {
      const { url, fields } = await getSignedUrl(filename)
      if (url) {
        return NextResponse.json({ url, fields })
      } else {
        return NextResponse.json(
          {
            error: '[1] failed to create presigned post url',
            message: response,
            url: '',
            fields: '',
          },
          { status: 500 },
        )
      }
    } else {
      return NextResponse.json(
        {
          error:
            'Dein Kontingent an kostenfreien Anfragen ist für heute bereits ausgeschöpft.',
          message: response,
          url: '',
          fields: '',
        },
        { status: 500 },
      )
    }
  } catch (err: any) {
    return NextResponse.json(
      {
        error: '[2] failed to create presigned post url',
        message: err.message,
        stack: err.stack,
        url: '',
        fields: '',
      },
      { status: 500 },
    )
  }
}

/**
 * Generates a signed URL for uploading a file to S3
 */
async function getSignedUrl(filename: string) {
  const s3Client = new S3({
    region: process.env.AWS_REGION || '',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  })

  const bucket = process.env.AWS_BUCKET_NAME || ''
  const key = v4() + '_' + filename
  const fields = { acl: 'public-read' }

  const conditions: Conditions[] = [
    ['starts-with', '$Content-Type', ''], // allow any content type
    ['content-length-range', 1, 536870912], // 1 byte to 512 MB
  ]

  return await createPresignedPost(s3Client, {
    Bucket: bucket,
    Key: key,
    Conditions: conditions,
    Fields: fields,
    Expires: 60,
  })
}
