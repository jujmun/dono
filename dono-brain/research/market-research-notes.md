# Market Research Notes

Supporting market data, customer segmentation and prior-art analysis behind
Dono's positioning. Complements the qualitative interviews in
[meetings/](meetings/) and the survey data in [responses/](responses/).

## Market data behind the Dono pitch

- CAF's *UK Giving 2026*: total UK public donations fell from £15.4bn (2024) to £14bn (2025); average charitable gift fell from £72 to £65; 49% of non-donors cited affordability as the reason (up from 44% in 2024)
- UK real household disposable income fell 0.8% in Q1 2026 — the fourth fall in five quarters (ONS, reported June 2026)
- Just over 6 in 10 people believe donations reach their intended cause — a substantial trust gap (government reporting)
- Charity Commission (2025): whether donations reach the end cause is among the top factors in public trust in giving
- HEPI (2025): first-year student living costs estimated at £21,126 (England) / £24,900 (London); maximum English maintenance loan covers only ~50% of costs
- NUS: the parental-income threshold for maximum maintenance support has stayed at £25,000 since 2008 — would be ~£41,000 today if inflation-adjusted
- Resolution Foundation analysis: 52% of students from England's poorest neighbourhoods expect to live at home vs. 18% from wealthier areas, limiting access to the full university experience
- HEPI survey: 68% of students now work during term time (up from 35% in 2015); average independent study time fell from 13.6 to 11.6 hrs/week

**Read:** people have less money and trust institutions less, at the same time students are financially worse off — the case for smaller, transparent, direct giving.

## Prior art: OxReach

Oxford previously ran **OxReach**, a project-crowdfunding pilot built with
external consultancy **Hubbub**, before Dono. Only 6 projects were ever listed
— 4 from professors, 1 from a master's student, 1 from an undergraduate — i.e.
it skewed toward academic staff, not students. The pilot was not renewed.
Useful precedent to reference when talking to colleges/consultants: Dono
should understand why OxReach stayed small and academic-skewed rather than
becoming a student-facing product.

## Customer segmentation (three-sided market)

- **Donors (alumni)**: recent graduates (~10 years out, entering higher income) through older alumni still connected to their societies
- **Students (non-paying side)**: individuals (specific projects, travel grants, academics), teams/societies (sports, JCR, social), and students proposing larger group projects others can upvote/back
- **Colleges**: a route to diversify income, an alternative donation pathway, and potential donation matching

Framing: students care that funding is currently difficult and bureaucratic;
donors care about transparency and seeing their money reach the right place.
Colleges are drawn by discontent with the status quo and an untapped young-alumni
market. Next evidence needed: structured interviews with all three groups to
build a customer-needs / MVP spec.

## Student survey analysis (Fable form, n=23)

Full analysis of the "Dono Student Research Survey" responses:

- **Need is real and recurrent, not huge**: 14/23 had needed money for university activities; modal frequency 2–3×/year, modal amount £150–£500 (7/14), with a tail at £1,000–£2,000 (internships abroad, startups, conference travel). Academic travel is the dominant use case (9 mentions) ahead of sports kit (6) and personal projects/startups (5). Because campaign sizes are small, a percentage transaction fee yields little per campaign, and "taking fees" was explicitly named as a put-off.
- **Existing college funding is failing this group**: of 11 who applied for a grant/hardship fund, 8 were turned down or under-funded (73% failure/shortfall rate). Fallback is regressive — savings, parents, or simply forfeiting the opportunity.
- **Trust runs through the institution, not the product**: 12/23 said "my college or university officially endorsing it" is the one thing that would make them trust Dono — more than friends using it (5), campaign outcomes (3) and fund transparency (2) combined. This is a go-to-market finding: a JCR/college/department partnership route matters more than consumer polish.
- **Embarrassment is the central product enemy**: top hesitations were "I'd feel embarrassed asking publicly" (14/23), "I don't think anyone would actually donate" (11), "it's not for me — others need it more" (8). Only 8/23 are comfortable being fully public; 10 want college-or-community-only visibility; the rest want anonymity or wouldn't post at all.
- **Three respondent segments**:
  - *Blocked achievers* (~8 people, the launch users): genuine recurring need, applied formally, rejected/short-changed, self-funded or forfeited. Higher mean campaign likelihood (7.1 vs 6.0). Several offered follow-up interviews; two independently proposed alumni-matching for work experience/donations.
  - *The insulated* (~6–7): costs covered by parents/savings, low usefulness scores, heavy hesitation stacks — not the target customer, though some show interest in browsing other campaigns as spectators (hints at a donor-side/social pull).
  - *The silent struggler* (n=1): the most serious hardship case in the sample, but the lowest campaign likelihood and unwillingness to post at all — suggests Dono (as scoped) serves *opportunity* funding, not hardship, and that framing needs to be explicit.
- **Design signal**: Kate's suggested mechanism — minimal public detail, full identity revealed only to donors — is the most concrete idea in the dataset for solving the embarrassment problem.
- **Open questions flagged for follow-up**: no demand-side data yet (would students/alumni actually donate to strangers?); need to test behaviour not stated intent (e.g. "have you used GoFundMe/JustGiving for a university cost, and if not, why not?"); need to probe whether a JCR/college/department would co-brand or endorse; and whether society/team fundraising (low embarrassment, clear audience) is an easier wedge than personal fundraising (high embarrassment) — 8/23 said their societies struggle to fund things often or always.

## Alumni survey (early, thin sample)

A short alumni-focused survey ("Dono Short Alumni Research Survey") only
gathered 2 responses before being superseded by the student survey above.
Both respondents were non-donors: reasons given were not hearing about
donation opportunities and not believing in donating. Too small a sample to
draw conclusions from — flagged here so the attempt isn't lost, not as data.

## US fraternity alumni giving (informal note, via Sameer)

- US fraternity alumni giving is stratified: "richer" fraternities on a campus tend to have wealthier alumni and a stronger giving culture; e.g. ~10 fraternities at Duke, ~30 at Florida State
- Primary funding source is member dues, not alumni gifts
- The national fraternity organisation (not just the university chapter) holds the broader alumni network, but is often slow/difficult to work with
- Suggested growth levers: let members connect social media profiles to inherit identity/network data, and target alumni at reunions

---

Source: raw notes/analysis, converted from files under `TO BE ORGANISED/Outreach/` (`Market Research Questions + Dono Pitch.docx`, `[Meeting] Customer Analysis 11-12.docx`, `Student Form Fable Analysis.docx`, `OxReach Questions.docx`, `Sameer (Frat).docx`) and `Dono Student Research Survey (Responses).xlsx`.
