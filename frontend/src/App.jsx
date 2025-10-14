import React, { useEffect } from "react";
import { StreamProvider } from "./context/StreamContext.jsx";
import { useStreamAPI } from "./hooks/useStreamAPI.jsx";
import Header from "./components/Header.jsx";
import VideoContainer from "./components/VideoContainer.jsx";
import OverlayManagement from "./components/OverlayManagement.jsx";

const AppContent = () => {
  const { fetchOverlays } = useStreamAPI();

  useEffect(() => {
    fetchOverlays();
  }, [fetchOverlays]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        <Header />
        <div className="xl:px-80">
          <VideoContainer />
          <div className="pt-10">
            <OverlayManagement />
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <StreamProvider>
      <AppContent />
    </StreamProvider>
  );
};

export default App;
