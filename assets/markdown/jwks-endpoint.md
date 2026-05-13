# JWKS Endpoint

When your app receives an ID token, how does it know the token is legit and not forged? That's where the JWKS Endpoint comes in.

## The URL
```
GET https://auth.server.com/jwks
```

## What It Does

The JWKS (JSON Web Key Set) endpoint publishes the **public keys** that the authorization server uses to sign tokens. Think of it like a public key directory — anyone can look up the keys here, but only the server holds the private keys needed to create signatures.

Here's the flow:

1. Your app gets an ID token back from the token endpoint
2. The token's header says "hey, I was signed with key #abc123" (via the `kid` field)
3. Your app fetches `GET /jwks` to get the server's public keys
4. Your app finds the matching key and verifies the signature
5. If the signature checks out, you know the token is authentic

## What You Get Back

```json
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

## The Key Fields

| Field | What It Means |
|-------|---------------|
| `kid` | Key ID — this is how the token tells you which key to use |
| `kty` | Key type — usually RSA or EC (the crypto algorithm family) |
| `alg` | The specific signing algorithm (RS256 = RSA with SHA-256) |
| `use` | What the key is for — `sig` means signatures, `enc` means encryption |
| `n` | The RSA modulus (the big number that makes RSA work) |
| `e` | The RSA public exponent (usually "AQAB" = 65537) |

## Why This Matters

**Key rotation without downtime.** The server can add new keys to the JWKS set and remove old ones anytime. Since your app looks up the key by `kid` at verification time, you never need a manual update. The server rolls its keys, and your app just follows along.

## The Verification Checklist

1. Grab the JWKS from `GET /jwks`
2. Match the `kid` in the token header to a key in the set
3. Use that public key to verify the token's signature
4. Check the usual claims (expiration, issuer, audience)

No match found for the `kid`? The token is suspect — reject it.
