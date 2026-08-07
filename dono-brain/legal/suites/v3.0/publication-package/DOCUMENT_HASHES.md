# Immutable Document Versions and Hashes

**Version:** 3.0
**Version date:** 7 August 2026
**Algorithm:** SHA-256 over the exact published bytes of the file
**Owner:** Amrit Kaur Rooprai · **Deputy:** Sashank
**Status:** Markdown source hashes recorded. Rendered publication hashes still required.

---

## 1. Why hashes

An acceptance record that says "accepted Terms of Service v3.0" proves nothing if the file behind that label can change. A hash pins exact bytes. The hashes below pin the canonical Markdown source; they are not substitutes for hashes of the HTML and PDF files users will actually see or receive.

**Four rules:**

1. Every acceptance record stores the document identifier, the version **and the hash** (checklist CH-05).
2. A published version's bytes are **never** modified. Any change produces a new version and a new hash (CH-06).
3. The Markdown source hash below is verified immediately before rendering. The generated HTML and PDF each receive a separate hash in the live-version manifest, and those artifact hashes are rechecked immediately before publication.
4. A mismatch between a served document's hash and the value recorded here is a **publication incident** — it means the product is serving something other than the approved text.

**Verify with:** `shasum -a 256 <file>` or `sha256sum <file>`.

---

## 2. Operative beta documents

| Document | File | Version | SHA-256 | Bytes |
|---|---|---|---|---|
| **Terms of Service** | `../public/01_dono_terms_of_service_v3.0.md` | 3.0 | `cc818552ddb1be407a8dd1af5825b50959cba0dea8d7d09869c144017f428bda` | 81,371 |
| **Society Campaign Terms** | `../public/03_dono_society_campaign_terms_v3.0.md` | 3.0 | `75607b402c151a2f3b33989d52c20d0083be20a361908955202f652890208530` | 24,308 |
| **Donor Terms** | `../public/04_dono_donor_terms_v3.0.md` | 3.0 | `efe48e3a0abc008e2a6f4dc6299efe53a60353bc3450bf9c33d2cf555759f74b` | 23,277 |
| **Community Guidelines** | `../public/05_dono_community_guidelines_v3.0.md` | 3.0 | `92c00f4465f11385c7470b42952b79cff3b7ffc1095639c1c0803315ac1149e1` | 20,520 |
| **Refund and Dispute Policy** | `../public/07_dono_refund_and_dispute_policy_v3.0.md` | 3.0 | `1237eba717eee26b2e89122dc4e61fc89ebb866184b4c86f3e97976a415428fa` | 23,582 |
| **Verification Notice** | `../public/06_dono_verification_notice_v3.0.md` | 3.0 | `10b71d0efc30c5c7b012275e274f69173bc900ac7f617ff949511871be822f11` | 15,387 |
| **Privacy Notice** | `../public/08_dono_privacy_notice_v3.0.md` | 3.0 | `4cdf37035558f7727a3450a90506e0193c0e1978ba8a771d56b32e2825e116ff` | 46,990 |
| **Cookie Notice** | `../public/09_dono_cookie_notice_v3.0.md` | 3.0 | `42e80d52b73728d51fa22bd1376e903eb93f9f28a9f7660ab1f921eecc83331e` | 12,647 |
| **Complaints Policy** | `../public/dono-complaints-policy-v3.0.md` | 3.0 | `ee96e212927b8a73c9bd8c4c93f2ca02440218e4e7895ba6c35ef37eb19eccdb` | 10,091 |

> The **child-friendly privacy layer** required by ICO Children's Code Standard 4 is **not yet drafted** and therefore has no hash. It is a publication blocker.

---

## 3. Excluded — future release

| Document | File | Version | SHA-256 | Bytes | Status |
|---|---|---|---|---|---|
| Student Campaign Terms | `../future/02_dono_student_campaign_terms_v3.0.md` | 3.0 | `f9de86d87752cc40cc9585babef466ffba238dabf588d00ef49b1f829a297366` | 23,143 | **⚠ MUST NOT BE SERVED** |

Hashed so that the excluded version is fixed and auditable — **not** so that it can be served.

---

## 4. Internal governance records

Not served to users. Hashed so that the approved version of each record is fixed and auditable, and so that an approval signature attaches to specific bytes.

