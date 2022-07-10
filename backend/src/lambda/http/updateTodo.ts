import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
const middy = require('middy')
const middyMiddlewares = require('middy/middlewares')
const { cors, httpErrorHandler } = middyMiddlewares

import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getJWT } from '../utils'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const jwtToken = getJWT(event)
  const payload: UpdateTodoRequest = JSON.parse(event.body)
  try {
    const updatedItem = await updateTodo(jwtToken, todoId, payload)
    return {
      statusCode: 200,
      body: JSON.stringify(updatedItem)
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
