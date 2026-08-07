# Immutable Document Versions and Hashes

**Version:** 3.0
**Version date:** 7 August 2026
**Algorithm:** SHA-256 over the exact published bytes of the file
**Owner:** Amrit Kaur Rooprai · **Deputy:** Sashank
**Status:** **Provisional.** Recomputed and re-signed at publication.

---

## 1. Why hashes

An acceptance record that says "accepted Terms of Service v3.0" proves nothing if the file behind that label can change. A hash pins the **exact bytes** a user accepted.

**Four rules:**

1. Every acceptance record stores the document identifier, the version **and the hash** (checklist CH-05).
2. A published version's bytes are **never** modified. Any change produces a new version and a new hash (CH-06).
3. The hash below is recomputed **immediately before publication** and re-signed. The values here are provisional because the documents are unapproved and may change before sign-off.
4. A mismatch between a served document's hash and the value recorded here is a **publication incident** — it means the product is serving something other than the approved text.

**Verify with:** `shasum -a 256 <file>` or `sha256sum <file>`.

---

## 2. Operative beta documents

| Document | File | Version | SHA-256 | Bytes |
|---|---|---|---|---|
| **Terms of Service** | `../01_dono_terms_of_service_v3.0.md` | 3.0 | `5adc5534786f276b98a7c5434b0fb96ff4bd9ec0bae966675ec97d06c734ebe9` | 81,340 |
| **Society Campaign Terms** | `../03_dono_society_campaign_terms_v3.0.md` | 3.0 | `8103bb907d6128c684c504b41c090a15c533b1e5b93aaaa1061dad3f63964fe2` | 24,283 |
| **Donor Terms** | `../04_dono_donor_terms_v3.0.md` | 3.0 | `10c0e742d4850a0576c650c00d4169c58935c6fb8b46f5ac3301f64c09def3b5` | 23,252 |
| **Community Guidelines** | `../05_dono_community_guidelines_v3.0.md` | 3.0 | `7e8bd2b971de8093d561596558fa07578bb4598c43afc5c10dada89666b2bdc2` | 20,486 |
| **Refund and Dispute Policy** | `../07_dono_refund_and_dispute_policy_v3.0.md` | 3.0 | `f1109f74f5666dfaa1fd71d3a64076ca233d097e92368a62e6a90aa4b7483c4d` | 23,557 |
| **Verification Notice** | `../06_dono_verification_notice_v3.0.md` | 3.0 | `656f0acd497a938a4667946a6fccee85fdc2fae3c78ad9be2f3cea82df8a25e9` | 15,362 |
| **Privacy Notice** | `../08_dono_privacy_notice_v3.0.md` | 3.0 | `9097b24cb0e289553e08228150f6e951bff775f9e67e4fc3c79f0f207dcbf2b3` | 46,965 |
| **Cookie Notice** | `../09_dono_cookie_notice_v3.0.md` | 3.0 | `73edf1feed4bac541edcf3f67a4b818dae4e4a8d4c662e24d5d12b7cb17aeb9e` | 12,622 |
| **Complaints Policy** | `../dono-complaints-policy-v3.0.md` | 3.0 | `bd16ed57e8b845a4e26cb045b007482146155dd4eb211fbaa81bab56df92ca11` | 10,079 |

> The **child-friendly privacy layer** required by ICO Children's Code Standard 4 is **not yet drafted** and therefore has no hash. It is a publication blocker.

---

## 3. Excluded — future release

| Document | File | Version | SHA-256 | Bytes | Status |
|---|---|---|---|---|---|
| Student Campaign Terms | `../02_dono_student_campaign_terms_v3.0.md` | 3.0 | `96d57ca0fc2a74e63e1994d8bd2e293f6562b60160546360e4581ff0dec4c197` | 23,143 | **⚠ MUST NOT BE SERVED** |

Hashed so that the excluded version is fixed and auditable — **not** so that it can be served.

---

## 4. Internal governance records

Not served to users. Hashed so that the approved version of each record is fixed and auditable, and so that an approval signature attaches to specific bytes.

