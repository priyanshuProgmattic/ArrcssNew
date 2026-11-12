import { Link } from 'react-router-dom';
import TechnologyPhotos from '../../common/TechnologyPhotos/TechnologyPhotos';
import Icon from '../../common/Icon/Icon';
import './TechnologyOverview.css';
export default function TechnologyOverview() {
  return (
    <section className="section technology-overview">
      <div className="container technology-overview__grid">
        <div>
          <p className="eyebrow">PEOPLE, POWERED BY TECHNOLOGY</p>
          <h2>
            Smarter security.
            <br />
            Greater accountability.
          </h2>
          <p className="lead">
            The confidence of knowing.
            <br />
            The clarity of staying connected.
          </p>
          <p>
            We bring a digital layer to physical security, connecting on-site activity with
            practical tools for monitoring, verification and reporting.
          </p>
          <div className="technology-overview__tags">
            <span>
              <Icon name="MapPinned" size={14} />
              GPS & geo-fencing
            </span>
            <span>
              <Icon name="QrCode" size={14} />
              QR patrol verification
            </span>
            <span>
              <Icon name="Fingerprint" size={14} />
              Digital attendance
            </span>
          </div>
          <Link to="/technology" className="text-link">
            Explore our technology
            <Icon name="ArrowUpRight" size={17} />
          </Link>
        </div>
        <TechnologyPhotos />
      </div>
    </section>
  );
}
