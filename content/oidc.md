# OpenID Connect (OIDC)

OpenID Connect is an identity layer built on top of OAuth 2.0. OAuth 2.0 answers "what may this application access?" OIDC adds "who is the user?" by introducing the ID token and a standard set of identity claims.

OAuth 2.0 handles authorization. OIDC adds the identity layer on top and uses the same flow to authenticate the user.

## Key Differences From OAuth 2.0

| OAuth 2.0                          | OIDC                                       |
| ---------------------------------- | ------------------------------------------ |
| Authorization framework            | Authentication protocol built on OAuth 2.0 |
| Issues access tokens               | Issues access tokens **and** ID tokens     |
| Does not define user identity      | Provides standard identity claims          |
| Used by APIs to authorize requests | Used by clients to authenticate the user   |

## ID Token Structure

An ID token is always a JWT signed by the identity provider. The client validates it and reads the claims.

```json
{
  "iss": "https://server.example.com",
  "sub": "24400320",
  "aud": "s6BhdRkqt3",
  "nonce": "n-0S6_WzA2Mj",
  "exp": 1311281970,
  "iat": 1311280970,
  "auth_time": 1311280969,
  "acr": "urn:mace:incommon:iap:silver"
}
```

| Claim       | Meaning                                                         |
| ----------- | --------------------------------------------------------------- |
| `iss`       | Issuer - the identity provider that created the token           |
| `sub`       | Subject - the stable identifier for the user                    |
| `aud`       | Audience - the client ID the token was issued for               |
| `exp`       | Expiration time                                                 |
| `iat`       | Issued-at time                                                  |
| `nonce`     | Value that ties the token to the original authorization request |
| `auth_time` | When the user last authenticated                                |
| `acr`       | Authentication context class, such as a MFA level               |

The required ID-token claims are `iss`, `sub`, `aud`, `exp`, and `iat`. The client **must** verify the signature and these claims before trusting the token.

## Authentication Flow

![OIDC token flow](assets/diagrams/oidc-token-flow.svg)

1. The user starts sign-in.
2. The client redirects to the OIDC provider's authorization endpoint with `scope=openid`, a `state`, and a `nonce`.
3. The user authenticates with the provider.
4. The provider redirects back with an authorization code.
5. The client exchanges the code for an ID token, an access token, and optionally a refresh token.
6. The client validates the ID token signature and claims.
7. The client uses the claims to establish its own session.

## Authorization Endpoint

The authorization endpoint is where the client sends the user to authenticate and consent.

```http
GET /authorize?response_type=code&client_id=s6BhdRkqt3&redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb&scope=openid%20profile%20email&state=af0ifjsldkj&nonce=n-0S6_WzA2Mj
```

| Parameter        | Required           | Description                                                   |
| ---------------- | ------------------ | ------------------------------------------------------------- |
| `response_type`  | Yes                | `code` for the Authorization Code flow                        |
| `client_id`      | Yes                | The client identifier registered with the provider            |
| `redirect_uri`   | Yes                | Must match a registered redirect URI                          |
| `scope`          | Yes                | Must include `openid`; add `profile`, `email`, etc. as needed |
| `state`          | Recommended        | Opaque value used to prevent CSRF                             |
| `nonce`          | Recommended        | Opaque value used to prevent replay                           |
| `code_challenge` | Required with PKCE | Hash of the PKCE verifier                                     |

The provider redirects back with either an authorization code or an error.

## Token Endpoint

The token endpoint exchanges an authorization code or refresh token for tokens.

```http
POST /token HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=SplxlOBeZQQYbYS6WxSbIA
&redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
&client_id=s6BhdRkqt3
&code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk
```

Example response:

```json
{
  "access_token": "SlAV32hkKG",
  "token_type": "Bearer",
  "refresh_token": "8xLOxBtZp8",
  "expires_in": 3600,
  "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOWdkazcifQ..."
}
```

Confidential clients also authenticate to the token endpoint with a client secret. Public clients rely on PKCE instead of a secret.

## UserInfo Endpoint

The UserInfo endpoint returns claims about the authenticated user. It requires a valid access token.

```http
GET /userinfo HTTP/1.1
Host: server.example.com
Authorization: Bearer SlAV32hkKG
```

```json
{
  "sub": "248289761001",
  "name": "Jane Doe",
  "given_name": "Jane",
  "family_name": "Doe",
  "preferred_username": "j.doe",
  "email": "janedoe@example.com",
  "picture": "https://example.com/janedoe/me.jpg"
}
```

The `sub` returned by UserInfo must match the `sub` in the ID token.

## Discovery Document

The provider publishes its endpoints and capabilities at a standard URL:

```http
GET https://auth.example.com/.well-known/openid-configuration
```

A client only needs the issuer URL. From there it discovers `authorization_endpoint`, `token_endpoint`, `userinfo_endpoint`, `jwks_uri`, supported scopes, and signing algorithms.

[Full deep-dive on the Discovery Document](concepts/well-known.html)

## JWKS Endpoint

The `jwks_uri` from the discovery document points to the provider's public keys. The client matches the `kid` in the token header to a key and verifies the signature. Key rotation works because the provider publishes new keys before signing with them.

[Full deep-dive on the JWKS endpoint](concepts/jwks.html)

## Pros and Cons

- Standardized authentication across providers
- Built on OAuth 2.0
- Provides identity claims without a custom user-info API
- Discovery and key rotation work without hardcoded endpoints
- Adds complexity over plain OAuth 2.0
- ID-token validation has several required checks
- Provider-specific claims and quirks still leak through

## Validation Checklist

1. Verify the signature with the provider's current JWKS.
2. Check `iss` matches the expected issuer exactly.
3. Check `aud` contains your client ID.
4. Check `exp` and `iat`.
5. Verify `nonce` matches the value you sent.
6. If `azp` is present, check it against your client ID.
7. Use the claims for your own session only after all checks pass.
