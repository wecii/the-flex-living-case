import React, { useEffect, useState } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/stats`);
    const data = await res.json();
    setInsights(data);
  };

  const integrateHostawayData = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/integration/hostaway`);
    const data = await res.json();
    if(data.imported > 0) {
      alert(`${data.imported} new reviews imported.`);
    } else {
      console.log("No new reviews imported.");
    }
  };

  return (
    <div className="dashboard-page">
      <h2>Dashboard</h2>
      <button style={{
        marginTop: 16, padding: '8px 12px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', marginBottom: 20
      }} className="integrate-button" onClick={integrateHostawayData}>Integrate Hostaway Data</button>
      <div className="insights-section">
        <h3>Insights</h3>
        {!insights ? (
          <p>No insights available.</p>
        ) : (
          <ul>
            <li><strong>Total Reviews:</strong> {insights.totalReviews}</li>
            <li><strong>Approved Reviews:</strong> {insights.approvedReviews}</li>
            <li><strong>Property Count:</strong> {insights.propertyCount}</li>
            <li><strong>Average Reviews Per Property:</strong> {insights.avgReviewsPerProperty}</li>
            <li><strong>Average Rating:</strong> {insights.avgRating}</li>
            <li><strong>Average Cleanliness:</strong> {insights.avgCleanliness}</li>
            <li><strong>Average Communication:</strong> {insights.avgCommunication}</li>
            <li><strong>Average Respect House Rules:</strong> {insights.avgRespect}</li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
