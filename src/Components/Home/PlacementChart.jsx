import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);


const PlacementChart = () => {
  const data = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Placement Rate",
        data: [80, 85, 90, 92],
        fill: false,
        borderColor: "#ff7f50",
        tension: 0.1,
        pointRadius: 5,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Placement Success Rate</h3>
      <div className="bg-gray-50 p-4 rounded-lg shadow-md h-64">
        <Line data={data} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default PlacementChart;
