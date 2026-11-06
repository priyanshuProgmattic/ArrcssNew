import ResponsiveImage from '../../components/common/ResponsiveImage/ResponsiveImage';
import { company, commitments } from '../../data/company';
import PageHero from '../../components/common/PageHero/PageHero';
import ContactCTA from '../../components/common/ContactCTA/ContactCTA';
import Icon from '../../components/common/Icon/Icon';
import './About.css';
export default function About() {
  return (
    <div className="about-page">
      <PageHero
        eyebrow="ABOUT ARRC"
        title={
          <>
            A partner who cares
            <br />
            for your world.
          </>
        }
        description="Professional security. Connected services. A client-first approach to the things that matter to your business."
        image="workplace.jpeg"
        imageAlt="A bright and carefully maintained shared workplace"
      />
      <section className="section">
        <div className="container grid-2 about-story">
          <div>
            <p className="eyebrow">OUR STORY</p>
            <h2>
              Rooted in experience.
              <br />
              Built for your future.
            </h2>
            <div className="about-story__dates">
              <div>
                <strong>1991</strong>
                <span>ARC group heritage</span>
              </div>
              <span className="about-story__line" />
              <div>
                <strong>2024</strong>
                <span>ARRC incorporated</span>
              </div>
            </div>
          </div>
          <div className="prose">
            <p>{company.overview}</p>
            <p>
              ARRC operates under the umbrella of ARC, with group heritage dating to 1991. ARRC
              Security Solutions Private Limited was incorporated on {company.incorporated}. These
              are two distinct milestones: the group's heritage and the establishment of the current
              company.
            </p>
            <p>
              From our corporate office in Gurugram, we support corporate, commercial, residential
              and operational environments through services designed around the actual requirements
              of each site.
            </p>
            <p>
              Our philosophy is simple: security goes beyond placing a guard at a gate. It means
              defining responsibilities, preparing people for their duties and staying connected to
              performance on the ground.
            </p>
          </div>
        </div>
      </section>
      <section className="section surface">
        <div className="container about-purpose">
          <article>
            <Icon name="ScanLine" size={29} />
            <p className="eyebrow">OUR VISION</p>
            <h2>
              More space to focus
              <br />
              on your business.
            </h2>
            <p>{company.vision}</p>
          </article>
          <article>
            <Icon name="ShieldCheck" size={29} />
            <p className="eyebrow">OUR MISSION</p>
            <h2>
              Service that responds.
              <br />
              Quality that matters.
            </h2>
            <p>{company.mission}</p>
          </article>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-top">
            <div>
              <p className="eyebrow">WHAT WE STAND FOR</p>
              <h2>Our values, in practice.</h2>
            </div>
            <p className="about-values__intro">
              A commitment is only meaningful when
              <br />
              it shapes the work we do every day.
            </p>
          </div>
          <div className="about-values">
            {[
              {
                icon: 'ShieldCheck',
                title: 'Integrity',
                description:
                  'Clear commitments, professional conduct and respect for the responsibilities entrusted to us.',
              },
              {
                icon: 'ScanLine',
                title: 'Vigilance',
                description:
                  'An attentive presence, supported by regular checks, practical reporting and ongoing training.',
              },
              {
                icon: 'UsersRound',
                title: 'Client first',
                description:
                  'Listening before planning and adapting services to the priorities of your organization.',
              },
              {
                icon: 'Layers3',
                title: 'Accountability',
                description:
                  'Defined duties, active supervision and an open feedback loop with your team.',
              },
            ].map((value) => (
              <article key={value.title}>
                <Icon name={value.icon} size={28} />
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section surface">
        <div className="container grid-2 about-approach">
          <ResponsiveImage
            src="/assets/images/security-lobby.jpeg"
            alt="Security personnel monitoring an office lobby from the reception desk"
            loading="lazy"
            width="700"
            height="800"
          />
          <div>
            <p className="eyebrow">SECURITY BEYOND GUARDING</p>
            <h2>
              Prepared people.
              <br />A considered approach.
            </h2>
            <p className="lead">
              From recruitment to service reviews, the details make the difference.
            </p>
            <ul className="check-list">
              {commitments.map((item) => (
                <li key={item.title}>
                  <Icon name="Check" size={18} />
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2 about-credentials">
          <div>
            <p className="eyebrow">CORPORATE INFORMATION</p>
            <h2>
              A transparent
              <br />
              foundation.
            </h2>
            <p className="lead">
              Our corporate registration details. Speak with our team about the documentation
              relevant to your procurement process.
            </p>
          </div>
          <dl>
            {company.registrations.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <ContactCTA />
    </div>
  );
}
