import ResponsiveImage from '../../components/common/ResponsiveImage/ResponsiveImage';
import { useState } from 'react';
import { services } from '../../data/services';
import PageHero from '../../components/common/PageHero/PageHero';
import ServiceCard from '../../components/services/ServiceCard/ServiceCard';
import ContactCTA from '../../components/common/ContactCTA/ContactCTA';
import Button from '../../components/common/Button/Button';
import './Services.css';
export default function Services() {
  const [filter, setFilter] = useState('All services');
  const categories = ['All services', ...new Set(services.map((item) => item.category))];
  const visible =
    filter === 'All services' ? services : services.filter((item) => item.category === filter);
  return (
    <div className="services-page">
      <PageHero
        eyebrow="OUR SERVICES"
        title={
          <>
            Every need.
            <br />A considered solution.
          </>
        }
        description="Security, facility management and manpower services, connected around one purpose: helping your business run with confidence."
      />
      <section className="section">
        <div className="container">
          <div className="service-filters" role="group" aria-label="Filter services">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={filter === category ? 'active' : ''}
                aria-pressed={filter === category}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <p className="service-count" aria-live="polite">
            {visible.length} {visible.length === 1 ? 'service' : 'services'} to support your
            operations
          </p>
          <div className="services-directory">
            {visible.map((service) => (
              <ServiceCard key={service.slug} service={service} index={services.indexOf(service)} />
            ))}
          </div>
        </div>
      </section>
      <section className="section surface">
        <div className="container grid-2 services-integrated">
          <ResponsiveImage
            src="/assets/images/workplace.jpeg"
            alt="Security personnel participating in a supervised site briefing"
            loading="lazy"
            width="700"
            height="500"
          />
          <div>
            <p className="eyebrow">BETTER, TOGETHER</p>
            <h2>
              One roof.
              <br />
              Fewer moving parts.
            </h2>
            <p>
              When security, housekeeping and support personnel work within one coordinated service
              arrangement, day-to-day management becomes simpler. We help you define the right
              combination for your site.
            </p>
            <Button to="/request-quote">Discuss an integrated solution</Button>
          </div>
        </div>
      </section>
      <ContactCTA />
    </div>
  );
}
