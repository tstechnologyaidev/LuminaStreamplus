import './Maintenance.css';

function Maintenance({ onBypass }) {
  return (
    <div className="maintenance-page">
      <div className="maintenance-panel">
        <h1>Maintenance Mode</h1>
        <p>We are currently making improvements to the site. Please check back soon.</p>
        <p className="maintenance-note">If you are an admin, you can bypass this page to continue working.</p>
        <button className="maintenance-btn" onClick={onBypass}>
          Admin bypass
        </button>
      </div>
    </div>
  );
}

export default Maintenance;
