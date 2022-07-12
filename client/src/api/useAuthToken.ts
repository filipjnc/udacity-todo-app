import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'

export function useAuthToken() {
  const { getAccessTokenSilently } = useAuth0()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getAccessTokenSilently()
        setToken(token)
      } catch (e) {
        setToken(null)
        console.error(e)
      }
    }
    fetchToken()
  }, [getAccessTokenSilently])

  return { token }
}
