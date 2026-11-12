# Custom Attributes to Token Claims

Custom data lives in the **user profile**. A **claim** is only what you explicitly **project** from that profile into a token. Nothing ships in a token by accident: you have to whitelist it, map it, and put it in the right token.

## 1. Profile Data Is Not a Token Claim

An attribute is stored data about the user. A claim is a key-value pair that has been projected into a signed token.

|                       | Profile Attribute                  | Token Claim                             |
| --------------------- | ---------------------------------- | --------------------------------------- |
| **What it is**        | Stored data about the user         | A key-value pair projected into a token |
| **Where it lives**    | The identity profile schema        | The signed token payload                |
| **How it gets there** | Manually, via sync, or from an IdP | Only by explicit mapping or projection  |
| **Who can see it**    | Whoever can read the profile       | Anyone who can decode the token         |

The common mistake is assuming that adding a custom attribute makes it appear in the token. It does not. An attribute stays inert until you project it into a claim.

## 2. Where Custom Data Lives

### Okta

Custom attributes are added to the **user profile schema**, either in the **Profile Editor** (admin UI) or through the **Users API** (`/api/v1/meta/schemas/user/default`). You define the attribute, its type, and whether it is required or read-only. You can also populate attributes from **group membership** through group attribute mappings.

### Auth0

Auth0 splits custom data into two namespaces, and the distinction matters:

|                           | `app_metadata`                                       | `user_metadata`                                              |
| ------------------------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| **Who writes it**         | Admin only, through the Dashboard or Management API  | The user, when your app writes it                            |
| **What it is for**        | Authorization data: roles, plan, permissions, flags  | Non-critical preferences: theme, language, newsletter opt-in |
| **Can the user edit it?** | No                                                   | Yes                                                          |
| **Security posture**      | Trusted; use it as the authorization source of truth | Untrusted; never base authorization decisions on it          |

> **Rule of thumb:** authorization data belongs in `app_metadata`; preferences belong in `user_metadata`. If a user could self-escalate by editing a value, it belongs in `app_metadata`.

## 3. The Projection: Turning an Attribute Into a Claim

The profile-to-token path is really two steps: select the stored attribute, then map it explicitly into the token.

### Okta

Map profile attributes to claims inside an **Authorization Server** (the Default AS or a custom one). You configure which attribute becomes which claim and whether it goes into the **ID token**, the **access token**, or both.

### Auth0

Two pieces are required:

1. **Whitelist the metadata** so it can appear in a token.
2. Write a **post-login Action** in JavaScript to add or copy the claim into the token.

```js
exports.onExecutePostLogin = async (event, api) => {
  // Copy a value from app_metadata into the access token
  api.accessToken.setCustomClaim("roles", event.user.app_metadata.roles);
  // Or from user_metadata into the ID token
  api.idToken.setCustomClaim("theme", event.user.user_metadata.theme);
};
```

Without a whitelist and an Action or Rule, the custom attribute will not appear in any token.

## 4. Which Token, For Whom?

Which token you target changes the meaning of the claim. See [ID Token vs. Access Token](id-token-vs-access-token.html).

|                                                      | ID Token                  | Access Token                        |
| ---------------------------------------------------- | ------------------------- | ----------------------------------- |
| **Audience**                                         | Your app                  | Your API                            |
| **Purpose**                                          | Identity: who the user is | Authorization: what the user can do |
| **Custom authorization claims (roles, permissions)** | No                        | Yes                                 |

If you are adding roles or permissions so an API can make authorization decisions, put them in the **access token**, not the ID token. The ID token is for identity and should not be sent to your API.

## 5. The RBAC Gotcha

Adding permissions to an Auth0 access token takes two switches:

1. Enable **RBAC** on the API.
2. Enable **"Add Permissions in the Access Token"** on that API.

Enabling RBAC alone is not enough. Permissions only land in the access token when the second switch is on. This is the classic "I enabled RBAC but my token has no permissions" trap.

## 6. Scopes Gate the Claims

Requested **scopes** determine which claims come back. Scopes are the request; claims are the response. See the [Glossary](glossary.html#scope).

Standard claims (`openid profile email`) map automatically. Custom claims usually need a custom scope that the authorization server recognizes and that the client requests. If the client never asks for the scope, the custom claim stays out of the token even when it is mapped.

| Request                      | Response                      |
| ---------------------------- | ----------------------------- |
| `scope=openid profile roles` | `sub`, `name`, ..., `roles`   |
| `scope=openid profile`       | `sub`, `name`, ... (no roles) |

## 7. Security and Hygiene

- **Do not put sensitive data in tokens.** Tokens travel through the browser and can be large. Keep PII out; use a UserInfo call or a backend lookup for heavy data.
- **Keep `app_metadata` admin-controlled.** If users could write authorization data, they could escalate their own privileges.
- **Keep tokens lean.** Every claim adds weight to every request. Project only what you consume.
- **Map once, do not duplicate.** Prefer a single source of truth in the profile over copying the same value into several claims.

## The Full Lineage

![Custom attributes lineage](../assets/diagrams/custom-attributes-lineage.svg)

**Key takeaway:** storage, projection, target. Pick the right store, project explicitly, and target the correct token. Get any of the three wrong and the custom data either never reaches a token or reaches the wrong one.
