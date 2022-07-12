import { PlusCircle } from 'phosphor-react'
import React, { FormEvent, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { createTodo, deleteAttachment, deleteTodo, getTodos, updateTodo, uploadAttachment } from '../api/todos-api'
import { useAuthToken } from '../api/useAuthToken'
import { ITodo, ICreateTodoPayload, IUpdateTodoPayload } from '../types/Todo'
import styles from './List.module.scss'
import ListContent from './ListContent'
import LoadingIndicator from './LoadingIndicator'

export function List() {
  const queryClient = useQueryClient()
  const [newTaskText, setNewTaskText] = useState<string>('')
  const { token } = useAuthToken()
  const { data: tasks, isFetched } = useQuery('todos', () => getTodos(token!), { enabled: !!token, initialData: [] })
  const { mutate: createTodoMutation, isLoading: isCreating } = useMutation(
    (payload: ICreateTodoPayload) => createTodo(token!, payload),
    {
      onMutate: async (newTodo) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(['todos'])
        // Snapshot the previous value
        const previousTodo = queryClient.getQueryData(['todos'])
        // Optimistically update to the new value
        queryClient.setQueryData(['todos'], (old) => [newTodo, ...(old as any[])])
        // Return a context with the previous and new todo
        return { previousTodo, newTodo }
      },
      onSuccess: () => {
        setNewTaskText('')
        toast.success('Task created successfully')
      },
      // If the mutation fails, use the context we returned above
      onError: (err, newTodo, context: any) => {
        queryClient.setQueryData(['todos'], context.previousTodos)
        toast.error('Task could not be created')
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(['todos'])
      }
    }
  )
  const { mutate: deleteTodoMutation } = useMutation((todoId: ITodo['todoId']) => deleteTodo(token!, todoId), {
    onMutate: async (todoId) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(['todos'])
      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData<ITodo[]>(['todos'])
      if (!previousTodos) return
      const todos = [...previousTodos].filter((todo) => todo.todoId !== todoId)
      // Optimistically update to the new value
      queryClient.setQueryData(['todos'], todos)
      // Return a context with the previous and new todo
      return { previousTodos }
    },
    onSuccess: () => {
      toast.success('Task deleted successfully')
    },
    onError: (err, payload, context: any) => {
      toast.error('Task could not be deleted')
      queryClient.setQueryData(['todos'], context.previousTodos)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['todos'])
    }
  })
  const { mutate: updateTodoMutation } = useMutation(
    ({ todoId, payload }: { todoId: ITodo['todoId']; payload: IUpdateTodoPayload }) =>
      updateTodo(token!, todoId, payload),
    {
      onMutate: async ({ todoId, payload }) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(['todos'])
        // Snapshot the previous value
        const previousTodos = queryClient.getQueryData<ITodo[]>(['todos'])
        if (!previousTodos) return
        const todos = [...previousTodos]
        const updatedTodoIndex = todos?.findIndex((todo) => todo.todoId === todoId)
        const updatedTodo = {
          ...previousTodos[updatedTodoIndex],
          ...payload
        }
        todos[updatedTodoIndex] = updatedTodo
        // Optimistically update to the new value
        queryClient.setQueryData(['todos'], todos)
        // Return a context with the previous and new todo
        return { previousTodos, updatedTodo }
      },
      onSuccess: () => {
        toast.success('Task updated successfully')
      },
      onError: (err, payload, context: any) => {
        toast.error('Task could not be updated')
        queryClient.setQueryData(['todos'], context.previousTodos)
      },
      onSettled: () => {
        queryClient.invalidateQueries(['todos'])
      }
    }
  )
  const { mutate: uploadAttachmentMutation } = useMutation(
    ({ todoId, file }: { todoId: ITodo['todoId']; file: File }) => uploadAttachment(token!, todoId, file),
    {
      onSuccess: (attachmentUrl) => {
        toast.success('Attachment uploaded successfully')
        queryClient.invalidateQueries(['todos'])
      },
      onError: (err) => {
        toast.error('Could not upload attachment')
      }
    }
  )
  const { mutate: deleteAttachmentMutation } = useMutation(
    ({ todoId }: { todoId: ITodo['todoId'] }) => deleteAttachment(token!, todoId),
    {
      onSuccess: () => {
        toast.success('Attachment deleted successfully')
        queryClient.invalidateQueries(['todos'])
      },
      onError: (err) => {
        toast.error('Could not delete attachment')
      }
    }
  )

  function handleNewCommentInvalid(event: any) {
    event.target.setCustomValidity('This field is mandatory')
  }

  function handleTypeNewTaskText(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.setCustomValidity('')
    setNewTaskText(event.target.value)
  }

  function handleCreateNewTask(event: FormEvent) {
    event.preventDefault()
    createTodoMutation({
      content: newTaskText
    })
  }

  function selectTask(todoId: string, isSelected: boolean) {
    updateTodoMutation({
      todoId,
      payload: {
        isDone: isSelected
      }
    })
  }

  function deleteTask(todoId: string) {
    deleteTodoMutation(todoId)
  }

  function uploadTaskAttachment(todoId: string, file: File, onSettled?: () => void) {
    uploadAttachmentMutation({ todoId, file }, { onSettled })
  }

  function deleteTaskAttachment(todoId: string, onSettled?: () => void) {
    deleteAttachmentMutation({ todoId }, { onSettled })
  }

  return (
    <div className={styles.list}>
      <header className={styles.listHeader}>
        <form onSubmit={handleCreateNewTask}>
          <input
            placeholder="Add a new task"
            type="text"
            id="newTask"
            value={newTaskText}
            required
            onInvalid={handleNewCommentInvalid}
            onChange={(e) => handleTypeNewTaskText(e)}
            className={styles.listInputNewTask}
            disabled={isCreating}
          />
          <button type="submit" className={styles.listButtonNewTask} disabled={isCreating}>
            <PlusCircle size={18}></PlusCircle>
            Add
          </button>
        </form>
      </header>
      {!isFetched ? (
        <LoadingIndicator size={48} />
      ) : (
        <ListContent
          onDelete={deleteTask}
          onSelect={selectTask}
          onUploadAttachment={uploadTaskAttachment}
          onDeleteAttachment={deleteTaskAttachment}
          tasks={tasks!}
        ></ListContent>
      )}
    </div>
  )
}
