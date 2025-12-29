
import React, { useState } from 'react';
import { SearchParams, TrafficZone } from '../types';

interface PredictionFormProps {
  onPredict: (params: SearchParams) => void;
  loading: boolean;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredict, loading }) => {
  const [source, setSource] = useState(TrafficZone.WHITEFIELD);
  const [destination, setDestination] = useState(TrafficZone.SILK_BOARD);
  const [time, setTime] = useState('09:00');
  const [day, setDay] = useState('Monday');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict({ source, destination, time, day });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Starting Location</label>
        <select 
          value={source} 
          onChange={(e) => setSource(e.target.value as TrafficZone)}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
        >
          {Object.values(TrafficZone).map(zone => <option key={zone} value={zone}>{zone}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Destination</label>
        <select 
          value={destination} 
          onChange={(e) => setDestination(e.target.value as TrafficZone)}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
        >
          {Object.values(TrafficZone).map(zone => <option key={zone} value={zone}>{zone}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Time</label>
          <input 
            type="time" 
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Day</label>
          <select 
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none"
          >
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 rounded-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </span>
        ) : 'Check Traffic'}
      </button>
    </form>
  );
};

export default PredictionForm;
