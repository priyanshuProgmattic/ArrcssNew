import ResponsiveImage from '../../common/ResponsiveImage/ResponsiveImage';
import { Link } from 'react-router-dom';
import { industries } from '../../../data/industries';
import Icon from '../../common/Icon/Icon';
import './IndustriesOverview.css';
export default function IndustriesOverview() {
  return (
    <section className="section surface industries-overview">
      <div className="container">
        <div className="section-top">
          <div>
            <p className="eyebrow">WHERE WE MAKE A DIFFERENCE</p>
            <h2>
              Different environments.
              <br />
              The same commitment.
            </h2>
          </div>
          <Link to="/industries" className="text-link">
            Explore all industries
            <Icon name="ArrowUpRight" size={17} />
          </Link>
        </div>
        <div className="industries-overview__grid">
          {[industries[0], industries[4], industries[2]].map((industry, index) => (
            <Link
              className="industry-preview"
              key={industry.slug}
              to={`/industries#${industry.slug}`}
            >
              <ResponsiveImage
                src={`/assets/images/${industry.image}`}
                alt={
                  index === 0
                    ? 'Glass towers in a commercial business district'
                    : index === 1
                      ? 'Organized warehouse and distribution environment'
                      : 'Contemporary residential property'
                }
                loading="lazy"
                width="600"
                height="600"
              />
              <div className="industry-preview__shade" />
              <span className="industry-preview__number">0{index + 1} / INDUSTRIES</span>
              <div>
                <h3>{industry.title}</h3>
                <Icon name="ArrowUpRight" size={22} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
