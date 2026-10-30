import Button from '../Button/Button';
import { company } from '../../../data/company';
import Icon from '../Icon/Icon';
import './ContactCTA.css';
export default function ContactCTA() {
  return (
    <section className="contact-cta">
      <div className="container contact-cta__inner">
        <div>
          <p className="eyebrow">YOUR PEOPLE. YOUR PROPERTY. OUR PRIORITY.</p>
          <h2>
            Let's build a safer
            <br />
            environment. Together.
          </h2>
        </div>
        <div className="contact-cta__actions">
          <Button to="/request-quote" variant="white">
            Start a conversation
          </Button>
          <a href={`tel:${company.salesTel}`}>
            <Icon name="Phone" size={15} />
            {company.salesPhone}
          </a>
        </div>
      </div>
      <span className="contact-cta__circle" aria-hidden="true" />
    </section>
  );
}
