import Icon from '../Icon/Icon';
import './TechnologyPanel.css';
export default function TechnologyPanel() {
  return (
    <div
      className="technology-panel"
      aria-label="Illustrative security monitoring workflow, not live operational data"
    >
      <div className="technology-panel__top">
        <div>
          <span className="technology-panel__brand">
            <Icon name="ShieldCheck" size={18} />
            ARRC<span>CONNECTED SECURITY</span>
          </span>
        </div>
        <span className="technology-panel__demo">CONCEPT VIEW</span>
      </div>
      <div className="technology-panel__map">
        <div className="map-building map-building--one" />
        <div className="map-building map-building--two" />
        <div className="map-building map-building--three" />
        <div className="map-boundary">
          <span>SITE BOUNDARY</span>
        </div>
        <div className="map-path" />
        <span className="map-pin map-pin--one">
          <Icon name="Check" size={12} />
        </span>
        <span className="map-pin map-pin--two">
          <Icon name="Check" size={12} />
        </span>
        <span className="map-pin map-pin--three">
          <Icon name="MapPin" size={16} />
        </span>
        <span className="map-site-label">YOUR SITE. CONNECTED.</span>
        <div className="map-checkpoint">
          <Icon name="QrCode" size={23} />
          <div>
            <strong>Patrol checkpoint</strong>
            <span>Scan. Verify. Record.</span>
          </div>
        </div>
        <span className="map-compass">N ↑</span>
      </div>
      <div className="technology-panel__bottom">
        <span>
          <Icon name="MapPinned" size={17} />
          Location awareness
        </span>
        <span>
          <Icon name="QrCode" size={17} />
          Digital patrols
        </span>
        <span>
          <Icon name="ChartNoAxesCombined" size={17} />
          Clearer reporting
        </span>
      </div>
      <p className="technology-panel__caption">
        Illustrative workflow. Tools and reporting are agreed for each site.
      </p>
    </div>
  );
}
