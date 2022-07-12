export interface TodoItem {
  userId: string
  todoId: string
  createdAt: string
  content: string
  isDone: boolean
  attachmentUrl?: string
}
