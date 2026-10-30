import { useState } from 'react';
import { company } from '../../../data/company';
import Icon from '../Icon/Icon';
import './OfficeLocations.css';
export default function OfficeLocations() {
  const [active, setActive] = useState(1);
  const [loadMap, setLoadMap] = useState(false);
  const office = company.offices[active];
  return (
    <section className="section surface office-locations">
      <div className="container">
        <div className="section-top">
          <div>
            <p className="eyebrow">CLOSER TO YOUR BUSINESS</p>
            <h2>Find your ARRC team.</h2>
          </div>
          <p className="office-locations__intro">Delhi · Gurugram · Noida</p>
        </div>
        <div className="office-locations__grid">
          <div className="office-locations__list" role="group" aria-label="Choose an office">
            {company.offices.map((item, index) => (
              <button
                type="button"
                key={item.name}
                aria-pressed={active === index}
                className={active === index ? 'active' : ''}
                onClick={() => {
                  setActive(index);
                  setLoadMap(false);
                }}
              >
                <Icon name="MapPin" size={23} />
                <div>
                  <span>{item.label}</span>
                  <h3>{item.name}</h3>
                  <p>{item.address}</p>
                </div>
                <Icon name="ArrowUpRight" size={18} />
              </button>
            ))}
          </div>
          <div className="office-map">
            {loadMap ? (
              <iframe
                title={`Map of ARRC ${office.name} office`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(office.query)}&output=embed`}
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="office-map__placeholder">
                <span className="office-map__pin">
                  <Icon name="MapPin" size={33} />
                </span>
                <p className="eyebrow">{office.label}</p>
                <h3>ARRC {office.name}</h3>
                <p>{office.address}</p>
                <button type="button" onClick={() => setLoadMap(true)}>
                  Load interactive map
                  <Icon name="ArrowUpRight" size={15} />
                </button>
                <span>Loads Google Maps, a third-party service.</span>
              </div>
            )}
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
