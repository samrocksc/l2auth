# OIDC Token Endpoint

The Token Endpoint is used by the client to obtain an access token, ID token, and refresh token by presenting its authorization grant or refresh token.

## Endpoint URL
```
POST /token
```

## Parameters (Authorization Code Flow)

| Parameter | Required | Description |
|-----------|----------|-------------|
| `grant_type` | Yes | Must be set to "authorization_code" |
| `code` | Yes | The authorization code received from the authorization endpoint |
| `redirect_uri` | Yes | Must match the redirect_uri used in the authorization request |
| `client_id` | Yes | The client identifier |
| `client_secret` | Yes | The client secret (for confidential clients) |

## Example Request

```
POST /token HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=SplxlOBeZQQYbYS6WxSbIA&
redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb&
client_id=s6BhdRkqt3&
client_secret=7Fjfp0ZBr1KtDRbnfVdmIw
```

## Example Response

```
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache

{
  "access_token": "SlAV32hkKG",
  "token_type": "Bearer",
  "refresh_token": "8xLOxBtZp8",
  "expires_in": 3600,
  "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOWdkazcifQ..."
}
```

## Refresh Token Request

```
POST /token HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&
refresh_token=8xLOxBtZp8&
client_id=s6BhdRkqt3&
client_secret=7Fjfp0ZBr1KtDRbnfVdmIw