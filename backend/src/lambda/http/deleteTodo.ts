import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
const middy = require('middy')
const middyMiddlewares = require('middy/middlewares')
const { cors, httpErrorHandler } = middyMiddlewares

import { deleteTodo } from '../../businessLogic/todos'
import { getJWT } from '../utils'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const jwtToken = getJWT(event)
  try {
    const success = await deleteTodo(jwtToken, todoId)
    return {
      statusCode: success ? 200 : 400,
      body: null
    }
  } catch (err) {
    return {
      statusCode: 400,
      body: null
    }
  }
})

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
