# Strong Customer Authentication (SCA)

Strong Customer Authentication (SCA) is a regulatory requirement under the second Payment Services Directive (PSD2) in the European Economic Area (EEA). It requires electronic payments to use multi-factor authentication to reduce fraud.

## SCA Requirements

SCA requires authentication based on at least two of the following three elements:

1. **Something you know** - knowledge, such as a password or PIN.
2. **Something you have** - possession, such as a phone or hardware token.
3. **Something you are** - inherence, such as a fingerprint or face recognition.

The two elements must be independent. Two passwords do not satisfy SCA, and a password plus a knowledge-based security question does not either.

## Exemptions

Certain transactions may be exempt:

- **Low-value remote transactions** under €30 per transaction.
- **Low-value contactless payments** under €50 per transaction.
- **Cumulative limits**: after five consecutive low-value transactions or €100 in total, SCA is required again.
- **Trusted beneficiaries** that the customer has whitelisted.
- **Recurring transactions** with the same merchant, within the original authorization.
- **Transaction risk analysis** for low-risk payments, subject to fraud-rate thresholds.

Exemptions are not automatic. The payment service provider must monitor fraud rates and apply the limits defined by the EBA.

## Implementation Challenges

- Balancing security with checkout conversion.
- Supporting fallback and recovery when an authentication factor fails.
- Keeping exemption logic and fraud monitoring up to date.
- Complying with regional rules beyond PSD2, such as local banking requirements.

## Pros and Cons

- Significantly increases transaction security
- Reduces fraud and unauthorized transactions
- Meets regulatory requirements
- Can add friction during checkout
- May increase transaction abandonment
- Requires careful risk and exemption management
