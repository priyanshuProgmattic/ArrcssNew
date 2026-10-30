import ResponsiveImage from '../../common/ResponsiveImage/ResponsiveImage';
import { Link } from 'react-router-dom';
import Icon from '../../common/Icon/Icon';
import './Introduction.css';
export default function Introduction() {
  return (
    <section id="our-approach" className="section introduction">
      <div className="container introduction__grid">
        <div className="introduction__visual">
          <ResponsiveImage
            src="/assets/images/workplace.jpg"
            alt="A light-filled, thoughtfully maintained modern workplace"
            loading="lazy"
            width="700"
            height="700"
          />
          <div className="introduction__heritage">
            <span>ROOTED IN EXPERIENCE</span>
            <strong>
              1991<span>ARC GROUP HERITAGE</span>
            </strong>
            <div>
              Built on a legacy.
              <br />
              Focused on what's next.
            </div>
          </div>
          <span className="introduction__image-note">
            BETTER ENVIRONMENTS BEGIN WITH BETTER CARE.
          </span>
        </div>
        <div className="introduction__copy">
          <p className="eyebrow">THE ARRC APPROACH</p>
          <h2>
            Protection built on trust.
            <br />
            <span>Service built around you.</span>
          </h2>
          <p className="lead">Your business deserves a partner who sees the bigger picture.</p>
          <p>
            At ARRC, we bring security, facility management and manpower together, so you can focus
            on what you do best. From the people at your entrance to the care of your workplace,
            every detail matters.
          </p>
          <p>
            Under the umbrella of ARC since 1991, ARRC Security Solutions Private Limited was
            incorporated in June 2024, carrying forward a client-first approach to integrated
            services.
          </p>
          <div className="introduction__values">
            <span>
              <Icon name="Check" size={15} />
              Client-first thinking
            </span>
            <span>
              <Icon name="Check" size={15} />
              Site-specific solutions
            </span>
            <span>
              <Icon name="Check" size={15} />
              Professional people
            </span>
            <span>
              <Icon name="Check" size={15} />
              Connected services
            </span>
          </div>
          <Link to="/about-us" className="text-link">
            Discover our story
            <Icon name="ArrowUpRight" size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
