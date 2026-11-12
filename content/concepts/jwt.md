# JWT (JSON Web Tokens)

A JSON Web Token (JWT) is a compact, URL-safe token that contains claims about an entity. JWTs are commonly used for stateless authentication and for carrying information between services.

## Token Structure

A JWT has three parts separated by dots:

```text
Header.Payload.Signature
```

Example:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

- **Header** identifies the signing algorithm and key ID.
- **Payload** contains claims such as `sub`, `name`, `iat`, and `exp`.
- **Signature** lets the recipient verify that the token was issued by a trusted party and was not modified.

The payload is **encoded, not encrypted**. Never put secrets or sensitive personal data in a JWT unless you are using encrypted tokens (JWE).

## Authentication Flow

![JWT authentication flow](../assets/diagrams/jwt-authentication-flow.svg)

1. The user authenticates with a username and password, or through an identity provider.
2. The server creates and signs a JWT.
3. The client stores the JWT.
4. The client sends the JWT in the `Authorization` header on subsequent requests.
5. The server verifies the signature and claims before trusting the request.

## Authorization Header Example

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Where To Store A JWT

Prefer an `HttpOnly`, `Secure`, `SameSite` cookie for browser sessions. JavaScript cannot read an `HttpOnly` cookie, which removes the most common token theft path through XSS.

Avoid `localStorage` for access tokens. Any script on the page can read it, and a single XSS bug exposes every session. If you must keep a token in memory, accept that it disappears on refresh and is still reachable by injected script.

## Validation Checklist

- Verify the signature with the expected key and algorithm.
- Reject `alg: none` and algorithms you did not explicitly allow.
- Check `exp` and `nbf` with a small clock skew allowance.
- Verify `iss` and `aud` match your application.
- Treat the token as untrusted until all checks pass.

## Pros and Cons

- Stateless: no server-side session lookup required
- Compact and self-contained
- Works well across REST APIs and multiple services
- Tokens cannot be easily revoked before they expire
- Larger payload than a session ID
- Sensitive data is exposed if the token is mishandled

## JWT Is Not A Session

A JWT is a format, not a complete session strategy. You still need to decide how tokens are issued, stored, refreshed, revoked, and scoped. Short access-token lifetimes plus refresh-token rotation cover most of the gaps.
