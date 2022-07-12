import axios from 'axios'
import { apiEndpoint } from '../config'
import { ITodo, ICreateTodoPayload, IUpdateTodoPayload } from '../types/Todo'

export async function getTodos(token: string): Promise<ITodo[]> {
  const response = await axios.get(`${apiEndpoint}/todos`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

export async function createTodo(token: string, newTodo: ICreateTodoPayload): Promise<ITodo> {
  const response = await axios.post(`${apiEndpoint}/todos`, JSON.stringify(newTodo), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

export async function updateTodo(token: string, todoId: string, updatedTodo: IUpdateTodoPayload): Promise<void> {
  await axios.patch(`${apiEndpoint}/todos/${todoId}`, JSON.stringify(updatedTodo), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
}

export async function deleteTodo(token: string, todoId: string): Promise<void> {
  await axios.delete(`${apiEndpoint}/todos/${todoId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
}

export async function uploadAttachment(token: string, todoId: string, file: File): Promise<string> {
  const response = await axios.post(`${apiEndpoint}/todos/${todoId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const { uploadUrl, attachmentUrl } = response.data.uploadUrl
  await axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': file.type
    }
  })
  return attachmentUrl
}

export async function deleteAttachment(token: string, todoId: string): Promise<void> {
  const update: IUpdateTodoPayload = {
    attachmentUrl: null
  }
  await axios.patch(`${apiEndpoint}/todos/${todoId}`, JSON.stringify(update), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
}
