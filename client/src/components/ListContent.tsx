import { ClipboardText } from 'phosphor-react'
import { ITodo } from '../types/Todo'
import styles from './ListContent.module.scss'
import ListItem from './ListItem'

export interface IListContentProps {
  tasks: ITodo[]
  onDelete: (todoId: string) => void
  onSelect: (todoId: string, isSelected: boolean) => void
  onUploadAttachment: (todoId: string, file: File, onSettled?: () => void) => void
  onDeleteAttachment: (todoId: string, onSettled?: () => void) => void
}

export default function ListContent({
  tasks,
  onDelete,
  onSelect,
  onUploadAttachment,
  onDeleteAttachment
}: IListContentProps) {
  const tasksCount = tasks.length
  const doneTasksCount = tasks.filter((task: ITodo) => task.isDone === true).length

  return (
    <div className={styles.listContent}>
      <header className={styles.listContentHeader}>
        <div className={styles.listCreatedTaskCounter}>
          All Tasks
          <span>{tasksCount}</span>
        </div>
        <div className={styles.listDoneTaskCounter}>
          Completed
          <span>
            {doneTasksCount} of {tasksCount}
          </span>
        </div>
      </header>
      {tasks.length === 0 ? (
        <div className={styles.emptyList}>
          <ClipboardText size={72}></ClipboardText>
          <strong>You don't have any tasks registered yet.</strong>
          <p>Create tasks and organize your to-do items</p>
        </div>
      ) : (
        <main className={styles.listItensContainer}>
          {tasks.map((task: ITodo) => (
            <ListItem
              onDelete={onDelete}
              onSelect={onSelect}
              onUploadAttachment={onUploadAttachment}
              onDeleteAttachment={onDeleteAttachment}
              key={`${task.todoId}-${task.content}`}
              {...task}
            ></ListItem>
          ))}
        </main>
      )}
    </div>
  )
}
