import './TechnologyPhotos.css';

export default function TechnologyPhotos() {
  return (
    <div className="technology-photos">
      <figure className="technology-photos__main">
        <img
          src="/assets/images/img-10.jpeg"
          alt="ARRC security officers stationed at a roadside access point"
          loading="lazy"
          width="1000"
          height="450"
        />
        <figcaption>On-site monitoring &amp; visibility</figcaption>
      </figure>
      <div className="technology-photos__support">
        <figure>
          <img
            src="/assets/images/img3.jpeg"
            alt="Security officers managing records at a site checkpoint"
            loading="lazy"
            width="640"
            height="480"
          />
          <figcaption>Checkpoint records</figcaption>
        </figure>
        <figure>
          <img
            src="/assets/images/img-1.jpeg"
            alt="Uniformed guards monitoring access at a vehicle entrance"
            loading="lazy"
            width="640"
            height="480"
          />
          <figcaption>Access monitoring</figcaption>
        </figure>
      </div>
    </div>
  );
}
