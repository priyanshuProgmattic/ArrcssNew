import { BrowserRouter } from 'react-router-dom';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import PageManager from './components/layout/PageManager/PageManager';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';
import './App.css';
export default function App() {
  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <PageManager />
      <Header />
      <main id="main-content" tabIndex="-1">
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
