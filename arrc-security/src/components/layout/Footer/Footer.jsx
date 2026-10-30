import ResponsiveImage from '../../common/ResponsiveImage/ResponsiveImage';
import { Link } from 'react-router-dom';
import { company } from '../../../data/company';
import { services } from '../../../data/services';
import Icon from '../../common/Icon/Icon';
import './Footer.css';
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__main">
          <div className="footer__brand">
            <Link to="/" aria-label="ARRC home">
              <ResponsiveImage
                src="/assets/logo/arrc-logo.png"
                alt="ARRC"
                width="130"
                height="51"
              />
            </Link>
            <p>
              Security beyond guarding.
              <br />
              Care beyond expectations.
            </p>
            <span>
              Integrated security, facilities
              <br />
              and manpower solutions.
            </span>
          </div>
          <div className="footer__column">
            <h2>Explore</h2>
            <Link to="/about-us">About ARRC</Link>
            <Link to="/operations">Our operations</Link>
            <Link to="/technology">Technology</Link>
            <Link to="/industries">Industries we serve</Link>
            <Link to="/why-choose-us">Why choose us</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/contact-us">Contact us</Link>
          </div>
          <div className="footer__column">
            <h2>Our services</h2>
            {services.slice(0, 6).map((service) => (
              <Link key={service.slug} to={`/services/${service.slug}`}>
                {service.shortTitle}
              </Link>
            ))}
          </div>
          <div className="footer__contact">
            <h2>Let's talk</h2>
            <a href={`tel:${company.salesTel}`} className="footer__phone">
              {company.salesPhone}
              <Icon name="ArrowUpRight" size={16} />
            </a>
            <a href={`mailto:${company.email}`}>{company.email}</a>
            <p>
              <Icon name="MapPin" size={16} />
              <span>
                202, 2nd Floor, Greenwood Plaza,
                <br />
                Sector 45, Gurugram, Haryana 122001
              </span>
            </p>
            <Link to="/contact-us" className="text-link">
              Find our offices
              <Icon name="ArrowRight" size={15} />
            </Link>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} ARRC Security Solutions Private Limited.</span>
          <span>ARC group heritage since 1991 · ARRC incorporated in 2024</span>
          <Link to="/privacy-policy">Privacy policy</Link>
        </div>
      </div>
    </footer>
  );
}
