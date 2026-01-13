# OIDC UserInfo Endpoint

The UserInfo Endpoint is an OAuth 2.0 protected resource that returns claims about the authenticated end-user.

## Endpoint URL
```
GET /userinfo
```

## Requirements
- Requires a valid access token
- Uses Bearer token authorization
- Returns claims about the authenticated user

## Example Request
```
GET /userinfo HTTP/1.1
Host: server.example.com
Authorization: Bearer SlAV32hkKG
```

## Example Response
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "sub": "248289761001",
  "name": "Jane Doe",
  "given_name": "Jane",
  "family_name": "Doe",
  "preferred_username": "j.doe",
  "email": "janedoe@example.com",
  "picture": "http://example.com/janedoe/me.jpg"
}
```

## Standard Claims

| Claim | Description |
|-------|-------------|
| `sub` | Subject - Identifier for the End-User |
| `name` | End-User's full name |
| `given_name` | Given name(s) or first name |
| `family_name` | Surname(s) or last name |
| `middle_name` | Middle name(s) |
| `nickname` | Casual name of the End-User |
| `preferred_username` | Shorthand name by which the End-User wishes to be referred |
| `profile` | Profile page URL |
| `picture` | Profile picture URL |
| `website` | Web page or blog URL |
| `email` | End-User's preferred e-mail address |
| `email_verified` | True if the e-mail address has been verified |
| `gender` | End-User's gender |
| `birthdate` | End-User's birthday |
| `zoneinfo` | Time zone |
| `locale` | Locale |
| `phone_number` | Preferred telephone number |
| `phone_number_verified` | True if the phone number has been verified |
| `address` | End-User's preferred postal address |
| `updated_at` | Time the information was last updated |