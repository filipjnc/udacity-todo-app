import { useAuth0 } from '@auth0/auth0-react'
import { ToastContainer } from 'react-toastify'
import styles from './App.module.scss'
import { Header } from './components/Header'
import { List } from './components/List'
import LoadingIndicator from './components/LoadingIndicator'

function App() {
  const { isLoading, isAuthenticated } = useAuth0()
  return (
    <div className={styles.wrapper}>
      <Header />
      {isLoading ? (
        <LoadingIndicator size={48} style={{ marginTop: '1.5rem' }} />
      ) : (
        <main className={styles.content}>{isAuthenticated && <List />}</main>
      )}
      <ToastContainer theme="light" autoClose={2000} />
    </div>
  )
}

export default App
