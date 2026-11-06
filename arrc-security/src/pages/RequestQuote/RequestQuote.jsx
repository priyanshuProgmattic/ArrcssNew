import InquiryForm from '../../components/forms/InquiryForm/InquiryForm';
import PageHero from '../../components/common/PageHero/PageHero';
import Icon from '../../components/common/Icon/Icon';
import { company } from '../../data/company';
import './RequestQuote.css';
export default function RequestQuote() {
  return (
    <div className="quote-page">
      <PageHero
        eyebrow="REQUEST A QUOTE"
        title={
          <>
            The right solution
            <br />
            starts with you.
          </>
        }
        description="Tell us about your site, your team and the support you're looking for. Let's shape an approach around your requirements."
        image="workplace.jpeg"
        imageAlt="A professional workspace ready for its team"
      />
      <section className="section">
        <div className="container quote-page__grid">
          <aside>
            <p className="eyebrow">A CONSIDERED START</p>
            <h2>
              A plan.
              <br />A partnership.
              <br />
              Peace of mind.
            </h2>
            <p>
              Whether you need one service or a connected combination, we start by understanding
              your operation.
            </p>
            <ol>
              {[
                'Tell us about your requirements',
                'Discuss your site with our team',
                'Explore a tailored service proposal',
              ].map((step, index) => (
                <li key={step}>
                  <span>0{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="quote-page__phone">
              <Icon name="Phone" size={23} />
              <div>
                <span>Prefer a conversation?</span>
                <a href={`tel:${company.salesTel}`}>{company.salesPhone}</a>
              </div>
            </div>
            <p className="quote-page__footnote">
              A site survey can help define the scope. Quotations depend on your location, duties,
              deployment and service arrangements.
            </p>
          </aside>
          <InquiryForm isQuote />
        </div>
      </section>
    </div>
  );
}