| File | SHA-256 | Bytes |
|---|---|---|
| `../internal/dono-appropriate-policy-document-v3.0.md` | `97bd5db30bfa6a3fa1d1cb361f6c7c1a1c726d299b29d186a8ad0114dde4f155` | 39,289 |
| `../internal/dono-article-14-assessment-v3.0.md` | `a445c96197c94f44e7989522db8a202e42bbd21f87ba03a2e1d823a37541c6e0` | 9,444 |
| `../internal/dono-childrens-risk-assessment-v3.0.md` | `0e743f3c8e8d593254f743a4abef46374841d2e16da7c38bf8eb9d03e89f3e8f` | 24,767 |
| `../procedures/dono-csea-legal-readiness-checklist-v3.0.md` | `3708a6c3bade9939171c73413962bf2a1e4c36a39579dac8b23a2af1bd0c4acc` | 13,062 |
| `../procedures/dono-csea-reporting-procedure-v3.0.md` | `9d03f664a102d48eceed3d0865128b8cfb9f50c01e27275da9c2630ca11ec6dd` | 12,767 |
| `../procedures/dono-dp-complaints-workflow-v3.0.md` | `2940afc57b2757085c5cf880aeff5685550eb1f27c20b0b9edcdb54b37cd74ef` | 8,301 |
| `../internal/dono-dpa-register-v3.0.md` | `f4c84ee71d922d741fd9e6cdf5863f3ce9454af7c41e238dcd8d0b2d4d64850f` | 23,185 |
| `../internal/dono-dpia-v3.0.md` | `a91b9f4e01fa98facdb94591efef8dc9f2d26879c79a6e38a36f97d4d0914b0e` | 39,072 |
| `../procedures/dono-evidence-review-and-closure-procedure-v3.0.md` | `87501fe6874b7c3019ea0361765c5da5d0ff6a04a8d51e5befd3beff4db9409a` | 16,935 |
| `../internal/dono-fee-and-processing-cost-reference-v3.0.md` | `934e61f64b8e59581be3abd5afbfd4c54547525f1308bb480b58603319be55db` | 7,195 |
| `../procedures/dono-financial-crime-sanctions-policy-v3.0.md` | `62826b82d4ac276b892659a3786222929e90ea5c96a3cabbeb6f86321f3b2219` | 15,320 |
| `../internal/dono-geographic-scope-risk-assessment-v3.0.md` | `77c91732497d861c771d9eaf699ec770f334d6dd568381a337bdcd90b500f81b` | 10,933 |
| `../internal/dono-ico-childrens-code-assessment-v3.0.md` | `d55da3eabb95b00025390b49c31c5eed9557dd83bcd757797f9ad4401f687199` | 32,333 |
| `../internal/dono-ico-fee-self-assessment-v3.0.md` | `05b2cce583c6505fbc637c0cafa37f0c3da39cbef73cb797f3756464d68e9935` | 11,553 |
| `../internal/dono-illegal-content-risk-assessment-v3.0.md` | `7aae0bb3dc9d6b1b9cbec38f3af4d717dee72c49ab19b85ed29b174f4c089b19` | 30,666 |
| `../procedures/dono-incident-response-plan-v3.0.md` | `be69e81659d6421b16d7cf1f5a8d32dab96073ac2abe66a0b80dbf6b3062652a` | 14,196 |
| `../procedures/dono-institutional-referral-protocol-v3.0.md` | `57ab235ab2caad4c9d60090c73f05c95b733c74474df4ff6241293a4d9b61670` | 12,265 |
| `../internal/dono-international-transfer-assessment-v3.0.md` | `559c53d6af9e22418b0bca16a3b68f719bf269abee87e29ca482840038519252` | 22,647 |
| `../internal/dono-legitimate-interests-assessments-v3.0.md` | `d31242b8c54ceaecd8aecb5dc3c70dac4a033753fa1f4ae765d14ff0e765c039` | 21,210 |
| `../procedures/dono-notice-and-action-procedure-v3.0.md` | `886984941246844466663cb2d7b774ab29e6c693cabd64009058220cd6549763` | 10,108 |
| `../procedures/dono-online-safety-procedures-v3.0.md` | `7e3674006bcb8d20321e547a0e5ae30e8a6f3726fea60b0f27cd7ac2a524c5a2` | 29,635 |
| `../procedures/dono-refund-decision-checklist-v3.0.md` | `88e07c45f948a72fa8fb72d392878684f37584e96eed27b4872a6cba585e620d` | 12,487 |
| `../internal/dono-ropa-v3.0.md` | `0d1372c77484d4ea113f1c0eb1a5db1a637623f22bc4ca3f27f384ebb9599322` | 32,087 |
| `../procedures/dono-society-onboarding-succession-forms-v3.0.md` | `673ad7c3e771daa4124b52f868dc6d33eaebd33c350485691de47a238224826c` | 20,196 |
| `../internal/dono-team-and-contributor-agreement-v3.0.md` | `84171b9e3e08ceb2872b957f52accf895faf7aa327d9c88c76c43eaf4d9489b4` | 16,345 |
| `../procedures/dono-wind-down-plan-v3.0.md` | `9f39c6d568ecaeb6310c8d8888238ffa071a934049a901579db3a9d4b802c549` | 12,539 |
| `../00_v3.0_change_log.md` | `fa69ef11064f313f8ddc7ce3cec9c713f6fe3e00e2faa25f0218c757289f661f` | 10,095 |
| `../internal/dono-apd-activity-mapping-v3.0.xlsx` | `3afd99bb5dcdf8ffe8d1dcd8403063466237e1ba31c1a67b8b3e46e275976212` | 10,576 |

---

## 5. Reproducing this manifest

```
cd legal/suites/v3.0
shasum -a 256 00_v3.0_change_log.md public/*.md future/*.md internal/*.md internal/*.xlsx procedures/*.md
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
| Computed on | 7 August 2026 (final, post-consolidation) |
| Recomputed and verified at publication? | ☐ Yes, on ____________ · ☑ **No** |
| Signature | ______________________ |
| Date | ______________________ |
