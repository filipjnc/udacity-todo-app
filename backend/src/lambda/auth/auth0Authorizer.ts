import 'source-map-support/register'

import { BaseStatement, CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import * as jwt from 'jsonwebtoken'
import * as jwksClient from 'jwks-rsa'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

const client = jwksClient({
  jwksUri: process.env.AUTH0_JWKS_URI
})

const jwtVerifyOptions: jwt.VerifyOptions = {
  algorithms: ['RS256'],
  issuer: process.env.AUTH0_DOMAIN,
  audience: process.env.AUTH0_AUDIENCE
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')
  if (!authHeader.toLowerCase().startsWith('bearer ')) throw new Error('Invalid authentication header')
  const split = authHeader.split(' ')
  const token = split[1]
  return token
}

async function getKey(header: jwt.JwtHeader) {
  const key = await client.getSigningKey(header.kid)
  return key.getPublicKey()
}

function createAuthorizerResult(principalId: CustomAuthorizerResult['principalId'], effect: BaseStatement['Effect']) {
  return {
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: '*'
        }
      ]
    }
  }
}

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  const token = getToken(event.authorizationToken)
  const decoded = jwt.decode(token, { complete: true })
  const signingKey = await getKey(decoded.header)

  try {
    const result = jwt.verify(token, signingKey, { ...jwtVerifyOptions, complete: true })
    logger.info('User was authorized')
    return createAuthorizerResult(result.payload.sub as string, 'Allow')
  } catch (err) {
    logger.error('User not authorized', { error: err.message })
    return createAuthorizerResult('user', 'Deny')
  }
}
