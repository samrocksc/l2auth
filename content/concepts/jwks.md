# JWKS Endpoint

When your app receives an ID token, how does it know the token is legitimate and not forged? That is where the JWKS (JSON Web Key Set) endpoint comes in.

## The URL

The discovery document publishes the exact location, usually:

```http
GET https://auth.example.com/.well-known/jwks.json
```

## What It Does

The JWKS endpoint publishes the **public keys** that the authorization server uses to sign tokens. Think of it as a public key directory: anyone can look up the keys, but only the server holds the private keys needed to create signatures.

The flow:

1. Your app receives an ID token from the token endpoint.
2. The token header contains a `kid` (key ID) that identifies the signing key.
3. Your app fetches the JWKS.
4. Your app finds the matching key and verifies the signature.
5. If the signature checks out, the token was signed by the provider.

## What You Get Back

```json
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

| Field | What it means                                                        |
| ----- | -------------------------------------------------------------------- |
| `kid` | Key ID. This is how the token tells you which key to use.            |
| `kty` | Key type. Usually RSA or EC.                                         |
| `alg` | Signing algorithm, such as RS256 (RSA with SHA-256).                 |
| `use` | What the key is for. `sig` means signatures; `enc` means encryption. |
| `n`   | The RSA modulus.                                                     |
| `e`   | The RSA public exponent, usually `AQAB` (65537).                     |

## Why This Matters

**Key rotation without downtime.** The provider can add new keys to the JWKS set and remove old ones at any time. Because your app looks up the key by `kid` at verification time, you never need a manual update.

Providers should publish a new key before signing tokens with it, and keep the old key available until every token signed with it has expired.

## The Verification Checklist

1. Fetch the JWKS from the `jwks_uri` in the discovery document.
2. Match the `kid` in the token header to a key in the set.
3. Confirm the key's `alg` is one you allow.
4. Use the public key to verify the token signature.
5. Check the usual claims: `iss`, `aud`, `exp`, and `nonce`.

If no key matches the `kid`, reject the token and refresh the JWKS cache. Do not fall back to an unverified token.

## Caching

Cache the JWKS, but not forever:

- Cache keys for a short period, such as minutes to hours.
- On an unknown `kid`, refetch once before rejecting.
- Rate-limit refetches so an attacker cannot force a fetch storm.
- Respect `Cache-Control` headers when the provider sends them.

## Common Mistakes

- Skipping signature verification because the token "looks valid."
- Trusting an `alg` value from the token without allowlisting algorithms.
- Using the ID token's `kid` to fetch a key from an attacker-controlled URL.
- Never refreshing a cached JWKS after the provider rotates keys.
