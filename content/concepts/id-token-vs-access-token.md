# ID Token vs. Access Token

## The Simple Version

|              | ID Token                       | Access Token                     |
| ------------ | ------------------------------ | -------------------------------- |
| **Says**     | "This is who you are"          | "This lets you access something" |
| **Used by**  | Your app (frontend or backend) | An API (resource server)         |
| **Contains** | User identity claims           | Permissions and scopes           |

---

## ID Token - "Who are you?"

The ID token proves the user's identity. Your app reads it to know **who logged in**.

- It is a JWT signed by the identity provider.
- It contains claims such as `sub`, `name`, `email`, and `picture`.
- Your app reads it for identity and should never send it to an API as an access token.

```json
{
  "iss": "https://auth.example.com/",
  "sub": "248289761001",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "exp": 1704070800
}
```

---

## Access Token - "Here is what you can do"

The access token proves your app has permission to call an API. The API **reads** it to decide whether to fulfill the request.

- It can be a JWT or an opaque string.
- It contains scopes that say what data the app may access.
- Your app sends it to APIs as a Bearer token in the `Authorization` header.

**Example request:**

```http
GET /api/user-data HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
```

---

## Think Of It Like A Badge And A Key Card

- **ID Token** = your photo ID badge. It says who you are. You show it to prove your identity.
- **Access Token** = a key card. It opens specific doors. The door checks the card to decide whether to let you in.

---

## How They Fit Into The Flow

![ID token vs access token](../assets/diagrams/id-token-vs-access-token.svg)

1. The user logs in at the identity provider.
2. Your app receives an ID token and an access token.
3. Your app uses the ID token to learn who the user is.
4. Your app sends the access token to an API when it makes a request.
5. The API validates the access token and returns the requested data.

---

## Key Takeaway

- **ID token:** for your app, to identify the user.
- **Access token:** for APIs, to authorize the request.

Never confuse the two. Sending an ID token to an API will be rejected. Sending an access token to your app will not give you identity information. Also remember that the ID token is only trustworthy after signature and claim validation.
