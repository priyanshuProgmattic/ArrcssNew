import { Link } from 'react-router-dom';
import Icon from '../../common/Icon/Icon';
import './ServiceCard.css';
export default function ServiceCard({ service, index = 0 }) {
  return (
    <Link className="service-card" to={`/services/${service.slug}`}>
      <div className="service-card__photo">
        <img
          src={`/assets/images/${service.image}`}
          alt={service.imageAlt || service.title}
          style={{ objectPosition: service.imagePosition }}
          loading="lazy"
          width="640"
          height="400"
        />
      </div>
      <div className="service-card__top">
        <span className="service-card__icon">
          <Icon name={service.icon} size={27} />
        </span>
        <span className="service-card__number">0{index + 1}</span>
      </div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <span className="service-card__link">
        Explore service
        <Icon name="ArrowUpRight" size={18} />
      </span>
    </Link>
  );
}
