# JWKS Endpoint

The JWKS (JSON Web Key Set) Endpoint contains the public keys used by the OpenID Provider to sign ID tokens.

## Endpoint URL
```
GET /jwks
```

## Purpose
- Publish the public keys for validating ID token signatures
- Enable secure verification of issued tokens
- Support key rotation without service interruption

## Example Request
```
GET /jwks HTTP/1.1
Host: server.example.com
```

## Example Response
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "keys": [
    {
      "kid": "key1",
      "kty": "RSA",
      "alg": "RS256",
      "use": "sig",
      "n": "0vx7agoebGcQSuuPiLJXZptN9nndzPwTi...",
      "e": "AQAB"
    }
  ]
}
```

## Key Properties

| Property | Description |
|----------|-------------|
| `kid` | Key ID - identifies the key |
| `kty` | Key Type (RSA, EC) |
| `alg` | Algorithm used for signing |
| `use` | Public key use (sig for signature) |
| `n` | Modulus for RSA key |
| `e` | Exponent for RSA key |

## Validation Process
1. Retrieve the JWKS from the endpoint
2. Find the key matching the `kid` in the ID token header
3. Use the public key to verify the token signature
4. Validate other token claims (expiration, issuer, etc.)