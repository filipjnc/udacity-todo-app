import React from 'react'
import styles from './Header.module.scss'

import todoLogo from '../assets/todoLogo.svg'
import { SignIn, SignOut } from 'phosphor-react'
import { useAuth0 } from '@auth0/auth0-react'
import { auth0CallbackUrl } from '../config'

export function Header() {
  const { isLoading, isAuthenticated, loginWithPopup: auth0Login, logout: auth0Logout } = useAuth0()

  function login() {
    auth0Login()
  }

  function logout() {
    auth0Logout({ returnTo: auth0CallbackUrl })
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <img src={todoLogo} alt="Todo App" />
        <div className={styles.authActions}>
          {isLoading ? null : isAuthenticated ? (
            <button className={styles.logoutButton} onClick={logout}>
              <SignOut size={18} />
              Sign out
            </button>
          ) : (
            <button className={styles.loginButton} onClick={login}>
              <SignIn size={18} />
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
