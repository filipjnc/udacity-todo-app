import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
const middy = require('middy')
const middyMiddlewares = require('middy/middlewares')
const { cors } = middyMiddlewares

import { getTodosOfUser } from '../../businessLogic/todos'
import { getJWT } from '../utils'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const jwtToken = getJWT(event)
  const items = await getTodosOfUser(jwtToken)
  return {
    statusCode: 200,
    body: JSON.stringify(items)
  }
})

handler.use(
  cors({
    credentials: true
  })
)
