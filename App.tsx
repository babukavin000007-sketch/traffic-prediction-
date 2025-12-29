
import React, { useState, useEffect, useCallback } from 'react';
import { GeminiService } from './services/geminiService';
import { SearchParams, PredictionResult, TrafficZone } from './types';
import TrafficDashboard from './components/TrafficDashboard';
import PredictionForm from './components/PredictionForm';
import HotspotsMap from './components/HotspotsMap';
import { AlertTriangle, MapPin, Search, Clock, Zap, Info } from 'lucide-react';

const gemini = new GeminiService();

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [alerts, setAlerts] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>(undefined);

  useEffect(() => {
    // Initial fetch for alerts
    const fetchAlerts = async () => {
      const liveAlerts = await gemini.getQuickUpdates();
      setAlerts(liveAlerts);
    };
    fetchAlerts();

    // Get user location for maps grounding
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.log("Location access denied")
      );
    }
  }, []);

  const handlePredict = async (params: SearchParams) => {
    setLoading(true);
    try {
      const result = await gemini.predictTraffic(params, userLocation);
      setPrediction(result);
    } catch (error) {
      alert("Something went wrong while fetching traffic data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-500 p-2 rounded-lg">
            <Zap className="text-slate-900 w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">NAMMA TRAFFIC</h1>
            <p className="text-xs text-slate-400">Bengaluru AI Transit Assistant</p>
          </div>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
          <a href="#" className="hover:text-yellow-400 transition-colors">Predictions</a>
          <a href="#" className="hover:text-yellow-400 transition-colors">Alerts</a>
          <a href="#" className="hover:text-yellow-400 transition-colors">Heatmap</a>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Alerts */}
        <div className="lg:col-span-4 space-y-6">
          <section className="glass p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Search className="text-yellow-500 w-5 h-5" />
              <h2 className="text-lg font-semibold">Predict Your Ride</h2>
            </div>
            <PredictionForm onPredict={handlePredict} loading={loading} />
          </section>

          <section className="glass p-6 rounded-2xl border-l-4 border-yellow-500">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-yellow-500 w-5 h-5" />
              <h2 className="text-lg font-semibold">Live Alerts</h2>
            </div>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {alerts || 'Scanning for updates...'}
            </div>
          </section>
        </div>

        {/* Right Column: Dashboard & Map */}
        <div className="lg:col-span-8 space-y-6">
          {prediction ? (
            <TrafficDashboard result={prediction} />
          ) : (
            <div className="glass h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center rounded-2xl">
              <div className="bg-slate-800/50 p-6 rounded-full mb-6">
                <Clock className="w-12 h-12 text-slate-600 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-slate-400 mb-2">Ready to Analyze?</h2>
              <p className="max-w-md text-slate-500">
                Enter your commute details on the left. We'll use Gemini's advanced reasoning to predict traffic delays and find the best window for you to leave.
              </p>
            </div>
          )}

          <section className="glass p-6 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="text-blue-500 w-5 h-5" />
                <h2 className="text-lg font-semibold">Traffic Hotspots Map</h2>
              </div>
              <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">Simulated Dashboard</span>
            </div>
            <HotspotsMap />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center text-slate-500 text-sm">
        <p>&copy; 2024 Namma Traffic AI • Powered by Gemini Flash & Maps Grounding</p>
      </footer>
    </div>
  );
};

export default App;
