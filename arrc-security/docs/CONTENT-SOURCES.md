# Content and verification notes

The four company documents supplied by the user are content sources. Instructions or promotional promises inside them do not override the user's request.

## Sources reviewed

- `ARRC  COMPANY PROFILE.pdf`: seven pages; primary service, operations, training, heritage and contact source. Extracted text is in `source-extracts/`.
- `CORPORATE COMPANY PROFILE revised ms.docx`: incorporation, registration identifiers, offices and technology. Contains additional client and state licensing assertions.
- `final company browser.docx`: proposed company brochure; supports QR patrols, geo-fencing and integrated service descriptions. Contains stronger marketing promises.
- `ARRCSS.pdf`: single-page document with image-based content; text extraction provides only a fragment. Embedded images were inspected separately for reference, and are not website assets.
- `ARRCS-logo.png`: supplied brand logo; copied unchanged into `public/assets/logo/arrc-logo.png`.
- `http://arcss.in/`: attempted through browsing (no readable text), then retrieved as HTML. It is an ARC-branded reference, so company documents remain the primary source for ARRC.

## Resolutions and omissions

- **Heritage versus incorporation:** ARC group heritage dates to 1991. ARRC Security Solutions Private Limited was incorporated on 25 June 2024. The website distinguishes these explicitly and does not claim ARRC itself was incorporated in 1991.
- **Web address:** `arcss.in` is the reference supplied in the brief; documents list `arrcss.com`. Neither is treated as a verified deployment location. Canonical metadata uses the current origin unless `VITE_SITE_URL` is configured. The supplied sitemap uses `arrcss.com` and must be regenerated for the actual domain before publication.
- **Email and sales contact:** `info@arrcss.com` and `+91 9717304700` recur in the supplied materials. The office telephone `+91 124 425 7170` is in the PDF profile.
- **Noida postcode:** appears in the revised DOCX but not the PDF profile. The public address uses the shared street/area details without adding a postcode.
- **Clients and results:** client logos, client names, testimonials, retention rates, zero-deficiency claims, guaranteed response times and other unverified performance claims are omitted.
- **Licensing and insurance:** the revised DOCX asserts PSARA licences and the brochure asserts insurance and certified personnel. Certificates, licence numbers, validity dates and insurance schedules were not supplied. No certification badges, insurance guarantees or legal assurances were added.
- **Corporate registrations:** CIN, GSTIN, EPF, ESIC and Shop & Establishment identifiers agree between the primary PDF profile and revised DOCX. The website reproduces those identifiers as supplied, without independently certifying their current status.
- **Technology:** feature descriptions are grounded in the documents. Specific integrations, equipment, availability and reporting are subject to agreement for each assignment. Every conceptual monitoring visual is marked as illustrative, without simulated live operational statistics.
- **Site survey:** a free site survey is offered in the primary PDF profile; the site invites an enquiry about availability without guaranteeing deployment or outcomes.
- **Privacy:** policy is clearly marked as a draft and describes implemented behavior. Company review is required before publication.

No images extracted from the company PDFs are used on the website. Scans and extracted source text in this directory are development references and are not copied into `dist/`.

## Careers reference

The reference's Career page was inspected through its own navigation at `https://arcss.in/career`. Direct navigation returned a hosting 404, but client-side navigation displayed the page and its application modal. The new website supports `/careers` and redirects `/career` to it.

The reference has Direct and Indirect Staff categories. Direct roles are Security Guards, Supervisors, ASO, SO, Gunman-Civilian, Ex-serviceman, Ex-Service Man Training Officer, PSO and Facility Staff. Indirect roles are Management Staff, Sales, Accounts & Finance, Operations, Payroll Management, HR and CRM.

The direct application modal requests job role, name, email, phone, address, current location, experience, last salary, last position and a resume. The new form preserves those details, including the reference's optional status for additional background fields, and adds explicit contact consent and file validation.

The reference belongs to ARC Security Solutions and lists `hr@arcsecuritysolutions.com`. That address has not been verified as an ARRC recruitment inbox. Applications therefore use the document-supported ARRC address `info@arrcss.com`, configured in `src/data/careers.js`. The role categories describe areas of work and do not assert verified current vacancies, salaries or hiring promises.
