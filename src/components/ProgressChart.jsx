import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// REGISTER ONLY WHAT YOU IMPORTED
// Removed CategoryScale, LinearScale, and BarElement as they aren't needed for Doughnuts
ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProgressChart({ value = 0, label = "Module Progress" }) {
  // Final safety check: if value is somehow NaN, default to 0
  const displayValue = isNaN(value) ? 0 : value;

  const data = {
    labels: [label, 'Remaining'],
    datasets: [
      {
        data: [displayValue, 100 - displayValue],
        backgroundColor: ['#0b6a6f', '#e2e8f0'], 
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ position: 'relative', height: '150px', width: '150px' }}>
      <Doughnut data={data} options={options} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#00173d' }}>
          {displayValue}%
        </span>
      </div>
    </div>
  );
}