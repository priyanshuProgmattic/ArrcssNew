import { Link } from 'react-router-dom';
import { commitments } from '../../../data/company';
import Icon from '../../common/Icon/Icon';
import './WhyARRC.css';
export default function WhyARRC() {
  return (
    <section className="section why-arrc">
      <div className="container why-arrc__grid">
        <div className="why-arrc__intro">
          <p className="eyebrow">THE DIFFERENCE IS IN THE DETAILS</p>
          <h2>
            More than a service.
            <br />A responsibility.
          </h2>
          <p>
            We know what's at stake. That's why our approach starts with listening and continues
            with the everyday discipline of doing things well.
          </p>
          <Link to="/why-choose-us" className="text-link">
            Why partner with ARRC
            <Icon name="ArrowUpRight" size={17} />
          </Link>
          <div className="why-arrc__signature">
            <Icon name="ShieldCheck" size={36} />
            <span>
              CLIENT FIRST.
              <br />
              <strong>At every step.</strong>
            </span>
          </div>
        </div>
        <div className="why-arrc__features">
          {commitments.map((item, index) => (
            <div className="why-arrc__feature" key={item.title}>
              <span className="why-arrc__icon">
                <Icon name={item.icon} size={25} />
              </span>
              <div>
                <span className="why-arrc__number">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
