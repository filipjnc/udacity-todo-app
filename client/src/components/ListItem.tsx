import { Check, Trash, Link, LinkBreak, FileArrowDown } from "phosphor-react";
import React from "react";
import { ITask } from "./List";
import styles from "./ListItem.module.css";

export interface IListItemProps extends ITask {
  onDelete: (taskId: string) => void;
  onSelect: (taskId: string) => void;
  onUploadAttachment: (taskId: string) => void;
  onDeleteAttachment: (taskId: string) => void;
}

export default function ListItem({
  content,
  id: taskId,
  isDone,
  attachmentUrl,
  onDelete,
  onSelect,
  onUploadAttachment,
  onDeleteAttachment,
}: IListItemProps) {
  function handleUploadAttachment() {
    onUploadAttachment(taskId);
  }

  function handleDeleteAttachment() {
    onDeleteAttachment(taskId);
  }

  function handleDownloadAttachment() {
    // TODO: Trigger download attachment
  }

  function handleDeleteTask() {
    onDelete(taskId);
  }

  function handleSelectTask() {
    onSelect(taskId);
  }

  return (
    <div className={styles.listItem}>
      <button
        className={
          isDone ? styles.listItemToggleSelected : styles.listItemToggle
        }
        onClick={handleSelectTask}
      >
        {isDone ? <Check size={24}></Check> : null}
      </button>
      <p className={isDone ? styles.listItemTextSelected : styles.listItemText}>
        {content}
      </p>
      {attachmentUrl ? (
        <>
          <button
            className={styles.listItemDownloadAttachmentButton}
            onClick={handleDownloadAttachment}
            title="Download attachment"
          >
            <FileArrowDown size={24}></FileArrowDown>
          </button>
          <button
            className={styles.listItemDeleteAttachmentButton}
            onClick={handleDeleteAttachment}
            title="Delete attachment"
          >
            <LinkBreak size={24}></LinkBreak>
          </button>
        </>
      ) : (
        <button
          className={styles.listItemUploadAttachmentButton}
          onClick={handleUploadAttachment}
          title="Upload attachment"
        >
          <Link size={24}></Link>
        </button>
      )}
      <button
        className={styles.listItemDeleteButton}
        onClick={handleDeleteTask}
        title="Delete task"
      >
        <Trash size={24}></Trash>
      </button>
    </div>
  );
}
