import { Link } from 'react-router-dom';
import ProcessTimeline from '../../operations/ProcessTimeline/ProcessTimeline';
import Icon from '../../common/Icon/Icon';
import './OperationsOverview.css';
export default function OperationsOverview() {
  return (
    <section className="section surface operations-overview">
      <div className="container">
        <div className="section-top">
          <div>
            <p className="eyebrow">HOW WE WORK</p>
            <h2>
              Thoughtfully planned.
              <br />
              Consistently delivered.
            </h2>
          </div>
          <Link to="/operations" className="text-link">
            Our operations approach
            <Icon name="ArrowUpRight" size={17} />
          </Link>
        </div>
        <ProcessTimeline />
      </div>
    </section>
  );
}
