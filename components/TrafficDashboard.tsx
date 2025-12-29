
import React from 'react';
import { PredictionResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Info, ExternalLink, Timer, Map as MapIcon } from 'lucide-react';

interface TrafficDashboardProps {
  result: PredictionResult;
}

const TrafficDashboard: React.FC<TrafficDashboardProps> = ({ result }) => {
  const getScoreColor = (score: number) => {
    if (score < 40) return 'text-green-400';
    if (score < 70) return 'text-yellow-400';
    return 'text-red-500';
  };

  const chartData = [
    { name: 'Estimated Traffic Density', value: result.score },
    { name: 'Average Delay', value: Math.max(10, result.score * 1.5) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Score Card */}
        <div className="glass p-6 rounded-2xl flex flex-col items-center justify-center text-center">
          <span className="text-sm font-medium text-slate-500 mb-2 uppercase">Traffic Intensity Score</span>
          <div className={`text-6xl font-black mb-2 ${getScoreColor(result.score)}`}>
            {result.score}%
          </div>
          <p className="text-slate-200 font-medium px-4">{result.summary}</p>
        </div>

        {/* Factors & Best Time */}
        <div className="glass p-6 rounded-2xl space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Timer className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-bold uppercase text-slate-500">Best Window</span>
            </div>
            <p className="text-xl font-semibold text-slate-100">{result.bestTimeToLeave}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-bold uppercase text-slate-500">Key Delay Factors</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.factors.map((f, i) => (
                <span key={i} className="px-2 py-1 bg-slate-800 text-xs rounded-md text-slate-300 border border-slate-700">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart View */}
        <div className="md:col-span-2 glass p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-500 mb-6 uppercase">Traffic Metrics Visualization</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" domain={[0, 150]} hide />
                <YAxis dataKey="name" type="category" width={140} stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={index === 0 ? (result.score > 70 ? '#ef4444' : '#eab308') : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alternative Routes */}
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <MapIcon className="w-4 h-4 text-green-500" />
            <h3 className="text-sm font-bold text-slate-500 uppercase">Recommended Routes</h3>
          </div>
          <ul className="space-y-3">
            {result.alternativeRoutes.map((route, i) => (
              <li key={i} className="text-sm flex items-start gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                {route}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Grounding Sources */}
      {result.groundingLinks.length > 0 && (
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase flex items-center gap-2">
            Verified Sources via Google Search & Maps
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {result.groundingLinks.map((link, i) => (
              <a 
                key={i} 
                href={link.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700 hover:bg-slate-700/50 transition-colors group"
              >
                <span className="text-sm text-slate-300 truncate pr-2 group-hover:text-yellow-400">{link.title || link.uri}</span>
                <ExternalLink className="w-4 h-4 text-slate-500 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrafficDashboard;