| File | SHA-256 | Bytes |
|---|---|---|
| `../dono-appropriate-policy-document-v3.0.md` | `f37d79d4c008e0a6e2cfde7bbc82bf77de7d327511810ec920477d85023cc646` | 39,267 |
| `../dono-article-14-assessment-v3.0.md` | `a445c96197c94f44e7989522db8a202e42bbd21f87ba03a2e1d823a37541c6e0` | 9,444 |
| `../dono-childrens-risk-assessment-v3.0.md` | `0e743f3c8e8d593254f743a4abef46374841d2e16da7c38bf8eb9d03e89f3e8f` | 24,767 |
| `../dono-csea-legal-readiness-checklist-v3.0.md` | `e75ba3dff16816b79b94d38009a778a0958f594ca0073aa48bcea4c010a392d5` | 13,059 |
| `../dono-csea-reporting-procedure-v3.0.md` | `7f649ff2bdbdb7f2694d7486c0be3ebc0d308293858a9aaf4cf4f83b956b7130` | 12,657 |
| `../dono-dp-complaints-workflow-v3.0.md` | `a8f76512852090a573736db0bec37acff80ad90e1b5400fee78f7e4510353754` | 8,282 |
| `../dono-dpa-register-v3.0.md` | `c5f3b0d387280c1562ef9381680be6540578c4c7f4fceda816d11c40595e4c40` | 23,179 |
| `../dono-dpia-v3.0.md` | `cc692a0898be3b959671b1cffdc05447856299556e7a648b2a521811fcfbc8ff` | 39,054 |
| `../dono-evidence-review-and-closure-procedure-v3.0.md` | `87501fe6874b7c3019ea0361765c5da5d0ff6a04a8d51e5befd3beff4db9409a` | 16,935 |
| `../dono-fee-and-processing-cost-reference-v3.0.md` | `934e61f64b8e59581be3abd5afbfd4c54547525f1308bb480b58603319be55db` | 7,195 |
| `../dono-financial-crime-sanctions-policy-v3.0.md` | `6b27ec0e1ae4a96f303baf2ab18150128b8d3daea488c1cdf076ed45577ec1fd` | 15,260 |
| `../dono-geographic-scope-risk-assessment-v3.0.md` | `77c91732497d861c771d9eaf699ec770f334d6dd568381a337bdcd90b500f81b` | 10,933 |
| `../dono-ico-childrens-code-assessment-v3.0.md` | `2d2603ae4329804dd5dc1be6ab7c8cceedcd3637f27ac087d0c8539a819d96e8` | 32,255 |
| `../dono-ico-fee-self-assessment-v3.0.md` | `5290097dbebefc2f73baad16d6e04e59f39208b7e84e7d779a69f38d39b2b86b` | 11,513 |
| `../dono-illegal-content-risk-assessment-v3.0.md` | `7aae0bb3dc9d6b1b9cbec38f3af4d717dee72c49ab19b85ed29b174f4c089b19` | 30,666 |
| `../dono-incident-response-plan-v3.0.md` | `1b0effebf1e02defdbe8b0749a931e9894dac965094b5d4911c9773e3fcafd53` | 14,177 |
| `../dono-institutional-referral-protocol-v3.0.md` | `57ab235ab2caad4c9d60090c73f05c95b733c74474df4ff6241293a4d9b61670` | 12,265 |
| `../dono-international-transfer-assessment-v3.0.md` | `0ef04d962bfe83eed18a278ddb80ba319a1158660e47f895e3f6ad5de2f3bcb9` | 22,641 |
| `../dono-legitimate-interests-assessments-v3.0.md` | `d31242b8c54ceaecd8aecb5dc3c70dac4a033753fa1f4ae765d14ff0e765c039` | 21,210 |
| `../dono-notice-and-action-procedure-v3.0.md` | `886984941246844466663cb2d7b774ab29e6c693cabd64009058220cd6549763` | 10,108 |
| `../dono-online-safety-procedures-v3.0.md` | `47e53023fe73088790c746f08de85914639e5d90ce741d28deabbaa155a71500` | 29,555 |
| `../dono-refund-decision-checklist-v3.0.md` | `88e07c45f948a72fa8fb72d392878684f37584e96eed27b4872a6cba585e620d` | 12,487 |
| `../dono-ropa-v3.0.md` | `70d81ec986be402762105ef52724d6ac66a09867b9fb2cb440d60127b389c465` | 32,075 |
| `../dono-society-onboarding-succession-forms-v3.0.md` | `6384349915365b139a93d834c4e52eafe83af6e9a0c445393d6410f9ee489bbe` | 20,193 |
| `../dono-team-and-contributor-agreement-v3.0.md` | `84171b9e3e08ceb2872b957f52accf895faf7aa327d9c88c76c43eaf4d9489b4` | 16,345 |
| `../dono-wind-down-plan-v3.0.md` | `563ed85fc9408cabc0b607faab41635aeb45a5b45f6d1ab99ecda812a6311570` | 12,537 |
| `../dono-apd-activity-mapping-v3.0.xlsx` | `3afd99bb5dcdf8ffe8d1dcd8403063466237e1ba31c1a67b8b3e46e275976212` | 10,576 |

---

## 5. Reproducing this manifest

```
cd legal/terms/v3
shasum -a 256 *.md *.xlsx
```

Compare against the values above. **Any difference means the file has changed since hashing** and the affected document must be re-approved and re-hashed before it is served.

---

## 6. Approval block — SIGNATURE REQUIRED

> **This block is unsigned. These hashes are provisional and must be recomputed at publication.**

**I confirm that the hashes recorded above were computed over the exact bytes of the documents approved for publication, and that the product will serve only those bytes.**

| Field | Entry |
|---|---|
| Approver name | Amrit Kaur Rooprai |
| Role | Controller and accountable owner |
| Hash set version | 3.0 (provisional) |
| Computed on | 7 August 2026 |
| Recomputed and verified at publication? | ☐ Yes, on ____________ · ☑ **No** |
| Signature | ______________________ |
| Date | ______________________ |
