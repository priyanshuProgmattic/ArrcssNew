import { commitments } from '../../data/company';
import PageHero from '../../components/common/PageHero/PageHero';
import ContactCTA from '../../components/common/ContactCTA/ContactCTA';
import Button from '../../components/common/Button/Button';
import Icon from '../../components/common/Icon/Icon';
import './WhyChooseUs.css';
const features = [
  ...commitments,
  {
    icon: 'GraduationCap',
    title: 'Training that keeps developing',
    description:
      'Foundational instruction, site-specific preparation and refresher training support practical skills throughout an assignment.',
  },
  {
    icon: 'MessagesSquare',
    title: 'A conversation that stays open',
    description:
      'Customer care gathers feedback, follows up on concerns and supports service improvements with your management team.',
  },
  {
    icon: 'MapPinned',
    title: 'Visibility supported by technology',
    description:
      'GPS, geo-fencing, QR checkpoints and digital records can be incorporated into the agreed operating plan.',
  },
  {
    icon: 'LockKeyhole',
    title: 'A clear compliance conversation',
    description:
      'We share corporate registration details and discuss the relevant statutory documentation during your procurement process.',
  },
];
export default function WhyChooseUs() {
  return (
    <div className="why-page">
      <PageHero
        eyebrow="WHY CHOOSE ARRC"
        title={
          <>
            Trust is earned.
            <br />
            Every single day.
          </>
        }
        description="In the attention we give your site. In the people we select. In the responsibilities we take seriously."
        image="workplace.jpeg"
        imageAlt="A welcoming and carefully maintained workplace"
      />
      <section className="section">
        <div className="container">
          <p className="eyebrow">OUR COMMITMENT TO YOU</p>
          <h2>
            Thoughtful service.
            <br />
            Practical reasons to choose us.
          </h2>
          <div className="why-page__features">
            {features.map((feature, index) => (
              <article key={feature.title}>
                <div>
                  <Icon name={feature.icon} size={28} />
                  <span>0{index + 1}</span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section surface">
        <div className="container grid-2 why-page__survey">
          <div>
            <p className="eyebrow">START WITH THE RIGHT QUESTIONS</p>
            <h2>
              A site survey.
              <br />A better starting point.
            </h2>
          </div>
          <div>
            <p>
              We offer a free site survey and input from a security professional. It helps establish
              what your premises need before discussing a deployment and quotation.
            </p>
            <ul className="check-list">
              <li>
                <Icon name="Check" size={18} />
                Understand the site and its operating requirements
              </li>
              <li>
                <Icon name="Check" size={18} />
                Identify practical security and support priorities
              </li>
              <li>
                <Icon name="Check" size={18} />
                Discuss a service plan and budget that fit
              </li>
            </ul>
            <Button to="/request-quote">Enquire about a site survey</Button>
          </div>
        </div>
      </section>
      <ContactCTA />
    </div>
  );
}
