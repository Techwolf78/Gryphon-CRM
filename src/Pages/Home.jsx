import React from "react";
import WelcomeSection from "../Components/Home/WelcomeSection";
import QuickStats from "../Components/Home/QuickStats";
import NavigationCards from "../Components/Home/NavigationCards";
import PlatformInsights from "../Components/Home/PlatformInsights";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <WelcomeSection />
      <QuickStats />
      <NavigationCards />
      <PlatformInsights />
    </div>
  );
};

export default Home;
