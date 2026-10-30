import ResponsiveImage from '../../components/common/ResponsiveImage/ResponsiveImage';
import { Link } from 'react-router-dom';
import { industries } from '../../data/industries';
import { services } from '../../data/services';
import PageHero from '../../components/common/PageHero/PageHero';
import ContactCTA from '../../components/common/ContactCTA/ContactCTA';
import Icon from '../../components/common/Icon/Icon';
import './Industries.css';
export default function Industries() {
  return (
    <div className="industries-page">
      <PageHero
        eyebrow="INDUSTRIES WE SERVE"
        title={
          <>
            Your environment.
            <br />
            Our understanding.
          </>
        }
        description="Every environment has its own rhythm, risks and responsibilities. We shape our service around the way yours works."
      />
      <section className="section">
        <div className="container">
          <p className="eyebrow">BUILT AROUND YOUR SECTOR</p>
          <h2>
            A considered response
            <br />
            to different needs.
          </h2>
          <div className="industries-directory">
            {industries.map((industry) => (
              <article className="industry-detail" key={industry.slug} id={industry.slug}>
                <div className="industry-detail__image">
                  <ResponsiveImage
                    src={`/assets/images/${industry.image}`}
                    alt={`An illustrative ${industry.title.toLowerCase()} environment`}
                    loading="lazy"
                    width="700"
                    height="480"
                  />
                  <span>
                    <Icon name={industry.icon} size={23} />
                  </span>
                </div>
                <div className="industry-detail__body">
                  <h3>{industry.title}</h3>
                  <p>{industry.description}</p>
                  <div className="industry-detail__services">
                    {industry.services.map((slug) => {
                      const service = services.find((item) => item.slug === slug);
                      return (
                        <Link key={slug} to={`/services/${slug}`}>
                          {service.shortTitle}
                          <Icon name="ArrowUpRight" size={12} />
                        </Link>
                      );
                    })}
                  </div>
                  <Link className="text-link" to={`/request-quote?industry=${industry.slug}`}>
                    Discuss your requirements
                    <Icon name="ArrowRight" size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ContactCTA />
    </div>
  );
}
