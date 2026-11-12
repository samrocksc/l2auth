# Standard Claims Reference

A reference for standard OIDC and OAuth 2.0 claims: what they mean, which flow uses them, and how they interact.

## Identity Claims

### `sub` - Subject

The unique identifier for the end user, assigned by the identity provider.

**Used in:** every OIDC flow. It is the only required claim for identifying the user in an ID token.

```json
{ "sub": "248289761001" }
```

**Notes:**

- Stable across time. The same user gets the same `sub`.
- Treat it as an opaque identifier. Do not show it to untrusted parties.
- Often used as the key that links the identity to your own user database.

### `name`

The user's full display name.

**Used in:** OIDC when the `profile` scope is requested.

```json
{ "name": "Jane Doe" }
```

### `given_name`

The user's first name.

**Used in:** OIDC when the `profile` scope is requested.

```json
{ "given_name": "Jane" }
```

### `family_name`

The user's last name.

**Used in:** OIDC when the `profile` scope is requested.

```json
{ "family_name": "Doe" }
```

### `middle_name`

The user's middle name.

**Used in:** OIDC when the `profile` scope is requested.

```json
{ "middle_name": "Marie" }
```

### `nickname`

A casual name the user prefers.

**Used in:** OIDC when the `profile` scope is requested.

```json
{ "nickname": "Janey" }
```

### `preferred_username`

The user's chosen username or handle.

**Used in:** OIDC when the `profile` scope is requested.

```json
{ "preferred_username": "j.doe" }
```

### `profile`

A URL to the user's profile page.

**Used in:** OIDC when the `profile` scope is requested.

```json
{ "profile": "https://example.com/users/j.doe" }
```

### `picture`

A URL to the user's profile picture or avatar.

**Used in:** OIDC when the `profile` scope is requested.

```json
{ "picture": "https://example.com/avatars/j.doe.jpg" }
```

### `website`

A URL to the user's personal site.

**Used in:** OIDC when the `profile` scope is requested.

```json
{ "website": "https://janedoe.example.com" }
```

### `email`

The user's preferred email address.

**Used in:** OIDC when the `email` scope is requested.

```json
{ "email": "jane.doe@example.com" }
```

### `email_verified`

Whether the identity provider has verified the email address.

**Used in:** OIDC when the `email` scope is requested.

```json
{ "email": "jane.doe@example.com", "email_verified": true }
```

**Notes:**

- `false` means the user entered it but it has not been confirmed.
- Check this before using the email for sensitive operations such as account recovery.

### `gender`

The user's gender.

**Used in:** OIDC when the `profile` scope is requested.

```json
{ "gender": "female" }
```

### `birthdate`

The user's date of birth in ISO 8601 format.

**Used in:** OIDC when the `profile` scope is requested.

```json
{ "birthdate": "1980-01-15" }
```

### `zoneinfo`

The user's time zone in IANA Time Zone Database format.

**Used in:** OIDC when the `profile` scope is requested.

```json
{ "zoneinfo": "America/New_York" }
```

### `locale`

The user's preferred language and region in BCP 47 format.

**Used in:** OIDC when the `profile` scope is requested.

```json
{ "locale": "en-US" }
```

### `phone_number`

The user's preferred telephone number.

**Used in:** OIDC when the `phone` scope is requested.

```json
{ "phone_number": "+1-555-123-4567" }
```

### `phone_number_verified`

Whether the phone number has been verified.

**Used in:** OIDC when the `phone` scope is requested.

```json
{ "phone_number_verified": true }
```

### `address`

The user's preferred postal address as a structured object.

**Used in:** OIDC when the `address` scope is requested.

```json
{
  "address": {
    "formatted": "100 Main Street\nSpringfield, IL 62701\nUSA",
    "street_address": "100 Main Street",
    "locality": "Springfield",
    "region": "IL",
    "postal_code": "62701",
    "country": "US"
  }
}
```

### `updated_at`

A Unix timestamp for when the user's profile was last updated.

**Used in:** OIDC when the `profile` scope is requested.

```json
{ "updated_at": 1704067200 }
```

## Protocol Claims

### `iss` - Issuer

The URL of the identity provider that issued the token.

**Used in:** ID tokens and many access tokens. In an ID token it is required.

```json
{ "iss": "https://auth.example.com/" }
```

**Validation:** your app must verify that this matches the expected issuer exactly.

### `aud` - Audience

Who the token is intended for. For an ID token, this is your client ID. For an access token, it is often the API identifier.

**Used in:** ID tokens and access tokens. In an ID token it is required.

```json
{ "aud": "s6BhdRkqt3" }
```

**Validation:** your app must verify that `aud` contains its own client ID.

### `exp` - Expiration Time

A Unix timestamp after which the token is no longer valid.

**Used in:** ID tokens and access tokens. In an ID token it is required.

```json
{ "exp": 1704070800 }
```

**Validation:** reject tokens whose `exp` is in the past, allowing only a small clock skew.

### `iat` - Issued At

A Unix timestamp for when the token was issued.

**Used in:** ID tokens and many access tokens. In an ID token it is required.

```json
{ "iat": 1704067200 }
```

