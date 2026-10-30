import ResponsiveImage from '../../components/common/ResponsiveImage/ResponsiveImage';
import { operations } from '../../data/operations';
import PageHero from '../../components/common/PageHero/PageHero';
import ProcessTimeline from '../../components/operations/ProcessTimeline/ProcessTimeline';
import ContactCTA from '../../components/common/ContactCTA/ContactCTA';
import Icon from '../../components/common/Icon/Icon';
import './Operations.css';
export default function Operations() {
  return (
    <div className="operations-page">
      <PageHero
        eyebrow="OUR OPERATIONS"
        title={
          <>
            Good security
            <br />
            starts with a plan.
          </>
        }
        description="A structured approach to selection, training, deployment and supervision. Because consistency comes from preparation."
        image="security-lobby.jpg"
        imageAlt="Security personnel working at a monitored reception desk"
      />
      <section className="section surface">
        <div className="container">
          <div className="section-top">
            <div>
              <p className="eyebrow">THE COMPLETE PICTURE</p>
              <h2>
                Six steps.
                <br />
                One connected operation.
              </h2>
            </div>
            <p className="operations-page__summary">
              Explore the steps below to see how
              <br />
              we bring a security plan to life.
            </p>
          </div>
          <ProcessTimeline />
        </div>
      </section>
      <section className="section">
        <div className="container operations-steps">
          {operations.map((step, index) => (
            <article className="operations-step" id={`step-${index + 1}`} key={step.label}>
              <div className="operations-step__number">
                0{index + 1}
                <span />
              </div>
              <div>
                <p className="eyebrow">{step.label}</p>
                <h2>{step.title}</h2>
                <p>{step.description}</p>
              </div>
              <ul>
                {step.details.map((detail) => (
                  <li key={detail}>
                    <Icon name="Check" size={17} />
                    {detail}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section className="section surface">
        <div className="container grid-2 operations-training">
          <ResponsiveImage
            src="/assets/images/team.jpg"
            alt="Professionals collaborating on workplace planning"
            loading="lazy"
            width="800"
            height="600"
          />
          <div>
            <p className="eyebrow">LEARNING IS CONTINUOUS</p>
            <h2>
              Prepared for the job.
              <br />
              Ready to keep learning.
            </h2>
            <p>
              Our approach to training is ongoing and progressive. Foundational instruction is
              reinforced with site-specific duties and refresher sessions as operational
              requirements develop.
            </p>
            <div className="operations-training__topics">
              <span>Professional conduct</span>
              <span>Visitor management</span>
              <span>Patrol procedures</span>
              <span>Equipment handling</span>
              <span>Fire prevention</span>
              <span>First aid</span>
            </div>
          </div>
        </div>
      </section>
      <ContactCTA />
    </div>
  );
}
