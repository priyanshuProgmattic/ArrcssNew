import Hero from '../../components/home/Hero/Hero';
import Introduction from '../../components/home/Introduction/Introduction';
import ServicesOverview from '../../components/home/ServicesOverview/ServicesOverview';
import WhyARRC from '../../components/home/WhyARRC/WhyARRC';
import OperationsOverview from '../../components/home/OperationsOverview/OperationsOverview';
import TechnologyOverview from '../../components/home/TechnologyOverview/TechnologyOverview';
import IndustriesOverview from '../../components/home/IndustriesOverview/IndustriesOverview';
import ContactCTA from '../../components/common/ContactCTA/ContactCTA';
import './Home.css';
export default function Home() {
  return (
    <div className="home-page">
      <Hero />
      <Introduction />
      <ServicesOverview />
      <WhyARRC />
      <OperationsOverview />
      <TechnologyOverview />
      <IndustriesOverview />
      <section className="home-commitment">
        <div className="container">
          <IconQuote />
          <p>
            Good security is built on{' '}
            <span>
              integrity, preparation
              <br className="desktop-break" /> and the everyday commitment to care.
            </span>
          </p>
          <span>THE ARRC PHILOSOPHY</span>
        </div>
      </section>
      <ContactCTA />
    </div>
  );
}
function IconQuote() {
  return (
    <span className="home-commitment__mark" aria-hidden="true">
      “
    </span>
  );
}
