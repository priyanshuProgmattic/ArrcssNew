import { useState } from 'react';
import { Link } from 'react-router-dom';
import { careers, careerCategories } from '../../data/careers';
import ApplicationModal from '../../components/forms/ApplicationModal/ApplicationModal';
import Button from '../../components/common/Button/Button';
import Icon from '../../components/common/Icon/Icon';
import './Careers.css';

export default function Careers() {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const category = careerCategories.find((team) => team.id === selectedTeam);

  return (
    <div className="careers-page">
      <div className="career-page-bar">
        <div className="container career-page-bar__inner">
          <span>Career</span>
          <nav aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <Icon name="ArrowRight" size={13} />
            <span>Career</span>
          </nav>
        </div>
      </div>

      <section className="career-opportunities">
        <div className="container">
          <div className="careers-intro">
            <h1>Career</h1>
            <p>
              You can also email your resume at{' '}
              <a href={`mailto:${careers.email}?subject=Career%20application`}>{careers.email}</a>.
            </p>
          </div>
          <div className="career-categories">
            {careerCategories.map((team) => (
              <article className="career-category" key={team.id}>
                <p className="career-category__eyebrow">Applying for</p>
                <h2>{team.id === 'direct' ? 'Direct' : 'Indirect Staff'}</h2>
                <p className="career-category__roles">({team.roles.join(' / ')})</p>
                <Button
                  type="button"
                  aria-label={`Apply for ${team.title.toLowerCase()}`}
                  aria-haspopup="dialog"
                  aria-controls="career-application-modal"
                  onClick={() => setSelectedTeam(team.id)}
                  icon={null}
                >
                  Apply
                </Button>
              </article>
            ))}
          </div>
          <p className="career-opportunities-note">{careers.note}</p>
        </div>
      </section>

      {category && (
        <ApplicationModal
          key={category.id}
          category={category}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </div>
  );
}
