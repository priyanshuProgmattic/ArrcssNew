import { Link, useParams } from 'react-router-dom';
import { services } from '../../data/services';
import { operations } from '../../data/operations';
import PageHero from '../../components/common/PageHero/PageHero';
import Button from '../../components/common/Button/Button';
import Icon from '../../components/common/Icon/Icon';
import ServiceCard from '../../components/services/ServiceCard/ServiceCard';
import ContactCTA from '../../components/common/ContactCTA/ContactCTA';
import NotFound from '../NotFound/NotFound';
import './ServiceDetail.css';
export default function ServiceDetail() {
  const { slug } = useParams();
  const service = services.find((item) => item.slug === slug);
  if (!service) return <NotFound />;
  return (
    <div className="service-detail">
      <PageHero
        eyebrow={service.title}
        title={service.title}
        description={service.description}
        image={service.image}
        imageAlt={service.imageAlt}
        imagePosition={service.imagePosition}
        imageAspectRatio={slug === 'smart-security' ? '4 / 3' : undefined}
      />
      <section className="section">
        <div className="container service-detail__layout">
          <div>
            <p className="eyebrow">PLANNED AROUND YOU</p>
            <h2>
              The right support.
              <br />
              Where it matters.
            </h2>
            <p className="service-detail__intro">{service.introduction}</p>
            <div className="service-detail__gallery" aria-label={`${service.title} photos`}>
              {service.gallery.map((photo) => (
                <figure key={photo.image}>
                  <img
                    src={`/assets/images/${photo.image}`}
                    alt={photo.alt}
                    loading="lazy"
                    width="640"
                    height="480"
                  />
                  <figcaption>{photo.alt}</figcaption>
                </figure>
              ))}
            </div>
            <h3 className="service-detail__subheading">What the service can include</h3>
            <ul className="service-detail__capabilities">
              {service.capabilities.map((item) => (
                <li key={item}>
                  <Icon name="Check" size={17} />
                  {item}
                </li>
              ))}
            </ul>
            <h3 className="service-detail__subheading">Why this approach works</h3>
            <div className="service-detail__benefits">
              {service.benefits.map((item, index) => (
                <div key={item}>
                  <span>0{index + 1}</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <aside className="service-detail__aside">
            <div className="service-detail__contact">
              <Icon name={service.icon} size={34} />
              <h3>
                Let's talk about
                <br />
                your requirements.
              </h3>
              <p>
                Every site is different. Tell us what you need and we can shape a plan together.
              </p>
              <Button to={`/request-quote?service=${service.slug}`}>Request a quote</Button>
              <Link to="/contact-us" className="text-link">
                Speak with our team
                <Icon name="ArrowRight" size={15} />
              </Link>
            </div>
            <div className="service-detail__industries">
              <h3>Suitable environments</h3>
              {service.applications.map((item) => (
                <span key={item}>
                  <Icon name="Building2" size={15} />
                  {item}
                </span>
              ))}
              <Link className="text-link" to="/industries">
                Explore industries
                <Icon name="ArrowUpRight" size={15} />
              </Link>
            </div>
          </aside>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <p className="eyebrow">CONNECTED SERVICES</p>
          <h2>Build a more complete solution.</h2>
          <div className="service-detail__related">
            {services
              .filter((item) => item.slug !== slug)
              .slice(0, 3)
              .map((item, index) => (
                <ServiceCard key={item.slug} service={item} index={index} />
              ))}
          </div>
        </div>
      </section>
      <section className="section surface">
        <div className="container">
          <p className="eyebrow">FROM PLANNING TO PRACTICE</p>
          <h2>A clear path to deployment.</h2>
          <div className="service-detail__process">
            {[operations[0], operations[1], operations[2], operations[4]].map((item, index) => (
              <article key={item.label}>
                <span>0{index + 1}</span>
                <h3>{item.label}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
          <Link to="/operations" className="text-link">
            See our full operations process
            <Icon name="ArrowRight" size={17} />
          </Link>
        </div>
      </section>
      <ContactCTA />
    </div>
  );
}
