# OpenID Connect Discovery Document

## What It Is

The OpenID Connect Discovery Document is a standard JSON endpoint that acts as the service manual for an OIDC provider. One URL tells a client everything it needs to know: where the endpoints live, which algorithms the provider supports, which scopes are available, and more.

Instead of hardcoding URLs or maintaining manual configuration, a client fetches this document at startup and discovers every endpoint and capability.

## The URL

```http
GET https://{provider}/.well-known/openid-configuration
```

The `/.well-known/` prefix is defined by [RFC 8615](https://www.rfc-editor.org/rfc/rfc8615). It means "this path is always in the same place on every server." No guessing, no custom configuration, no vendor-specific setup.

| Provider       | Discovery URL                                                                          |
| -------------- | -------------------------------------------------------------------------------------- |
| Google         | `https://accounts.google.com/.well-known/openid-configuration`                         |
| Auth0          | `https://{tenant}.auth0.com/.well-known/openid-configuration`                          |
| Microsoft      | `https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration`     |
| Amazon Cognito | `https://cognito-idp.{region}.amazonaws.com/{poolId}/.well-known/openid-configuration` |

## What It Returns

The response is a JSON document with fields defined by the [OpenID Connect Discovery specification](https://openid.net/specs/openid-connect-discovery-1_0.html). A representative example:

```json
{
  "issuer": "https://auth.example.com",
  "authorization_endpoint": "https://auth.example.com/authorize",
  "token_endpoint": "https://auth.example.com/token",
  "userinfo_endpoint": "https://auth.example.com/userinfo",
  "jwks_uri": "https://auth.example.com/.well-known/jwks.json",
  "registration_endpoint": "https://auth.example.com/register",
  "scopes_supported": ["openid", "profile", "email", "address", "phone"],
  "response_types_supported": ["code", "id_token", "token id_token"],
  "response_modes_supported": ["query", "fragment", "form_post"],
  "grant_types_supported": ["authorization_code", "implicit", "refresh_token"],
  "id_token_signing_alg_values_supported": [
    "RS256",
    "RS384",
    "RS512",
    "ES256",
    "ES384",
    "ES512"
  ],
  "subject_types_supported": ["public"],
  "claims_supported": [
    "sub",
    "iss",
    "aud",
    "exp",
    "iat",
    "name",
    "email",
    "picture"
  ]
}
```

### Field Reference

| Field                                   | Type   | What it tells you                                                                          |
| --------------------------------------- | ------ | ------------------------------------------------------------------------------------------ |
| `issuer`                                | string | The unique identifier for this provider. Verify it matches the `iss` claim in every token. |
| `authorization_endpoint`                | URL    | Where to redirect the user for login.                                                      |
| `token_endpoint`                        | URL    | Where to exchange authorization codes for tokens.                                          |
| `userinfo_endpoint`                     | URL    | Where to fetch profile claims with an access token.                                        |
| `jwks_uri`                              | URL    | Where to download public keys for signature verification.                                  |
| `registration_endpoint`                 | URL    | Where clients can register dynamically (optional).                                         |
| `scopes_supported`                      | array  | Scopes the server recognizes.                                                              |
| `response_types_supported`              | array  | Response types the server supports.                                                        |
| `response_modes_supported`              | array  | How the server returns responses: query, fragment, or form POST.                           |
| `grant_types_supported`                 | array  | OAuth grant types the server supports.                                                     |
| `id_token_signing_alg_values_supported` | array  | Signing algorithms used for ID tokens.                                                     |
| `subject_types_supported`               | array  | Whether subject identifiers are `public` or `pairwise`.                                    |
| `claims_supported`                      | array  | Claims the server can return about a user.                                                 |

## How Clients Use It

A client only needs the provider's issuer URL:

![Discovery bootstrapping from an issuer URL](../assets/diagrams/discovery-bootstrapping.svg)

1. Configure the client with the issuer URL, such as `https://auth.example.com`.
2. Append `/.well-known/openid-configuration` and fetch the document.
3. Extract the endpoint URLs and supported features.
4. Configure the OIDC library automatically.

Most OIDC SDKs do this for you. When you configure a library with `issuer: "https://accounts.google.com"`, it fetches the Discovery Document and wires everything up.

## Zero-Downtime Changes

The Discovery Document lets providers change infrastructure without breaking clients:

- **Endpoint migration:** the provider moves `/token` to `/v2/token` and updates the document. Clients pick up the new URL on their next fetch.
- **New algorithm support:** the provider adds a stronger algorithm to `id_token_signing_alg_values_supported`.
- **Deprecation:** the provider removes a feature from the `*_supported` arrays.

Clients typically cache the document for hours or days, so changes propagate gradually.

## Key Rotation Tie-In

The `jwks_uri` field points to the JSON Web Key Set endpoint. That is how key rotation works:

1. The provider generates a new key pair and adds the public key to the JWKS endpoint.
2. New tokens are signed with the new key and carry its `kid` in the header.
3. The JWKS endpoint serves both old and new public keys.
4. Clients fetch keys at verification time and match by `kid`.
5. Old keys are removed once all tokens signed with them have expired.

[Full deep-dive on the JWKS endpoint](jwks.html)

## Real-World Notes

Provider behavior varies, so verify these details against the live discovery document:

- **Google** publishes a large scope catalog and commonly uses pairwise subject identifiers for privacy.
- **Auth0** uses tenant-specific subdomains. It supports multiple signing algorithms, but RS256 is the usual default.
- **Microsoft** uses tenant-specific issuer URLs, so the discovery URL changes per tenant.
- **Amazon Cognito** includes the user-pool ID in the issuer path.

## Dynamic Client Registration

If the document includes a `registration_endpoint`, clients can register themselves programmatically. The client sends a POST request with metadata:

```json
{
  "client_name": "My App",
  "redirect_uris": ["https://myapp.com/callback"],
  "grant_types": ["authorization_code", "refresh_token"],
  "token_endpoint_auth_method": "client_secret_basic",
  "scope": "openid profile email"
}
```

The server responds with a registered client ID and, for confidential clients, a client secret. Dynamic registration is optional and is often restricted to trusted callers.

## How SDKs Use It

| Library or SDK     | How it uses discovery                                               |
| ------------------ | ------------------------------------------------------------------- |
| NextAuth.js        | Provider presets fetch the discovery document and wire up endpoints |
| Spring Security    | `issuer-uri` triggers auto-discovery                                |
| oauth2-proxy       | Provider presets use discovery to find endpoints                    |
| node-openid-client | `Issuer.discover()` fetches and parses the document                 |
| AppAuth (mobile)   | Fetches service configuration to bootstrap native flows             |

1. Start with the issuer URL.
2. Append `/.well-known/openid-configuration` and fetch the JSON document.
3. Read `authorization_endpoint`, `token_endpoint`, and `jwks_uri` from the response.
4. Configure the OIDC client with those values.

## One-Liner Summary

| Field         | What it tells you                                                    |
| ------------- | -------------------------------------------------------------------- |
| `issuer`      | Who runs this server. Your app checks it to prevent token confusion. |
| `*_endpoint`  | The URLs for each OIDC operation.                                    |
| `jwks_uri`    | Where to find public keys for signature verification.                |
| `*_supported` | What the server supports: scopes, algorithms, claims, and more.      |
