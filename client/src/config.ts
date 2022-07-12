export const isProd = import.meta.env.PROD
export const baseUrl = import.meta.env.BASE_URL
export const apiEndpoint = import.meta.env.VITE_API_ENDPOINT
export const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN
export const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE
export const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID
export const auth0CallbackUrl = import.meta.env.VITE_AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
