# OAuth 2.0

OAuth 2.0 is an authorization framework that lets a client obtain limited access to a resource on behalf of a user, without sharing the user's password. It defines how the resource owner grants access, how the authorization server issues tokens, and how the resource server validates those tokens.

OAuth 2.0 is about **authorization** (what an application may access), not authentication (who the user is). If you need identity, add [OpenID Connect](oidc.html) on top.

## Key Roles

- **Resource Owner**: the user who owns the data and grants access.
- **Client**: the application requesting access.
- **Authorization Server**: authenticates the user and issues tokens.
- **Resource Server**: the API that hosts the protected resource and validates access tokens.

## Authorization Code Flow

This is the standard flow for web applications and native apps. With PKCE, it is also the recommended flow for single-page applications.

![OAuth 2.0 Authorization Code flow](assets/diagrams/oauth2-authorization-code.svg)

1. The client generates a `state` value and, for PKCE, a `code_verifier` and `code_challenge`.
2. The client redirects the user to the authorization endpoint.
3. The user authenticates and grants the requested scopes.
4. The authorization server redirects back with a short-lived authorization code.
5. The client exchanges the code for an access token (and, with OIDC, an ID token).
6. The client calls the API with `Authorization: Bearer <access_token>`.

Always use PKCE, even for confidential clients. It protects the code exchange from interception and is required for public clients.

## Grant Types

- **Authorization Code**: standard flow for web, mobile, and SPA clients. Use with PKCE.
- **Client Credentials**: machine-to-machine access with no user involved.
- **Refresh Token**: obtain a new access token without prompting the user again.
- **Implicit**: legacy browser flow. Deprecated; do not use for new applications.
- **Resource Owner Password**: direct exchange of a username and password. Avoid unless you are migrating a legacy system.

## Access Token Example

```http
GET /api/orders HTTP/1.1
Host: api.example.com
Authorization: Bearer MTQ0NjJkZmQ5OTM2NDE1ZTZjNGZmZjI3
```

The access token tells the API what the client may do. It is not proof of the user's identity.

## Discovery

OAuth 2.0 does not define a standard discovery mechanism for authorization-server metadata. OpenID Connect adds one through the Discovery Document at `/.well-known/openid-configuration`.

[Full deep-dive on the Discovery Document](concepts/well-known.html)

## Pros and Cons

- Standardized and widely supported
- Delegated access without sharing passwords
- Multiple grant types for different client types
- More complex than Basic auth or API keys
- Redirect-based flows need careful CSRF and redirect-URI handling
- Tokens and scopes require deliberate lifecycle management

## Common Mistakes

- Using OAuth 2.0 as an authentication protocol without OIDC.
- Skipping PKCE for public clients.
- Accepting any redirect URI instead of exact registered matches.
- Storing access tokens in `localStorage` without considering XSS.
- Requesting broad scopes when a narrow scope would do.
