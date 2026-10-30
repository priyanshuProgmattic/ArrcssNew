import { useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { careers, careerCategories } from '../../data/careers';
import ResponsiveImage from '../../components/common/ResponsiveImage/ResponsiveImage';
import ApplicationForm from '../../components/forms/ApplicationForm/ApplicationForm';
import Button from '../../components/common/Button/Button';
import Icon from '../../components/common/Icon/Icon';
import './Careers.css';

export default function Careers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const applicationRef = useRef(null);
  const category =
    careerCategories.find((team) => team.id === searchParams.get('team')) || careerCategories[0];

  function selectTeam(id, scroll = false) {
    setSearchParams({ team: id }, { preventScrollReset: true });
    if (scroll)
      requestAnimationFrame(() =>
        applicationRef.current?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'instant'
            : 'smooth',
          block: 'start',
        }),
      );
  }

  return (
    <div className="careers-page">
      <section className="careers-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <Icon name="ArrowRight" size={12} />
            <span>Careers</span>
          </nav>
          <div className="careers-hero__grid">
            <div className="careers-hero__copy">
              <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
              <h1>
                People with purpose.
                <br />
                <span>A team that cares.</span>
              </h1>
              <p>{careers.introduction}</p>
              <Button href="#career-opportunities">Find your place at ARRC</Button>
              <span className="careers-hero__note">
                <Icon name="UsersRound" size={16} />
                On-site teams. Office teams. One shared commitment.
              </span>
            </div>
            <div className="careers-hero__visual">
              <ResponsiveImage
                src="/assets/images/team.jpg"
                alt="Professionals working together as a team"
                width="800"
                height="1200"
                fetchPriority="high"
              />
              <span className="careers-hero__image-label">TOGETHER, WE MAKE THE DIFFERENCE.</span>
              <div className="careers-hero__card">
                <span>
                  <Icon name="ShieldCheck" size={28} />
                </span>
                <div>
                  <strong>Every role matters.</strong>
                  <p>Bring your skills. Build your next chapter.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="careers-values">
        <div className="container careers-values__grid">
          {[
            {
              icon: 'ShieldCheck',
              title: 'Work with purpose',
              text: 'Contribute to safer, better supported environments.',
            },
            {
              icon: 'GraduationCap',
              title: 'Bring a willingness to learn',
              text: 'Preparation, professional conduct and site-specific skills matter.',
            },
            {
              icon: 'UsersRound',
              title: 'Be part of a connected team',
              text: 'On-site and support teams work towards a shared goal.',
            },
          ].map((value) => (
            <div key={value.title}>
              <Icon name={value.icon} size={27} />
              <div>
                <h2>{value.title}</h2>
                <p>{value.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="section" id="career-opportunities">
        <div className="container">
          <div className="section-top">
            <div>
              <p className="eyebrow">TWO PATHS. ONE TEAM.</p>
              <h2>Find where you belong.</h2>
            </div>
            <p className="careers-section-note">
              Choose the kind of work that suits
              <br />
              your skills and experience.
            </p>
          </div>
          <div className="career-categories">
            {careerCategories.map((team, index) => (
              <article className={`career-category career-category--${team.id}`} key={team.id}>
                <div className="career-category__top">
                  <span className="career-category__icon">
                    <Icon name={team.icon} size={30} />
                  </span>
                  <span>0{index + 1} / OUR TEAMS</span>
                </div>
                <p className="career-category__eyebrow">{team.eyebrow}</p>
                <h3>{team.title}</h3>
                <p>{team.description}</p>
                <div className="career-category__roles">
                  {team.roles.map((role) => (
                    <span key={role}>{role}</span>
                  ))}
                </div>
                <Button
                  type="button"
                  onClick={() => selectTeam(team.id, true)}
                  variant={index === 0 ? 'primary' : 'secondary'}
                >
                  Apply for {team.title.toLowerCase()}
                </Button>
              </article>
            ))}
          </div>
          <p className="career-opportunities-note">
            <Icon name="CircleCheck" size={16} />
            {careers.note}
          </p>
        </div>
      </section>
      <section
        className="section surface careers-application"
        id="career-application"
        ref={applicationRef}
      >
        <div className="container careers-application__grid">
          <div className="careers-application__intro">
            <p className="eyebrow">LET'S GET TO KNOW YOU</p>
            <h2>
              A few details.
              <br />A new possibility.
            </h2>
            <p>
              Choose your team, tell us about your experience and share your resume. Our team can
              review your interest against current requirements.
            </p>
            <div className="career-team-switch" role="group" aria-label="Application category">
              {careerCategories.map((team) => (
                <button
                  type="button"
                  key={team.id}
                  aria-pressed={category.id === team.id}
                  className={category.id === team.id ? 'is-active' : ''}
                  onClick={() => selectTeam(team.id)}
                >
                  <Icon name={team.icon} size={19} />
                  {team.title}
                  <Icon name="ArrowRight" size={16} />
                </button>
              ))}
            </div>
            <div className="careers-email">
              <span>
                <Icon name="Mail" size={23} />
              </span>
              <div>
                <p>Prefer to email your resume?</p>
                <a href={`mailto:${careers.email}?subject=Career%20application`}>
                  {careers.email}
                  <Icon name="ArrowUpRight" size={15} />
                </a>
              </div>
            </div>
            <p className="careers-application__footnote">
              Tell us about the role and location you are interested in. Recruitment requirements
              depend on the assignment.
            </p>
          </div>
          <ApplicationForm category={category} />
        </div>
      </section>
      <section className="section careers-process">
        <div className="container">
          <p className="eyebrow">YOUR APPLICATION, STEP BY STEP</p>
          <h2>A clear way to get started.</h2>
          <div className="careers-process__grid">
            {[
              {
                title: 'Choose your team',
                text: 'Select direct or indirect staff and the role that best matches your background.',
              },
              {
                title: 'Share your experience',
                text: 'Add your contact details, relevant experience and a current resume.',
              },
              {
                title: 'Start a conversation',
                text: 'Our team can discuss your profile when a suitable requirement is available.',
              },
            ].map((step, index) => (
              <article key={step.title}>
                <span>0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
