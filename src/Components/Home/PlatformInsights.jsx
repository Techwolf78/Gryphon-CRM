import React from "react";
import SalesChart from "./SalesChart";
import PlacementChart from "./PlacementChart";

const PlatformInsights = () => (
  <div className="mt-16">
    <h2 className="text-2xl font-semibold text-gray-800 mb-8">Platform Insights</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <SalesChart />
      <PlacementChart />
    </div>
  </div>
);

export default PlatformInsights;
