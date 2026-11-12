# Demystifying the Tokens

Every time you hit "Sign in with Google" or log into an app, a handful of tokens move between systems. Here is what each one does.

## Authorization Code - The Handshake

This is the shortest-lived token in the pipeline. It is not a token you keep. It is a one-time handshake that proves the user just authorized your app.

1. The browser sends the user to the authorization server.
2. The authorization server authenticates the user and redirects back with a short-lived authorization code.
3. The browser passes that code to your application.
4. Your application sends the code to the authorization server and receives the real tokens.

- **Lifetime:** seconds to minutes
- **Format:** opaque string
- **What it does:** proves the user authorized your app. Exchange it once, then it is dead.
- **Why it exists:** it keeps long-lived tokens out of the front-channel redirect. In a public client using PKCE, the tokens still come back to the browser, but the code cannot be replayed without the verifier.

## Access Token - The Key Card

This is the token your app sends to APIs. Think of it like a hotel key card: it opens specific doors for a limited time.

```http
GET /api/orders HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
```

- **Lifetime:** minutes to hours (typically 15 minutes to 1 hour)
- **Format:** JWT or opaque string
- **What it does:** proves to the API that your app may access specific data
- **Who reads it:** the API (resource server). Your app passes it along.
- **Contents:** scopes, permissions, and maybe a user ID - not personal data

The access token tells the API _what you can do_, not _who you are_. If you need identity information, use the ID token.

## ID Token - The Photo ID

This one only appears in OpenID Connect flows. It is proof of identity: a JWT signed by the identity provider that says "this user just logged in."

```json
{
  "iss": "https://auth.example.com/",
  "sub": "248289761001",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "exp": 1704070800
}
```

- **Lifetime:** minutes to hours
- **Format:** always a JWT, so your app can verify the signature
- **What it does:** tells your app who the user is
- **Who reads it:** your app. Do not send it to an API as an access token.
- **Validation:** verify the signature with the provider's JWKS keys and check `iss`, `aud`, `exp`, and `nonce`

**ID token vs. access token:** the ID token is for _your app_ to know the user. The access token is for _APIs_ to authorize requests. They serve different jobs.

## Refresh Token - The Re-Entry Pass

Access tokens expire quickly by design. The refresh token lets your app get new access tokens without prompting the user again.

![Refresh token flow](assets/diagrams/refresh-token-flow.svg)

1. Your app sends the refresh token to the authorization server's token endpoint.
2. The authorization server validates the refresh token.
3. The server returns a new access token and, when rotating, a new refresh token.

- **Lifetime:** days to months
- **Format:** opaque string (treat it as a secret)
- **What it does:** gets new access tokens silently in the background
- **Storage:** server-side, an `HttpOnly` cookie, or secure platform storage. Never in a place where JavaScript or another app can read it.
- **Rotation:** issue a new refresh token each time one is used so old ones cannot be replayed

After the first login, subsequent visits use the refresh token to get fresh access tokens. The user does not see a login screen again until the refresh token expires or is revoked.

## The Big Picture

Here is how they flow together in an OIDC Authorization Code flow with PKCE:

![Token flow across the client, identity provider, and API](assets/diagrams/oidc-token-flow.svg)

1. The user clicks "Sign In".
2. The browser redirects to the authorization server, where the user authenticates and consents.
3. The authorization server redirects back with an authorization code.
4. Your app exchanges the code, plus the PKCE verifier, for an ID token, an access token, and usually a refresh token.
5. Your app uses the ID token to identify the user and the access token to call APIs.
6. When the access token expires, your app uses the refresh token to get a new one.
7. When the refresh token expires or is revoked, the user must sign in again.

## One-Liner Summary

| Token              | Purpose             | Lifetime         | Read by                         |
| ------------------ | ------------------- | ---------------- | ------------------------------- |
| Authorization Code | One-time handshake  | Seconds          | Authorization server            |
| Access Token       | Calls APIs          | Minutes to hours | The API                         |
| ID Token           | Identifies the user | Minutes to hours | Your app                        |
| Refresh Token      | Gets new tokens     | Days to months   | Authorization server and client |

See [ID Token vs. Access Token](concepts/id-token-vs-access-token.html) and the [Glossary](concepts/glossary.html#scope) for definitions of scopes and claims.
