# OIDC Discovery Document

If you've ever set up a social login (Sign in with Google, Apple, etc.), at some point you had to enter URLs like "Authorization Endpoint" and "Token Endpoint" into a config screen. The Discovery Document makes that whole process automatic.

## The URL
```
GET https://auth.server.com/.well-known/openid-configuration
```

The `/.well-known/` prefix is a standard pattern — it means "this URL is always in the same place, on every server." No guessing where the config lives.

## What It Does

The Discovery Document is a JSON file that tells client apps everything they need to know about the OpenID Connect provider. It's like a restaurant menu — one glance tells you what's available and where to find it.

A client can bootstrap itself with just one URL. Here's how:

1. The client knows the provider's base URL (e.g., `https://accounts.google.com`)
2. It appends `/.well-known/openid-configuration`
3. The response tells it every endpoint URL, supported feature, and capability
4. The client configures itself automatically — no manual setup needed

## What You Get Back

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "issuer": "https://server.example.com",
  "authorization_endpoint": "https://server.example.com/authorize",
  "token_endpoint": "https://server.example.com/token",
  "userinfo_endpoint": "https://server.example.com/userinfo",
  "jwks_uri": "https://server.example.com/jwks",
  "scopes_supported": [
    "openid", "profile", "email"
  ],
  "response_types_supported": [
    "code", "token", "id_token"
  ],
  "subject_types_supported": [
    "public"
  ],
  "id_token_signing_alg_values_supported": [
    "RS256"
  ]
}
```

## What It Tells You

| Field | What It Means |
|-------|---------------|
| `issuer` | Who runs this server — the unique identifier for this provider |
| `*_endpoint` | The actual URLs for each OIDC endpoint |
| `jwks_uri` | Where to find public keys for token verification |
| `*_supported` | What features this server supports (scopes, algorithms, etc.) |

## Why This Matters

**No more hardcoding URLs.** Your app only needs to know one thing — the provider's issuer URL. Everything else is discovered automatically. If the provider moves an endpoint or adds support for a new algorithm, the discovery document updates and your app adapts without a code change.

It's also how libraries and SDKs handle "one-click" OIDC setup. Ever wondered how a social login button just works? It starts here.
