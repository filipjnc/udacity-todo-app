import React, { useRef, useState } from 'react'
import { Check, Trash, Link, LinkBreak, FileArrowDown } from 'phosphor-react'
import { ITodo } from '../types/Todo'
import styles from './ListItem.module.scss'
import LoadingIndicator from './LoadingIndicator'

export interface IListItemProps extends ITodo {
  onDelete: (todoId: string) => void
  onSelect: (todoId: string, isSelected: boolean) => void
  onUploadAttachment: (todoId: string, file: File, onSettled?: () => void) => void
  onDeleteAttachment: (todoId: string, onSettled?: () => void) => void
}

export default function ListItem({
  todoId,
  content,
  isDone,
  attachmentUrl,
  onDelete,
  onSelect,
  onUploadAttachment,
  onDeleteAttachment
}: IListItemProps) {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  function onFileChangeCapture(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    setIsUploading(true)
    onUploadAttachment(todoId, selectedFile, () => {
      setIsUploading(false)
    })
  }

  function handleUploadAttachment() {
    inputFileRef.current?.click()
  }

  function handleDeleteAttachment() {
    setIsDeleting(true)
    onDeleteAttachment(todoId, () => {
      setIsDeleting(false)
    })
  }

  function handleDownloadAttachment() {
    if (!attachmentUrl) return
    const attachmentId = attachmentUrl.match(/\/([^\/]+)\/?$/)?.[1]
    if (!attachmentId) return
    setIsDownloading(true)
    fetch(attachmentUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = attachmentId
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        setIsDownloading(false)
      })
  }

  function handleDeleteTask() {
    onDelete(todoId)
  }

  function handleSelectTask() {
    onSelect(todoId, !isDone)
  }

  const loading = <LoadingIndicator size={24} style={{ color: 'var(--gray-300)' }} />

  return (
    <div className={styles.listItem}>
      <button className={isDone ? styles.listItemToggleSelected : styles.listItemToggle} onClick={handleSelectTask}>
        {isDone ? <Check size={24}></Check> : null}
      </button>
      <p className={isDone ? styles.listItemTextSelected : styles.listItemText}>{content}</p>
      {attachmentUrl ? (
        <>
          <button
            className={styles.listItemDownloadAttachmentButton}
            onClick={handleDownloadAttachment}
            title="Download attachment"
            disabled={isDownloading}
          >
            {isDownloading ? loading : <FileArrowDown size={24}></FileArrowDown>}
          </button>

          <button
            className={styles.listItemDeleteAttachmentButton}
            onClick={handleDeleteAttachment}
            title="Delete attachment"
            disabled={isDeleting}
          >
            {isDeleting ? loading : <LinkBreak size={24}></LinkBreak>}
          </button>
        </>
      ) : (
        <button
          className={styles.listItemUploadAttachmentButton}
          onClick={handleUploadAttachment}
          title="Upload attachment"
        >
          {isUploading ? loading : <Link size={24}></Link>}
        </button>
      )}
      <button className={styles.listItemDeleteButton} onClick={handleDeleteTask} title="Delete task">
        <Trash size={24}></Trash>
      </button>
      <input type="file" ref={inputFileRef} onChangeCapture={onFileChangeCapture} style={{ display: 'none' }} />
    </div>
  )
}
