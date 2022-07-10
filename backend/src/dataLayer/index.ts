import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
const AWSXRay = require('aws-xray-sdk')

export const XAWS = AWSXRay.captureAWS(AWS)
export const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()
export const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})
