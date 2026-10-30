import { Component } from 'react';
import './ErrorBoundary.css';
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <div className="error-boundary">
          <p className="eyebrow">LET'S TRY THAT AGAIN</p>
          <h1>This page couldn't load.</h1>
          <p>Please refresh the page to try again.</p>
          <button className="button button--primary" onClick={() => window.location.reload()}>
            Refresh page
          </button>
        </div>
      );
    return this.props.children;
  }
}
