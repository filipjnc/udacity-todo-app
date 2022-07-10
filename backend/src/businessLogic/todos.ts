import * as todosAccess from '../dataLayer/todosAcess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
const uuid = require('uuid')
import { getUserId } from '../auth/utils'

export async function getAllTodos(): Promise<TodoItem[]> {
  return todosAccess.getAllTodos()
}
export async function getTodosOfUser(jwtToken: string): Promise<TodoItem[]> {
  const userId = getUserId(jwtToken)
  return todosAccess.getTodosForUser(userId)
}
export async function createTodo(jwtToken: string, payload: CreateTodoRequest): Promise<TodoItem> {
  const userId = getUserId(jwtToken)
  return todosAccess.createTodo({
    userId,
    todoId: uuid.v4(),
    createdAt: new Date().toISOString(),
    done: false,
    ...payload
  })
}
export async function updateTodo(
  jwtToken: string,
  todoId: TodoItem['todoId'],
  payload: UpdateTodoRequest
): Promise<TodoItem> {
  const userId = getUserId(jwtToken)
  return todosAccess.updateTodo(userId, todoId, payload)
}

export async function deleteTodo(jwtToken: string, todoId: TodoItem['todoId']): Promise<boolean> {
  const userId = getUserId(jwtToken)
  return todosAccess.deleteTodo(userId, todoId)
}

export async function createAttachmentUploadUrl(jwtToken: string, todoId: TodoItem['todoId']): Promise<string> {
  const attachmentId = uuid.v4()
  const userId = getUserId(jwtToken)
  return await todosAccess.getUploadUrl(userId, todoId, attachmentId)
}