### `nbf` - Not Before

A Unix timestamp before which the token must not be accepted.

**Used in:** JWTs that need a delayed start time.

```json
{ "nbf": 1704067200 }
```

### `auth_time` - Authentication Time

A Unix timestamp for when the user last authenticated.

**Used in:** OIDC ID tokens when the client requests it, such as with `max_age`, or when the provider chooses to include it.

```json
{ "auth_time": 1704067200 }
```

### `nonce`

A random, opaque string sent in the authorization request to prevent replay.

**Used in:** OIDC authorization requests and ID tokens.

```text
# In the authorization request:
GET /authorize?...&nonce=n-0S6_WzA2Mj...

# In the ID token:
{ "nonce": "n-0S6_WzA2Mj" }
```

**Validation:** verify that the `nonce` in the ID token matches the value you sent.

### `at_hash` - Access Token Hash

The base64url encoding of the left half of the hash of the access token, signed with the same key as the ID token.

**Used in:** OIDC ID tokens.

```json
{ "at_hash": "4Pt2-SwEkG3i2_1vIa8F0A" }
```

**Purpose:** lets the client detect whether the access token was swapped before it is used.

### `c_hash` - Code Hash

A hash of the authorization code, used in the Hybrid flow.

**Used in:** OIDC ID tokens when using a hybrid response type.

### `acr` - Authentication Context Class Reference

A string indicating the authentication strength used.

**Used in:** OIDC ID tokens (optional).

```json
{ "acr": "urn:mace:incommon:iap:silver" }
```

### `amr` - Authentication Methods References

An array of strings indicating which authentication methods were used.

**Used in:** OIDC ID tokens (optional).

```json
{ "amr": ["pwd", "otp", "mfa"] }
```

Values defined by [RFC 8176](https://www.rfc-editor.org/rfc/rfc8176):

| Value    | Meaning                                       |
| -------- | --------------------------------------------- |
| `face`   | Facial recognition biometric                  |
| `fpt`    | Fingerprint biometric                         |
| `geo`    | Geolocation                                   |
| `hwk`    | Proof of possession of a hardware-secured key |
| `iris`   | Iris scan biometric                           |
| `kba`    | Knowledge-based authentication                |
| `mca`    | Multiple-channel authentication               |
| `mfa`    | Multiple-factor authentication                |
| `otp`    | One-time password (TOTP or HOTP)              |
| `pin`    | Personal identification number or pattern     |
| `pwd`    | Password-based authentication                 |
| `rba`    | Risk-based authentication                     |
| `retina` | Retina scan biometric                         |
| `sc`     | Smart card                                    |
| `sms`    | SMS confirmation                              |
| `swk`    | Proof of possession of a software-secured key |
| `tel`    | Telephone callback                            |
| `user`   | User presence test                            |
| `vbm`    | Voiceprint biometric                          |
| `wia`    | Windows integrated authentication             |

### `azp` - Authorized Party

The client ID of the application the token was issued to. Used when `aud` contains multiple values.

**Used in:** OIDC ID tokens (optional, but required when `aud` has multiple entries).

```json
{ "aud": ["s6BhdRkqt3", "https://api.example.com"], "azp": "s6BhdRkqt3" }
```

## How Claims Interact

### ID Token vs. Access Token

|                  | ID Token                          | Access Token                             |
| ---------------- | --------------------------------- | ---------------------------------------- |
| **Format**       | JWT                               | JWT or opaque                            |
| **Issued by**    | OIDC provider                     | OAuth 2.0 authorization server           |
| **Contains**     | Identity claims                   | API access scopes and authorization data |
| **For**          | Your app, to know who the user is | The API, to grant access                 |
| **Validated by** | Your app or backend               | The resource server                      |

### Scopes to Claims Mapping

When your app requests scopes, the provider maps them to claims in the ID token and UserInfo response:

| Scope     | Claims included                                                                                                                                                                  |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `openid`  | `sub`                                                                                                                                                                            |
| `profile` | `name`, `given_name`, `family_name`, `middle_name`, `nickname`, `preferred_username`, `picture`, `profile`, `website`, `gender`, `birthdate`, `zoneinfo`, `locale`, `updated_at` |
| `email`   | `email`, `email_verified`                                                                                                                                                        |
| `phone`   | `phone_number`, `phone_number_verified`                                                                                                                                          |
| `address` | `address`                                                                                                                                                                        |

Requesting multiple scopes **combines** the claim sets.

### Example: Full ID Token Claims

Request:

```text
scope=openid profile email phone
```

Resulting ID token payload:

```json
{
  "iss": "https://auth.example.com/",
  "sub": "248289761001",
  "aud": "s6BhdRkqt3",
  "exp": 1704070800,
  "iat": 1704067200,
  "auth_time": 1704067200,
  "nonce": "n-0S6_WzA2Mj",
  "name": "Jane Doe",
  "given_name": "Jane",
  "family_name": "Doe",
  "email": "jane.doe@example.com",
  "email_verified": true,
  "phone_number": "+1-555-123-4567",
  "phone_number_verified": true,
  "locale": "en-US",
  "picture": "https://example.com/avatars/jane.jpg"
}
```
