
import React from 'react';
import { TrafficHotspot } from '../types';

const hotspots: TrafficHotspot[] = [
  { id: '1', name: 'Silk Board Junction', lat: 100, lng: 150, trafficLevel: 'Gridlock', trend: 'increasing', details: 'Severe congestion due to metro work.' },
  { id: '2', name: 'Hebbal Flyover', lat: 300, lng: 100, trafficLevel: 'Heavy', trend: 'stable', details: 'Slow moving traffic towards Airport.' },
  { id: '3', name: 'Electronic City Toll', lat: 50, lng: 200, trafficLevel: 'Moderate', trend: 'decreasing', details: 'Clearing up after peak hours.' },
  { id: '4', name: 'Tin Factory', lat: 250, lng: 250, trafficLevel: 'Gridlock', trend: 'increasing', details: 'Bottle-neck near Outer Ring Road.' },
  { id: '5', name: 'Marathahalli', lat: 200, lng: 280, trafficLevel: 'Heavy', trend: 'stable', details: 'Busy corporate hub traffic.' },
];

const HotspotsMap: React.FC = () => {
  return (
    <div className="relative w-full h-[400px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
      {/* Simulated Map Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* Simplified "Roads" */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <path d="M50 50 L350 350" stroke="#475569" strokeWidth="12" fill="none" />
        <path d="M50 350 L350 50" stroke="#475569" strokeWidth="12" fill="none" />
        <path d="M200 20 L200 380" stroke="#475569" strokeWidth="8" fill="none" />
        <path d="M20 200 L380 200" stroke="#475569" strokeWidth="8" fill="none" />
      </svg>

      {/* Markers */}
      <div className="relative w-full h-full p-8">
        {hotspots.map((spot) => (
          <div 
            key={spot.id} 
            className="absolute cursor-pointer group"
            style={{ 
              left: `${(spot.lng / 400) * 100}%`, 
              top: `${(spot.lat / 400) * 100}%` 
            }}
          >
            <div className={`w-4 h-4 rounded-full animate-ping absolute opacity-50 ${
              spot.trafficLevel === 'Gridlock' ? 'bg-red-600' : 
              spot.trafficLevel === 'Heavy' ? 'bg-orange-500' : 'bg-yellow-500'
            }`}></div>
            <div className={`w-4 h-4 rounded-full relative ${
              spot.trafficLevel === 'Gridlock' ? 'bg-red-600' : 
              spot.trafficLevel === 'Heavy' ? 'bg-orange-500' : 'bg-yellow-500'
            }`}></div>
            
            {/* Tooltip on Hover */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-slate-800 border border-slate-700 p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
              <h4 className="text-xs font-bold text-white mb-1">{spot.name}</h4>
              <p className="text-[10px] text-slate-400 mb-2">{spot.details}</p>
              <div className="flex justify-between items-center text-[10px]">
                <span className={`font-bold ${
                  spot.trafficLevel === 'Gridlock' ? 'text-red-400' : 'text-yellow-400'
                }`}>{spot.trafficLevel}</span>
                <span className="text-slate-500">{spot.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 flex gap-4 text-[10px] bg-slate-900/80 p-2 rounded-lg border border-slate-700">
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-600"></span> Gridlock</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Heavy</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Moderate</div>
      </div>
    </div>
  );
};

export default HotspotsMap;
