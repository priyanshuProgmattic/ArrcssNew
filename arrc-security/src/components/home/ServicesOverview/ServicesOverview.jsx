import { Link } from 'react-router-dom';
import { services } from '../../../data/services';
import ServiceCard from '../../services/ServiceCard/ServiceCard';
import Icon from '../../common/Icon/Icon';
import './ServicesOverview.css';
export default function ServicesOverview() {
  return (
    <section className="section surface services-overview">
      <div className="container">
        <div className="section-top">
          <div>
            <p className="eyebrow">WHAT WE DO</p>
            <h2>
              Complete peace of mind.
              <br />
              One trusted partner.
            </h2>
          </div>
          <Link to="/services" className="text-link">
            View all services
            <Icon name="ArrowUpRight" size={17} />
          </Link>
        </div>
        <div className="services-overview__grid">
          {[services[0], services[2], services[3], services[4], services[5], services[6]].map(
            (service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} />
            ),
          )}
        </div>
        <div className="services-overview__note">
          <span>Different needs. One connected approach.</span>
          <Link to="/request-quote">
            Let's find the right solution for you
            <Icon name="ArrowRight" size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
