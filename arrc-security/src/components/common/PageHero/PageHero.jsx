import ResponsiveImage from '../ResponsiveImage/ResponsiveImage';
import { Link } from 'react-router-dom';
import Icon from '../Icon/Icon';
import './PageHero.css';
export default function PageHero({
  eyebrow,
  title,
  description,
  image = 'corporate-building.jpeg',
  imageAlt = 'Glass facade of a modern commercial building',
}) {
  return (
    <section className="page-hero">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <Icon name="ArrowRight" size={12} />
          <span>{eyebrow}</span>
        </nav>
        <div className="page-hero__grid">
          <div className="page-hero__copy reveal">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            {description && <p className="lead">{description}</p>}
          </div>
          <div className="page-hero__image">
            <ResponsiveImage
              src={`/assets/images/${image}`}
              alt={imageAlt}
              width="700"
              height="460"
            />
            <span className="page-hero__caption">
              <Icon name="ShieldCheck" size={18} /> Security beyond guarding.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
