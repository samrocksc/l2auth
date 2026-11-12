# Authentication vs. Authorization

Authentication and authorization are related, but they answer different questions.

- **Authentication (AuthN):** "Who are you?" - verifying identity.
- **Authorization (AuthZ):** "What are you allowed to do?" - verifying permissions.

Authentication always happens first. Authorization uses the result of authentication to decide what that identity may access.

## Authentication

Authentication proves an identity. It happens when a user signs in with a password, a passkey, an OTP, or another factor. The result is a trusted statement such as "this request belongs to user `248289761001`."

In OpenID Connect, the identity provider authenticates the user and returns an **ID token** that describes the authenticated subject.

```http
GET https://{your_domain}.auth0.com/authorize?
    response_type=code
    &client_id={your_client_id}
    &redirect_uri={your_callback_url}
    &scope=openid%20profile%20email
    &state={random_string}
```

The `/authorize` endpoint starts the flow. It is also where the user authenticates. OAuth 2.0 itself is an authorization framework; OpenID Connect adds the authentication result.

## Authorization

Authorization determines what an authenticated identity may do. It is expressed through scopes, roles, policies, and token audiences.

- **Scopes** describe the access an application requests, such as `read:orders` or `profile`.
- **Roles and policies** describe what a user is allowed to do inside an application.
- **The access token** carries the granted scopes to the API, which enforces them.

After the user authenticates, the client exchanges the authorization code for tokens:

```http
POST https://{your_domain}.auth0.com/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&client_id={your_client_id}
&client_secret={your_client_secret}
&code={authorization_code}
&redirect_uri={your_callback_url}
```

The token response authorizes the client to call APIs on the user's behalf.

## How They Work Together

1. The user authenticates at the identity provider (AuthN).
2. The provider returns an ID token that identifies the user.
3. The provider issues an access token with scopes the user approved (AuthZ).
4. The API validates the access token and enforces those scopes.
5. Your application uses the ID token to create its own session.

## Common Mistakes

- Treating a valid access token as proof of user identity. Use the ID token for identity.
- Checking authentication but forgetting per-resource authorization. A logged-in user is not automatically allowed to read every record.
- Trusting scopes without checking them on the resource server.
- Using OAuth 2.0 alone and expecting authentication semantics. Add OIDC.
