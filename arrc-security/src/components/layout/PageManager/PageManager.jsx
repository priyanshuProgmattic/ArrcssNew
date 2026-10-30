import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import usePageMeta from '../../../hooks/usePageMeta';
import './PageManager.css';
export default function PageManager() {
  const location = useLocation();
  usePageMeta();
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    const targetId = decodeURIComponent(location.hash.slice(1));
    const scroll = () => {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'instant', block: 'start' });
        return true;
      }
      return false;
    };
    if (scroll()) return;
    const observer = new MutationObserver(() => {
      if (scroll()) observer.disconnect();
    });
    observer.observe(document.getElementById('main-content'), { childList: true, subtree: true });
    const timeout = setTimeout(() => observer.disconnect(), 4000);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [location.pathname, location.hash]);
  return null;
}
