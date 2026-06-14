import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import Lobby from "@/pages/Lobby";
import HallMap from "@/pages/HallMap";
import HallDetail from "@/pages/HallDetail";
import ExhibitDetail from "@/pages/ExhibitDetail";
import GuideTasks from "@/pages/GuideTasks";
import Multiplayer from "@/pages/Multiplayer";
import PhotoShare from "@/pages/PhotoShare";
import Backpack from "@/pages/Backpack";

function AppContent() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage("fadeOut");
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("fadeIn");
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation]);

  const showBottomNav = !location.pathname.startsWith('/exhibit/') && 
                        !location.pathname.startsWith('/hall/');

  const shouldHideNav = location.pathname.startsWith('/exhibit/') || 
                        location.pathname.startsWith('/hall/') ||
                        location.pathname === '/camera';

  return (
    <div className="min-h-screen bg-space-dark text-text-primary">
      <div 
        className={`transition-opacity duration-150 ${
          transitionStage === "fadeIn" ? "opacity-100" : "opacity-0"
        }`}
      >
        <Routes location={displayLocation}>
          <Route path="/" element={<Lobby />} />
          <Route path="/map" element={<HallMap />} />
          <Route path="/hall/:hallId" element={<HallDetail />} />
          <Route path="/exhibit/:id" element={<ExhibitDetail />} />
          <Route path="/tasks" element={<GuideTasks />} />
          <Route path="/social" element={<Multiplayer />} />
          <Route path="/camera" element={<PhotoShare />} />
          <Route path="/backpack" element={<Backpack />} />
        </Routes>
      </div>
      {showBottomNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
