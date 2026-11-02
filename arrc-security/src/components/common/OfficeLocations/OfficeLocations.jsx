import { company } from '../../../data/company';
import Icon from '../Icon/Icon';
import './OfficeLocations.css';

export default function OfficeLocations() {
  const office = company.offices[0];
  return (
    <section className="section surface office-locations">
      <div className="container">
        <div className="section-top">
          <div>
            <p className="eyebrow">CLOSER TO YOUR BUSINESS</p>
            <h2>Find your ARRC team.</h2>
          </div>
        </div>
        <div className="office-locations__grid">
          <div className="office-locations__office">
            <Icon name="MapPin" size={26} />
            <div>
              <p className="eyebrow">{office.label}</p>
              <h3>{office.name}</h3>
              <p>{office.address}</p>
              <a href={`tel:${company.salesTel}`}>{company.salesPhone}</a>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </div>
          </div>
          <div className="office-map">
            <iframe
              title="Map of ARC Security corporate office in Gurugram"
              src={office.mapEmbedUrl}
              width="600"
              height="450"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <a
              className="office-map__directions"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.query)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get directions
              <Icon name="ArrowUpRight" size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
