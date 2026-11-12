# Basic Authentication

Basic authentication sends a username and password in the `Authorization` header, encoded with Base64. Base64 is **encoding, not encryption**, so the credentials are readable by anyone who can see the request. It must only be used over HTTPS.

## How It Works

1. The user provides a username and password.
2. The client combines them as `username:password`.
3. The client Base64-encodes that string.
4. The browser sends an `Authorization: Basic ...` header with every request.
5. The server decodes the header and validates the credentials.

## Authorization Header Example

```http
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```

That value decodes to `username:password`. Anyone who intercepts it can read the credentials.

## Server Challenge

A server typically prompts for credentials with a `401 Unauthorized` response and a `WWW-Authenticate` header:

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Basic realm="example"
```

The browser then shows its native login dialog and retries the request with the encoded header.

## When To Use It

- Machine-to-machine calls or legacy integrations that require it.
- Simple internal tools protected by HTTPS and additional network controls.
- API requests where a short-lived token is not practical.

Do **not** use Basic authentication as the login mechanism for a user-facing web application. Use a session cookie or an OAuth 2.0 / OpenID Connect flow instead.

## Pros and Cons

- Simple to implement
- Widely supported
- Credentials are sent with every request
- Credentials are only encoded, not encrypted
- No built-in expiration or revocation
- Difficult to combine with multi-factor authentication

## Security Checklist

- Always use HTTPS. There is no safe version of Basic auth over plain HTTP.
- Never log the `Authorization` header.
- Prefer scoped API tokens or OAuth 2.0 for new integrations.
- Treat a leaked credential as a full account compromise and rotate it immediately.
