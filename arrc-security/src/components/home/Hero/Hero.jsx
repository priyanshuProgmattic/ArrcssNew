import ResponsiveImage from '../../common/ResponsiveImage/ResponsiveImage';
import { Link } from 'react-router-dom';
import Button from '../../common/Button/Button';
import Icon from '../../common/Icon/Icon';
import './Hero.css';
export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero__grid">
        <div className="hero__copy reveal">
          <p className="eyebrow">A HIGHER STANDARD OF SECURITY</p>
          <h1>
            Security
            <br />
            beyond
            <br />
            <span>guarding.</span>
          </h1>
          <p>
            Protecting your people. Supporting your business.
            <br className="desktop-break" /> Integrated security, facility management and
            <br className="desktop-break" /> manpower solutions, built around you.
          </p>
          <div className="hero__actions">
            <Button to="/services">Explore our services</Button>
            <Link to="/request-quote" className="hero__consult">
              Let's talk
              <Icon name="ArrowUpRight" size={17} />
            </Link>
          </div>
          <div className="hero__promise">
            <Icon name="ShieldCheck" size={16} />
            <span>Professional people. Thoughtful protection.</span>
          </div>
        </div>
        <div className="hero__visual reveal">
          <ResponsiveImage
            className="hero__photo"
            src="/assets/images/corporate-building.jpg"
            alt="Modern glass office towers rising toward an open sky"
            width="1600"
            height="2000"
            fetchPriority="high"
          />
          <div className="hero__image-shade" />
          <span className="hero__vertical">PROTECTING WHAT MATTERS MOST</span>
          <div className="hero__photo-label">
            <span className="hero__photo-label-dot" />A PARTNER IN YOUR PEACE OF MIND
          </div>
          <div className="hero__badge">
            <span className="hero__badge-icon">
              <Icon name="ShieldCheck" size={28} />
            </span>
            <div>
              <strong>Your world. Protected.</strong>
              <span>People · Property · Possibilities</span>
            </div>
            <span className="hero__badge-mark">ARRC</span>
          </div>
          <span className="hero__corner" aria-hidden="true" />
        </div>
      </div>
      <div className="container hero__foot">
        <span className="hero__foot-title">
          A COMPLETE CIRCLE
          <br />
          OF SUPPORT
        </span>
        <div>
          <Icon name="ShieldCheck" size={22} />
          <span>
            Professional
            <br />
            <strong>Security</strong>
          </span>
        </div>
        <div>
          <Icon name="Building2" size={22} />
          <span>
            Integrated
            <br />
            <strong>Facility Management</strong>
          </span>
        </div>
        <div>
          <Icon name="UsersRound" size={22} />
          <span>
            Dependable
            <br />
            <strong>Manpower Solutions</strong>
          </span>
        </div>
        <a href="#our-approach" className="hero__scroll" aria-label="Discover our approach">
          <span>SCROLL TO DISCOVER</span>
          <span>↓</span>
        </a>
      </div>
    </section>
  );
}
