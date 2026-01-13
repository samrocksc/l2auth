# OIDC Authorization Endpoint

The Authorization Endpoint is used to interact with the resource owner and obtain an authorization grant. It's used for the Authorization Code flow and Implicit flow.

## Endpoint URL
```
GET /authorize
```

## Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `response_type` | Yes | Determines the flow - "code" for Authorization Code flow, "token" for Implicit flow, "id_token" for Hybrid flow |
| `client_id` | Yes | The client identifier registered with the provider |
| `redirect_uri` | Recommended | Where to redirect the user after authorization |
| `scope` | Recommended | Space-separated list of scopes (openid is required for OIDC) |
| `state` | Recommended | Random value used to prevent CSRF attacks |
| `nonce` | Required for Implicit/ Hybrid | Random value used to mitigate replay attacks |

## Example Request

```
GET /authorize?
  response_type=code&
  client_id=s6BhdRkqt3&
  redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb&
  scope=openid%20profile%20email&
  state=af0ifjsldkj&
  nonce=n-0S6_WzA2Mj
```

## Response

The authorization server redirects the user-agent back to the client with either:
- An authorization code (in the Authorization Code flow)
- Access token and/or ID token (in the Implicit flow)
```

[Response interrupted by a tool call response. Only one tool call response allowed per message.]