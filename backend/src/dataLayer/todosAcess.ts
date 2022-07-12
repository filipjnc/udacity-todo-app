import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { docClient } from '.'
import { s3 } from '.'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const logger = createLogger('TodosAccess')
const todosTable = process.env.TODOS_TABLE
const attachmentBucket = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export async function getAllTodos(): Promise<TodoItem[]> {
  logger.info('Getting all todos')

  const response = await docClient
    .scan({
      TableName: todosTable
    })
    .promise()

  return response.Items as TodoItem[]
}

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  logger.info('Getting todos for user', { userId })

  const response = await docClient
    .query({
      TableName: todosTable,
      IndexName: process.env.TODOS_LSI_CREATED_AT,
      ScanIndexForward: false,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    })
    .promise()

  return response.Items as TodoItem[]
}

export async function createTodo(todo: TodoItem): Promise<TodoItem> {
  const { userId, todoId, content } = todo
  logger.info('Creating todo', { userId, todoId, content })

  try {
    await docClient
      .put({
        TableName: todosTable,
        Item: todo
      })
      .promise()
    return todo
  } catch (err) {
    logger.info('Error creating todo', { userId, todoId, err })
  }
}

const generateUpdateQuery = (fields) => {
  let exp = {
    UpdateExpression: 'set',
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {}
  }
  Object.entries(fields).forEach(([key, item]) => {
    exp.UpdateExpression += ` #${key} = :${key},`
    exp.ExpressionAttributeNames[`#${key}`] = key
    exp.ExpressionAttributeValues[`:${key}`] = item
  })
  exp.UpdateExpression = exp.UpdateExpression.slice(0, -1)
  return exp
}

export async function updateTodo(
  userId: TodoItem['userId'],
  todoId: TodoItem['todoId'],
  update: UpdateTodoRequest
): Promise<TodoItem> {
  logger.info('Updating todo', { userId, todoId })

  try {
    const response = await docClient
      .update({
        TableName: todosTable,
        Key: { userId, todoId },
        ...generateUpdateQuery(update),
        ReturnValues: 'ALL_NEW'
      })
      .promise()
    return response.Attributes as TodoItem
  } catch (err) {
    logger.info('Error updating todo', { userId, todoId, err })
  }
}

export async function deleteTodo(userId: TodoItem['userId'], todoId: TodoItem['todoId']): Promise<boolean> {
  logger.info('Deleting todo', { userId, todoId })

  try {
    await docClient
      .delete({
        TableName: todosTable,
        Key: { userId, todoId }
      })
      .promise()
    return true
  } catch (err) {
    logger.info('Error deleting todo', { userId, todoId, err })
    return false
  }
}

export async function getUploadUrl(userId: string, todoId: string, attachmentId: string) {
  const uploadUrl: string = s3.getSignedUrl('putObject', {
    Bucket: attachmentBucket,
    Key: attachmentId,
    Expires: parseInt(urlExpiration, 10)
  })
  logger.info('Updating todo attachment', { userId, todoId })
  try {
    const attachmentUrl = `https://${attachmentBucket}.s3.amazonaws.com/${attachmentId}`
    await docClient
      .update({
        TableName: todosTable,
        Key: { userId, todoId },
        UpdateExpression: 'SET attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl
        }
      })
      .promise()
    return {
      uploadUrl,
      attachmentUrl
    }
  } catch (err) {
    logger.info('Error updating todo attachment', { userId, todoId, err })
  }
}
