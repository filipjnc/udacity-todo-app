import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
const middy = require('middy')
const middyMiddlewares = require('middy/middlewares')
const { cors } = middyMiddlewares
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getJWT } from '../utils'
import { createTodo } from '../../businessLogic/todos'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const payload: CreateTodoRequest = JSON.parse(event.body)
  const jwtToken = getJWT(event)
  try {
    const createdItem = await createTodo(jwtToken, payload)
    return {
      statusCode: 200,
      body: JSON.stringify(createdItem)
    }
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify(err)
    }
  }
})

handler.use(
  cors({
    credentials: true
  })
)
