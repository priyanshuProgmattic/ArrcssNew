import ResponsiveImage from '../../common/ResponsiveImage/ResponsiveImage';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { navigation } from '../../../data/navigation';
import { services } from '../../../data/services';
import { operations } from '../../../data/operations';
import { company } from '../../../data/company';
import Icon from '../../common/Icon/Icon';
import Button from '../../common/Button/Button';
import './Header.css';
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    setMobileOpen(false);
    setActiveMenu(null);
  }, [location]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const close = (event) => {
      if (event.key !== 'Escape') return;
      if (event.target.closest?.('dialog[open]')) return;
      const trigger = event.target.closest?.('.has-menu')?.querySelector('.nav-menu-toggle');
      setActiveMenu(null);
      if (trigger) trigger.focus();
      else {
        setMobileOpen(false);
        headerRef.current?.querySelector('.mobile-toggle')?.focus();
      }
    };
    const outside = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setActiveMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', outside);
    return () => {
      document.removeEventListener('keydown', close);
      document.removeEventListener('pointerdown', outside);
    };
  }, []);

  return (
    <header ref={headerRef} className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="utility-bar">
        <div className="container utility-bar__inner">
          <span className="utility-heritage">
            <Icon name="ShieldCheck" size={14} />
            Security beyond guarding.
          </span>
          <div>
            <a href={`mailto:${company.email}`}>
              <Icon name="Mail" size={13} />
              {company.email}
            </a>
            <a href={`tel:${company.salesTel}`}>
              <Icon name="Phone" size={13} />
              {company.salesPhone}
              <Icon name="ArrowUpRight" size={12} />
            </a>
          </div>
        </div>
      </div>
      <div className="container header-main">
        <Link to="/" className="brand" aria-label="ARRC Security Solutions home">
          <ResponsiveImage src="/assets/logo/arrc-logo.png" alt="ARRC" width="152" height="60" />
          <span className="brand-descriptor">SECURITY SOLUTIONS</span>
        </Link>
        <button
          className={`mobile-toggle ${mobileOpen ? 'is-open' : ''}`}
          type="button"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
          aria-controls="main-navigation"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className="mobile-toggle__label">{mobileOpen ? 'Close' : 'Menu'}</span>
          <Icon name={mobileOpen ? 'X' : 'Menu'} size={21} />
        </button>
        <nav
          id="main-navigation"
          className={`main-navigation ${mobileOpen ? 'is-open' : ''}`}
          aria-label="Main navigation"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setActiveMenu(null);
              if (event.relatedTarget && !headerRef.current?.contains(event.relatedTarget))
                setMobileOpen(false);
            }
          }}
        >
          <div className="mobile-nav-intro">
            <span>SECURITY. FACILITIES. PEOPLE.</span>
            <p>Explore ARRC.</p>
          </div>
          <ul>
            {navigation.map((item) => (
              <li
                key={item.path}
                className={`nav-item ${item.menu ? 'has-menu' : ''} ${activeMenu === item.menu && item.menu ? 'is-expanded' : ''}`}
              >
                <div className="nav-item__label">
                  <NavLink to={item.path} end={item.path === '/'}>
                    {item.title}
                  </NavLink>
                  {item.menu && (
                    <button
                      className="nav-menu-toggle"
                      type="button"
                      aria-label={`${activeMenu === item.menu ? 'Close' : 'Open'} ${item.title} menu`}
                      aria-expanded={activeMenu === item.menu}
                      aria-controls={`menu-${item.menu}`}
                      onClick={() => setActiveMenu(activeMenu === item.menu ? null : item.menu)}
                    >
                      <Icon name="ChevronDown" size={13} />
                    </button>
                  )}
                </div>
                {item.menu && activeMenu === item.menu && (
                  <div
                    id={`menu-${item.menu}`}
                    className={`nav-dropdown nav-dropdown--${item.menu}`}
                  >
                    <div className="nav-dropdown__feature">
                      <span className="nav-dropdown__eyebrow">
                        {item.menu === 'services' ? 'THE COMPLETE CIRCLE' : 'THE ARRC APPROACH'}
                      </span>
                      <Icon name={item.menu === 'services' ? 'Layers3' : 'ShieldCheck'} size={39} />
                      <h2>
                        {item.menu === 'services' ? (
                          <>
                            Different needs.
                            <br />
                            One partner.
                          </>
                        ) : (
                          <>
                            Planned with care.
                            <br />
                            Delivered with purpose.
                          </>
                        )}
                      </h2>
                      <p>
                        {item.menu === 'services'
                          ? 'Security, facilities and people. Working better, together.'
                          : 'From your first site survey to everyday supervision.'}
                      </p>
                      <Link to={item.path}>
                        Discover more
                        <Icon name="ArrowUpRight" size={16} />
                      </Link>
                    </div>
                    <div className="nav-dropdown__content">
                      <div className="nav-dropdown__heading">
                        {item.menu === 'services' ? 'OUR SERVICES' : 'OUR PROCESS'}
                      </div>
                      <div className="nav-dropdown__links">
                        {(item.menu === 'services' ? services : operations).map((entry, index) => (
                          <Link
                            key={entry.slug || entry.label}
                            to={
                              item.menu === 'services'
                                ? `/services/${entry.slug}`
                                : `/operations#step-${index + 1}`
                            }
                          >
                            <span className="nav-dropdown__icon">
                              <Icon name={entry.icon} size={21} />
                            </span>
                            <span>{entry.title}</span>
                            <Icon name="ArrowUpRight" size={14} />
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="nav-dropdown__bottom">
                      <span>Not sure where to start? Let's understand your needs.</span>
                      <Link to="/request-quote">
                        Talk to our team
                        <Icon name="ArrowRight" size={15} />
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <Button className="header-cta" to="/request-quote">
            Get a Quote
          </Button>
          <a className="mobile-phone" href={`tel:${company.salesTel}`}>
            <Icon name="Phone" size={17} />
            <span>
              Let's talk<strong>{company.salesPhone}</strong>
            </span>
            <Icon name="ArrowUpRight" size={20} />
          </a>
        </nav>
      </div>
    </header>
  );
}
