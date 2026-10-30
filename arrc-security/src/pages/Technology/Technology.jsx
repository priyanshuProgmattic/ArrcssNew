import { technology } from '../../data/operations';
import PageHero from '../../components/common/PageHero/PageHero';
import TechnologyPanel from '../../components/common/TechnologyPanel/TechnologyPanel';
import ContactCTA from '../../components/common/ContactCTA/ContactCTA';
import Button from '../../components/common/Button/Button';
import Icon from '../../components/common/Icon/Icon';
import './Technology.css';
export default function Technology() {
  return (
    <div className="technology-page">
      <PageHero
        eyebrow="OUR TECHNOLOGY"
        title={
          <>
            A clearer view.
            <br />A more connected site.
          </>
        }
        description="Professional people remain at the heart of security. The right technology helps them work with greater visibility and accountability."
      />
      <section className="section">
        <div className="container grid-2 technology-intro">
          <div>
            <p className="eyebrow">TURNING ACTIVITY INTO INSIGHT</p>
            <h2>
              Physical presence.
              <br />
              Digital confidence.
            </h2>
            <p className="lead">
              A guard at a post. A patrol at a checkpoint. A clearer record of the work that happens
              on your site.
            </p>
            <p>
              Our technology-supported approach brings together GPS, geo-fencing and QR-based
              patrolling. These tools connect site activity with supervision and service review.
            </p>
            <p>
              Monitoring features, equipment, escalation rules and report formats depend on the
              assignment and are agreed with your team during planning.
            </p>
          </div>
          <TechnologyPanel />
        </div>
      </section>
      <section className="section surface">
        <div className="container">
          <div className="section-top">
            <div>
              <p className="eyebrow">A CONNECTED TOOLKIT</p>
              <h2>
                Technology with
                <br />a practical purpose.
              </h2>
            </div>
          </div>
          <div className="technology-features">
            {technology.map((feature, index) => (
              <article key={feature.title}>
                <div>
                  <Icon name={feature.icon} size={29} />
                  <span>0{index + 1}</span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2 technology-planning">
          <div>
            <p className="eyebrow">DESIGNED FOR YOUR OPERATION</p>
            <h2>
              The right tools.
              <br />
              The right expectations.
            </h2>
          </div>
          <div>
            <p>
              Useful technology starts with clear questions: which areas need to be monitored, who
              reviews an exception, and what should a report help you decide?
            </p>
            <ul className="check-list">
              <li>
                <Icon name="Check" size={18} />
                Define the site boundaries and patrol checkpoints
              </li>
              <li>
                <Icon name="Check" size={18} />
                Agree attendance and reporting requirements
              </li>
              <li>
                <Icon name="Check" size={18} />
                Set clear responsibilities for reviewing alerts
              </li>
              <li>
                <Icon name="Check" size={18} />
                Confirm equipment, connectivity and data access
              </li>
            </ul>
            <Button to="/request-quote?service=smart-security">
              Discuss your security technology
            </Button>
          </div>
        </div>
      </section>
      <ContactCTA />
    </div>
  );
}
