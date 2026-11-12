import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../common/Icon/Icon';
import './WorkShowcase.css';

const womenPhotos = [
  ['Women-security1.jpeg', 'Women security personnel assembled in uniform'],
  ['Women-security-2.jpeg', 'A woman security officer assisting at an office entrance'],
  ['Women-security-3.jpeg', 'A woman security officer managing an office reception desk'],
  ['Women-security-4.jpeg', 'ARRC women security personnel in professional uniforms'],
];
const glimpses = [
  ['corporate-building.jpeg', 'Prepared for the day', 'Team briefings'],
  ['img-1.jpeg', 'A reassuring presence', 'Entrance security'],
  ['img3.jpeg', 'Every visitor accounted for', 'Reception duties'],
  ['img-5.jpeg', 'Care at every interaction', 'Office screening'],
  ['img-7.jpeg', 'Professional. Approachable. Ready.', 'Our people'],
  ['img-10.jpeg', 'On duty, on the ground', 'Site security'],
  ['img-13.jpeg', 'Protection beyond the entrance', 'Outdoor deployment'],
  ['img-14.jpeg', 'A watchful welcome', 'Building security'],
  ['img-15.jpeg', 'Present when it matters', 'Event deployment'],
  ['security-lobby.jpeg', 'One team. A shared commitment.', 'Our security teams'],
  ['team.jpeg', 'People behind the service', 'Site teams'],
  ['warehouse.jpeg', 'Readiness starts together', 'Duty briefings'],
  ['residential.jpeg', 'Supporting everyday spaces', 'On-site service'],
  ['workplace.jpeg', 'Preparation in practice', 'Team supervision'],
];

export function SpecialistSecurity() {
  return (
    <div className="specialist-security">
      <section className="section office-security" aria-labelledby="office-security-title">
        <div className="container office-security__grid">
          <div className="office-security__visual">
            <img
              src="/assets/images/Pso-image.jpeg"
              alt="Security personnel accompanying guests during an event"
              loading="lazy"
              width="1000"
              height="650"
            />
            <span className="work-photo-label">PERSONAL PROTECTION · ON-GROUND PRESENCE</span>
          </div>
          <div className="specialist-copy">
            <p className="eyebrow">TRUSTED WITH RESPONSIBILITY</p>
            <h2 id="office-security-title">
              PMO &amp; PSO
              <br />
              <span>office security.</span>
            </h2>
            <p>
              Professional protection for environments where discretion, preparedness and attention
              to detail matter every day.
            </p>
            <p>
              Our security work includes PMO and PSO offices, bringing a disciplined presence to
              office premises and personal protection assignments.
            </p>
            <div className="specialist-tags">
              <span>Office security</span>
              <span>Personal protection</span>
              <span>Visitor coordination</span>
            </div>
            <Link className="text-link" to="/request-quote">
              Discuss your security needs <Icon name="ArrowUpRight" size={18} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section women-security" aria-labelledby="women-security-title">
        <div className="container women-security__grid">
          <div className="specialist-copy">
            <p className="eyebrow">CONFIDENCE. CARE. CAPABILITY.</p>
            <h2 id="women-security-title">
              Women in security.
              <br />
              <span>Strength in every role.</span>
            </h2>
            <p>
              Meet the women who bring professionalism and a reassuring presence to our security
              teams.
            </p>
            <p>
              From office reception and visitor assistance to screening and on-site duties, our
              women security personnel help create welcoming, well-managed environments.
            </p>
            <div className="women-security__detail">
              <span>01 /</span>
              <p>
                Thoughtful interactions.
                <br />
                <strong>Focused protection.</strong>
              </p>
            </div>
            <Link className="text-link" to="/request-quote">
              Find the right team for your site <Icon name="ArrowUpRight" size={18} />
            </Link>
          </div>
          <div className="women-security__photos">
            {womenPhotos.map(([file, alt], index) => (
              <figure key={file}>
                <img
                  src={`/assets/images/${file}`}
                  alt={alt}
                  loading="lazy"
                  width="420"
                  height="560"
                />
                <figcaption>
                  <span>0{index + 1}</span>
                  {
                    [
                      'Our women security team',
                      'Visitor assistance',
                      'Office reception',
                      'Professional presence',
                    ][index]
                  }
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function ServiceGlimpses() {
  const track = useRef(null);
  const [active, setActive] = useState(0);
  const move = (direction) => {
    const next = Math.max(0, Math.min(glimpses.length - 1, active + direction));
    track.current.children[next].scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  };
  return (
    <section
      className="section service-glimpses"
      aria-labelledby="glimpses-title"
      aria-roledescription="carousel"
    >
      <div className="container">
        <div className="service-glimpses__heading">
          <div>
            <p className="eyebrow">OUR PEOPLE. OUR WORK.</p>
            <h2 id="glimpses-title">
              Service glimpses.
              <br />
              <span>Commitment, in action.</span>
            </h2>
          </div>
          <div className="service-glimpses__intro">
            <p>
              A closer look at the people, places and everyday moments behind our promise of
              protection.
            </p>
            <div className="glimpse-controls">
              <button
                type="button"
                aria-label="Previous service photo"
                disabled={active === 0}
                onClick={() => move(-1)}
              >
                <Icon name="ArrowLeft" size={21} />
              </button>
              <button
                type="button"
                aria-label="Next service photo"
                disabled={active === glimpses.length - 1}
                onClick={() => move(1)}
              >
                <Icon name="ArrowRight" size={21} />
              </button>
            </div>
          </div>
        </div>
        <div
          className="glimpse-track"
          ref={track}
          tabIndex={0}
          aria-label="Service photos. Scroll horizontally to explore."
          onScroll={() => {
            const element = track.current;
            const closest = Array.from(element.children).reduce(
              (best, child, index) =>
                Math.abs(child.offsetLeft - element.offsetLeft - element.scrollLeft) < best.distance
                  ? {
                      index,
                      distance: Math.abs(
                        child.offsetLeft - element.offsetLeft - element.scrollLeft,
                      ),
                    }
                  : best,
              { index: 0, distance: Infinity },
            );
            setActive(closest.index);
          }}
        >
          {glimpses.map(([file, title, category], index) => (
            <figure
              className="glimpse-card"
              key={file}
              aria-label={`${index + 1} of ${glimpses.length}`}
            >
              <div className="glimpse-card__image">
                <img
                  src={`/assets/images/${file}`}
                  alt={`${category}: ${title}`}
                  loading="lazy"
                  width="700"
                  height="520"
                />
                <span>{category}</span>
              </div>
              <figcaption>
                <h3>{title}</h3>
                <span>{String(index + 1).padStart(2, '0')}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="glimpse-footer">
          <span>REAL PEOPLE. EVERYDAY COMMITMENT.</span>
          <div
            className="glimpse-progress"
            role="progressbar"
            aria-label="Gallery position"
            aria-valuemin={1}
            aria-valuemax={glimpses.length}
            aria-valuenow={active + 1}
          >
            <span style={{ width: `${((active + 1) / glimpses.length) * 100}%` }} />
          </div>
          <span>
            {String(active + 1).padStart(2, '0')} / {glimpses.length}
          </span>
        </div>
      </div>
    </section>
  );
}
