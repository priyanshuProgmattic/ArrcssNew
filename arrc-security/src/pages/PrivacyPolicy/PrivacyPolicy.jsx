import { company } from '../../data/company';
import './PrivacyPolicy.css';
export default function PrivacyPolicy() {
  return (
    <section className="section privacy-page">
      <div className="container content-width">
        <p className="eyebrow">YOUR INFORMATION</p>
        <h1>Privacy policy</h1>
        <div className="privacy-draft">
          <strong>Draft for review</strong>
          <p>
            This draft describes the website as built. The company should review and approve it,
            including retention and hosting arrangements, before publication.
          </p>
        </div>
        <div className="prose">
          <h2>Who operates this website</h2>
          <p>
            This website presents {company.name}. Questions about information submitted through this
            website can be directed to <a href={`mailto:${company.email}`}>{company.email}</a>.
          </p>
          <h2>Information you choose to share</h2>
          <p>
            The enquiry forms ask for your name, company, email address, phone number, service
            requirements and message. The quote form also asks for your property type and location,
            with an optional personnel count. Please avoid including sensitive personal information
            or confidential site security details in an initial enquiry.
          </p>
          <h2>How enquiries work</h2>
          <p>
            When you submit an enquiry, the website sends your details to our server and emails
            them to the ARRC team through our configured email provider. Receipt is confirmed only
            after the email server accepts the message. We use these details to respond to your request.
          </p>
          <h2>Career applications and resumes</h2>
          <p>
            The careers form asks for your preferred role, name, email, telephone number and resume.
            You may also share your address, current location, experience, last salary and most
            recent position or employer. These additional details are optional.
          </p>
          <p>
            When you submit an application, your details and selected resume are uploaded to our
            server and emailed to our recruitment team. We use these details to assess your application
            and contact you. Resumes are limited to 5 MB and PDF, DOC or DOCX formats.
          </p>
          <h2>Local storage, cookies and analytics</h2>
          <p>
            The application does not set analytics or advertising cookies and does not save form
            entries to local storage. Fonts, the company logo and stock photography are served as
            local assets. Hosting providers may process standard request information, such as IP
            address and browser details; the actual hosting arrangements must be confirmed before
            publication.
          </p>
          <h2>Maps and external links</h2>
          <p>
            Office maps are loaded from Google Maps only when you choose to load an interactive map.
            This sends a request to Google, which may process information under its own privacy
            policy. Direction links also open Google Maps. Telephone and email links open
            applications on your device.
          </p>
          <h2>How your details are used</h2>
          <p>
            Information supplied in an enquiry is intended to help ARRC understand your
            requirements, respond to your request and discuss relevant services. The contact
            checkbox relates to that enquiry and is not a separate marketing subscription.
          </p>
          <h2>Questions and requests</h2>
          <p>
            Contact <a href={`mailto:${company.email}`}>{company.email}</a> to ask about access,
            corrections or deletion of enquiry information. Applicable rights, retention periods and
            any legal obligations should be confirmed by the company's legal adviser.
          </p>
        </div>
      </div>
    </section>
  );
}
