# Glossary of Terms

Short definitions for the terms used across the site. Follow the links for the full explanations.

## Access Token

A credential the client sends to an API to authorize a request. It usually carries scopes and expires quickly. See [ID Token vs. Access Token](id-token-vs-access-token.html).

## Authentication (AuthN)

The process of proving who a user is. Authentication answers "Who are you?" See [Authentication vs. Authorization](auth-n-z.html).

## Authorization (AuthZ)

The process of deciding what an authenticated identity may do. Authorization answers "What are you allowed to do?" See [Authentication vs. Authorization](auth-n-z.html).

## Authorization Code

A short-lived, one-time value returned to the client after the user authorizes an application. The client exchanges it for tokens. See [Demystifying the Tokens](../demystifying-tokens.html).

## Claim

A key-value pair of information about a user returned in an ID token or UserInfo response. Claims are the **response**; examples include `sub`, `name`, `email`, and `email_verified`. See the [Standard Claims Reference](claims-reference.html).

## Discovery Document

A JSON document at `/.well-known/openid-configuration` that tells clients where an OpenID Connect provider's endpoints live and what it supports. See [OpenID Connect Discovery Document](well-known.html).

## ID Token

A signed JWT that proves the user's identity to the client. It contains claims such as `iss`, `sub`, `aud`, and `exp`. See [ID Token vs. Access Token](id-token-vs-access-token.html).

## Issuer (`iss`)

The identifier of the identity provider that created a token. Clients must verify it matches the expected issuer.

## JSON Web Key Set (JWKS)

A published set of public keys that clients use to verify token signatures. It enables key rotation without downtime. See [JWKS Endpoint](jwks.html).

## JWT

A JSON Web Token: a compact, URL-safe token with a header, payload, and signature. The payload is encoded, not encrypted. See [JWT](jwt.html).

## Nonce

A random value sent in an OpenID Connect authorization request and echoed in the ID token. It helps prevent replay attacks.

## OAuth 2.0

An authorization framework that lets a client obtain limited access to a resource on behalf of a user. It is about access, not identity. See [OAuth 2.0](../oauth2.html).

## OpenID Connect (OIDC)

An identity layer on top of OAuth 2.0. It adds the ID token and standard identity claims. See [OpenID Connect](../oidc.html).

## PKCE

Proof Key for Code Exchange: an extension that protects the authorization code exchange. Use it for public clients and as a best practice for confidential clients too.

## Refresh Token

A long-lived credential used to obtain new access tokens without prompting the user again. Treat it as a secret and rotate it.

## Scope

A permission string that tells the authorization server what access the client is requesting. Scopes are the **request**; examples include `openid`, `profile`, `email`, and `read:orders`. See the [Standard Claims Reference](claims-reference.html) for how scopes map to claims.

## State

An opaque value sent with an authorization request and checked on the redirect back. It protects against CSRF.

## Strong Customer Authentication (SCA)

A PSD2 requirement that electronic payments use at least two independent authentication factors. See [Strong Customer Authentication](sca.html).

## Subject (`sub`)

The stable identifier for an authenticated user. It is the primary claim used to link an identity to your own user record.
