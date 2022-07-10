import { ClipboardText } from "phosphor-react";
import { ITask } from "./List";
import styles from "./ListContent.module.css";
import ListItem from "./ListItem";

export interface IListContentProps {
  tasks: ITask[];
  onDelete: (taskId: string) => void;
  onSelect: (taskId: string) => void;
  onUploadAttachment: (taskId: string) => void;
  onDeleteAttachment: (taskId: string) => void;
}

export default function ListContent({
  tasks,
  onDelete,
  onSelect,
  onUploadAttachment,
  onDeleteAttachment,
}: IListContentProps) {
  const tasksCount = tasks.length;
  const doneTasksCount = tasks.filter(
    (task: ITask) => task.isDone === true
  ).length;

  return (
    <div className={styles.listContent}>
      <header className={styles.listContentHeader}>
        <div className={styles.listCreatedTaskCounter}>
          All Tasks
          <span>{tasksCount}</span>
        </div>
        <div className={styles.listDoneTaskCounter}>
          Done Tasks
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
          {tasks.map((task: ITask) => (
            <ListItem
              onDelete={onDelete}
              onSelect={onSelect}
              onUploadAttachment={onUploadAttachment}
              onDeleteAttachment={onDeleteAttachment}
              key={`${task.id}-${task.content}`}
              {...task}
            ></ListItem>
          ))}
        </main>
      )}
    </div>
  );
}
