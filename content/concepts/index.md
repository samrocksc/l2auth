# Authentication Concepts

This section covers important concepts and principles related to authentication, authorization, and security.

## Interactive Flows

- [CIAM Flow Adventure](../l2auth_ciam_adventure.html) - Choose-your-own-adventure walkthrough of PKCE, OAuth 2.0, and SAML flows

## Available Concepts

- [Auth Security Parameters](auth-security-parameters.html) - Mapping nonce, state, and PKCE to the threats they mitigate
- [Authentication vs. Authorization](auth-n-z.html) - AuthN checks identity; AuthZ checks permissions
- [Strong Customer Authentication (SCA)](sca.html) - PSD2 requirements for secure payments
- [MFA Factors](mfa-factors.html) - Credentials, authenticators, and the three factor types
- [Authenticators: Independent vs Dependent](authenticators.html) - Standalone factors, fallbacks, and the other categories
- [Authenticator Assurance Levels (AAL)](authenticator-assurance-levels.html) - NIST AAL1, AAL2, and AAL3
- [Password Matching with bcrypt and Salts](bcrypt-password-matching.html) - How bcrypt stores passwords, why salts defeat rainbow tables, and why slow hashing matters
- [Glossary of Terms](glossary.html) - Short definitions for scope, claim, tokens, and other auth terms
- [Standard Claims Reference](claims-reference.html) - Complete guide to OIDC claims and how they interact
- [Custom Attributes to Token Claims](custom-attributes.html) - How profile attributes become claims in Okta and Auth0
- [OpenID Connect Discovery Document](well-known.html) - What `/.well-known/openid-configuration` is and how clients use it
- [JWKS Endpoint](jwks.html) - How clients verify token signatures and handle key rotation
- [ID Token vs. Access Token](id-token-vs-access-token.html) - What each token is for and how to use them
- [JWT (JSON Web Tokens)](jwt.html) - Token structure, signing, and usage
- [Demystifying the Tokens](../demystifying-tokens.html) - What each token does in the pipeline
