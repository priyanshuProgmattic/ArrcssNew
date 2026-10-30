import Button from '../../components/common/Button/Button';
import './NotFound.css';
export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container">
        <span className="not-found__number">404</span>
        <p className="eyebrow">A WRONG TURN. A SIMPLE WAY BACK.</p>
        <h1>
          Let's get you
          <br />
          back on track.
        </h1>
        <p>
          The page you're looking for isn't available.
          <br />
          Explore our services or return to our homepage.
        </p>
        <div>
          <Button to="/" icon="ArrowLeft">
            Back to home
          </Button>
          <Button to="/services" variant="secondary">
            Explore services
          </Button>
        </div>
      </div>
    </section>
  );
}
