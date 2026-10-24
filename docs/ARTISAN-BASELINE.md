# Artisan Operations engineering baseline

This public ECC fork is a source of selected engineering guidance for Artisan Operations.
It is not the live CEO, authoritative HQ register, customer database, or deployed onboarding service.
Upstream ECC remains MIT licensed; preserve its copyright and licence.

## Scope

First use: verify the existing £149 Business Health Check purchase-to-onboarding workflow.
Retain the original eight-question questionnaire and approved service specification.
Onboarding delivery is separate from final service fulfilment. Do not change order fulfilment status.
This baseline authorises no production deployment, real customer email, credential provisioning,
or changes to Shopify, Supabase, Resend or the existing application repositories.

## Selected guidance

The allowlist in `artisan/health-check-profile.json` selects only:

| Skill | Purpose |
| --- | --- |
| github-ops | Branches, pull requests and CI evidence |
| backend-patterns | Webhook boundaries, persistent audit and failure handling |
| security-review | Signature verification, least privilege and secret handling |
| tdd-workflow | Behavioural tests before workflow changes |
| verification-loop | Evidence of valid, invalid and duplicate event outcomes |

This profile is a selection manifest, not a runtime permission boundary.
No skills, hooks, MCP servers or packages are installed by it.
The broader upstream catalogue remains reference material. Do not bulk-install it.
Provider-specific Shopify, Supabase and Resend guidance must be loaded when working on those services.
If an n8n implementation is chosen, use the installed n8n-workflow-check skill; this repository does not contain that implementation.

## Onboarding acceptance contract

Use synthetic fixtures and the existing test-only allowlist; no live customer details in Git.
The service repository must prove:

1. A valid Shopify orders/paid request verifies HMAC against the raw body before JSON parsing.
   Confirm the intended shop, paid state and exact Health Check product identifier.
2. An authorised test order queues one onboarding email with the approved questionnaire.
3. A missing/invalid signature, wrong shop, wrong product or non-allowlisted recipient causes
   no email and no downstream side effect.
4. Duplicate and concurrent deliveries produce one total onboarding email. Use durable uniqueness
   and an outbox/idempotent sender strategy; an in-memory flag is insufficient.
5. Transient database or sender failure can retry without silently losing or duplicating the message.
6. A persistent audit records event identity, outcome and sender message identifier without raw
   customer payloads, credentials or questionnaire responses in logs.
7. Evidence records one successful controlled delivery and a replay proving the total remains one.
   Provider acceptance alone is not proof the recipient received the message.

The baseline CI validates this repository's selection and workflow security.
It does not run the onboarding service or prove the seven acceptance conditions above.

## GitHub controls and verification

Required baseline check: `Artisan baseline`.
Workflow: `.github/workflows/artisan-baseline.yml`, on pushes to main and artisan branches,
pull requests to main, and manual dispatch. No repository secrets are needed.

Configure main protection: require a pull request, the baseline status check with branches
up to date, and resolved conversations; block force pushes and branch deletion; enforce for
administrators. A sole-director setup can use zero required independent approvals.
Do not claim protection until GitHub readback confirms it.

Fork Actions may require enabling in GitHub Settings / Actions. Run the baseline and record the
run URL and conclusion. A local pass is not a hosted CI pass.
Existing upstream workflows remain upstream tests and automation, not Artisan production gates.
Review scheduled/release workflows before enabling Actions; they are outside this baseline.

## Working agreement

Keep changes in a branch and review through a pull request. Do not introduce company/customer
data or credentials into this public fork. Use external secret stores at runtime.
Record operational evidence in the existing HQ register rather than creating a second register.
