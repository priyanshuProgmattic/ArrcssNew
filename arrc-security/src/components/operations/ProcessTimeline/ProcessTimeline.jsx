import { useState } from 'react';
import { operations } from '../../../data/operations';
import Icon from '../../common/Icon/Icon';
import './ProcessTimeline.css';
export default function ProcessTimeline() {
  const [active, setActive] = useState(0);
  const step = operations[active];
  return (
    <div className="process-timeline">
      <div className="process-timeline__steps" role="tablist" aria-label="Our security process">
        {operations.map((item, index) => (
          <button
            type="button"
            key={item.label}
            id={`process-tab-${index}`}
            role="tab"
            aria-selected={active === index}
            aria-controls={`process-panel-${index}`}
            tabIndex={active === index ? 0 : -1}
            className={active === index ? 'is-active' : ''}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              let next = active;
              if (event.key === 'ArrowRight') next = (active + 1) % operations.length;
              else if (event.key === 'ArrowLeft')
                next = (active - 1 + operations.length) % operations.length;
              else if (event.key === 'Home') next = 0;
              else if (event.key === 'End') next = operations.length - 1;
              else return;
              event.preventDefault();
              setActive(next);
              document.getElementById(`process-tab-${next}`)?.focus();
            }}
          >
            <span>0{index + 1}</span>
            <strong>{item.label}</strong>
          </button>
        ))}
      </div>
      <div
        className="process-timeline__panel"
        role="tabpanel"
        id={`process-panel-${active}`}
        aria-labelledby={`process-tab-${active}`}
        key={active}
      >
        <div className="process-timeline__panel-heading">
          <span className="process-timeline__large-number">0{active + 1}</span>
          <div>
            <p className="eyebrow">A STRUCTURED APPROACH</p>
            <h3>{step.title}</h3>
          </div>
        </div>
        <div className="process-timeline__detail">
          <p>{step.description}</p>
          <ul>
            {step.details.map((detail) => (
              <li key={detail}>
                <Icon name="Check" size={14} />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
