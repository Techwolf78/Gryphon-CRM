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


const SalesChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Sales Growth",
        data: [10, 25, 40, 60, 80, 100, 120],
        fill: false,
        borderColor: "#008370",
        tension: 0.1,
        pointRadius: 5,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Sales Growth</h3>
      <div className="bg-gray-50 p-4 rounded-lg shadow-md h-64">
        <Line data={data} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default SalesChart;
