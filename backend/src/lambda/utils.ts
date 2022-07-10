import { APIGatewayProxyEvent } from 'aws-lambda'

export function getJWT(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwt = split[1]
  return jwt
}
