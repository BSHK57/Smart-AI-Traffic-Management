import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import './Analytics.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const Analytics = () => {
  // Mock Data
  const congestionData = {
    labels: ['XYZ Street', 'ABC Highway', 'Main Road', 'Route B'],
    datasets: [{
      label: 'Congestion Level (%)',
      data: [75, 60, 45, 20],
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
    }]
  };

  const violationData = {
    labels: ['Speeding', 'Red-Light Violation', 'Wrong-Way Driving'],
    datasets: [{
      data: [50, 30, 20],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    }]
  };

  const responseTimeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Avg Response Time (min)',
      data: [15, 12, 10, 8, 7],
      borderColor: '#4BC0C0',
      fill: false,
    }]
  };

  const stats = {
    totalAccidents: 45,
    totalViolations: 100,
    reroutedVehicles: 250,
  };

  return (
    <div className="dashboard-container">
      <h1>Smart Traffic & Accident Detection Dashboard</h1>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Accidents</h3>
          <p>{stats.totalAccidents}</p>
        </div>
        <div className="stat-card">
          <h3>Total Violations</h3>
          <p>{stats.totalViolations}</p>
        </div>
        <div className="stat-card">
          <h3>Rerouted Vehicles</h3>
          <p>{stats.reroutedVehicles}</p>
        </div>
      </div>

      {/* Visualizations */}
      <div className="charts-container">
        {/* Bar Chart: Traffic Congestion */}
        <div className="chart">
          <h2>Traffic Congestion Levels</h2>
          <Bar data={congestionData} options={{ responsive: true }} />
        </div>

        {/* Pie Chart: Violations */}
        <div className="chart">
          <h2>Traffic Violations Breakdown</h2>
          <Pie data={violationData} options={{ responsive: true }} />
        </div>

        {/* Line Chart: Emergency Response */}
        <div className="chart">
          <h2>Emergency Response Time</h2>
          <Line data={responseTimeData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Placeholder for Map */}
      <div className="map-container">
        <h2>Accident Detection Map</h2>
        <p>[Interactive Map Placeholder - Use Google Maps API with markers]</p>
      </div>
    </div>
  );
};

export default Analytics;