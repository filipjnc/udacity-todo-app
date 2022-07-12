export interface ITodo {
  todoId: string
  createdAt: string
  content: string
  isDone: boolean
  attachmentUrl?: string | null
}

export interface ICreateTodoPayload {
  content: string
}

export interface IUpdateTodoPayload {
  content?: string
  isDone?: boolean
  attachmentUrl?: string | null
}
