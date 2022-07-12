import { CircleNotch } from 'phosphor-react'

import styles from './LoadingIndicator.module.scss'

interface ILoadingIndicatorProps {
  size?: number
  style?: {}
}

export default function ListItem({ size, style }: ILoadingIndicatorProps) {
  return <CircleNotch size={size} className={styles.icon} style={style} />
}
