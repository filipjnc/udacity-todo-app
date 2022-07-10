import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
const middy = require('middy')
const middyMiddlewares = require('middy/middlewares')
const { cors, httpErrorHandler } = middyMiddlewares

import * as todos from '../../businessLogic/todos'
import { getJWT } from '../utils'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const jwtToken = getJWT(event)
  try {
    const uploadUrl = await todos.createAttachmentUploadUrl(jwtToken, todoId)
    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl
      })
    }
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify(err)
    }
  }
})

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
