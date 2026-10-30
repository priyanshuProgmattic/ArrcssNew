import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './AppRoutes.css';
const Home = lazy(() => import('../pages/Home/Home'));
const About = lazy(() => import('../pages/About/About'));
const Services = lazy(() => import('../pages/Services/Services'));
const ServiceDetail = lazy(() => import('../pages/ServiceDetail/ServiceDetail'));
const Operations = lazy(() => import('../pages/Operations/Operations'));
const Technology = lazy(() => import('../pages/Technology/Technology'));
const Industries = lazy(() => import('../pages/Industries/Industries'));
const WhyChooseUs = lazy(() => import('../pages/WhyChooseUs/WhyChooseUs'));
const Contact = lazy(() => import('../pages/Contact/Contact'));
const Careers = lazy(() => import('../pages/Careers/Careers'));
const RequestQuote = lazy(() => import('../pages/RequestQuote/RequestQuote'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy/PrivacyPolicy'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));
export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="page-loading" role="status">
          <div className="route-loading">
            <span />
            Loading your page…
          </div>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/operations" element={<Operations />} />
        <Route path="/technology" element={<Technology />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/why-choose-us" element={<WhyChooseUs />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/career" element={<Navigate to="/careers" replace />} />
        <Route path="/request-quote" element={<RequestQuote />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
