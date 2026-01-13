# OIDC Discovery Document

The Discovery Document is a JSON document that contains metadata about the OpenID Provider, including endpoint locations and supported features.

## Endpoint URL
```
GET /.well-known/openid-configuration
```

## Example Request
```
GET /.well-known/openid-configuration HTTP/1.1
Host: server.example.com
```

## Example Response
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "issuer": "https://server.example.com",
  "authorization_endpoint": "https://server.example.com/authorize",
  "token_endpoint": "https://server.example.com/token",
  "userinfo_endpoint": "https://server.example.com/userinfo",
  "jwks_uri": "https://server.example.com/jwks",
  "scopes_supported": [
    "openid",
    "profile",
    "email",
    "address",
    "phone"
  ],
  "response_types_supported": [
    "code",
    "token",
    "id_token"
  ],
  "subject_types_supported": [
    "public"
  ],
  "id_token_signing_alg_values_supported": [
    "RS256"
  ]
}
```

## Common Metadata Fields

| Field | Description |
|-------|-------------|
| `issuer` | Issuer Identifier for the OP |
| `authorization_endpoint` | URL of the Authorization Endpoint |
| `token_endpoint` | URL of the Token Endpoint |
| `userinfo_endpoint` | URL of the UserInfo Endpoint |
| `jwks_uri` | URL of the JSON Web Key Set document |
| `scopes_supported` | List of supported scopes |
| `response_types_supported` | List of supported response types |
| `subject_types_supported` | List of supported subject identifier types |