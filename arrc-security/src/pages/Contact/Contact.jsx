import { company } from '../../data/company';
import PageHero from '../../components/common/PageHero/PageHero';
import InquiryForm from '../../components/forms/InquiryForm/InquiryForm';
import OfficeLocations from '../../components/common/OfficeLocations/OfficeLocations';
import Icon from '../../components/common/Icon/Icon';
import './Contact.css';
export default function Contact() {
  return (
    <div className="contact-page">
      <PageHero
        eyebrow="CONTACT US"
        title={
          <>
            Good partnerships
            <br />
            start with a conversation.
          </>
        }
        description="A question, a new site or a fresh approach to your operations. We're here to help you take the next step."
        image="workplace.jpg"
        imageAlt="A bright professional environment for a conversation"
      />
      <section className="section">
        <div className="container contact-page__grid">
          <div className="contact-page__details">
            <p className="eyebrow">LET'S CONNECT</p>
            <h2>
              Your next step
              <br />
              towards peace of mind.
            </h2>
            <p>
              Tell us what you need. Our team can discuss your requirements and the right mix of
              services for your organization.
            </p>
            <div className="contact-method">
              <span>
                <Icon name="Phone" size={23} />
              </span>
              <div>
                <h3>Speak to our team</h3>
                <a href={`tel:${company.salesTel}`}>{company.salesPhone}</a>
                <a href={`tel:${company.officeTel}`}>
                  {company.officePhone} <small>Office</small>
                </a>
              </div>
            </div>
            <div className="contact-method">
              <span>
                <Icon name="Mail" size={23} />
              </span>
              <div>
                <h3>Write to us</h3>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </div>
            </div>
            <div className="contact-method">
              <span>
                <Icon name="MapPin" size={23} />
              </span>
              <div>
                <h3>Corporate office</h3>
                <p>{company.offices[1].address}</p>
              </div>
            </div>
            <div className="contact-page__note">
              <Icon name="ShieldCheck" size={21} />
              <p>
                One conversation. A complete view of your security, facilities and workforce needs.
              </p>
            </div>
          </div>
          <InquiryForm />
        </div>
      </section>
      <OfficeLocations />
    </div>
  );
}
