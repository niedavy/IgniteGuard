
import React from 'react';
import { X, ShieldAlert, Thermometer, Wind, AlertTriangle, Maximize2, Map } from 'lucide-react';
import { Camera } from '../types';

interface EmergencyWarRoomProps {
  cameras: Camera[];
  onClose: () => void;
}

const EmergencyWarRoom: React.FC<EmergencyWarRoomProps> = ({ cameras, onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-500">
      {/* Top Warning Banner */}
      <div className="h-14 bg-red-600 flex items-center justify-between px-6 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="p-1 bg-white rounded-full animate-bounce">
            <ShieldAlert size={20} className="text-red-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black text-sm tracking-tighter uppercase">Fire Emergency Active Command</span>
            <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest leading-none">AI Priority Hub • {cameras.length} Feeds Under Alert</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className="flex space-x-2 mr-4">
                <button className="bg-red-800 hover:bg-red-900 text-white text-[10px] font-bold px-3 py-1.5 rounded flex items-center space-x-2 border border-red-500/30">
                    <Map size={14} />
                    <span>FLOOR PLAN</span>
                </button>
            </div>
            <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
            >
                <X size={24} />
            </button>
        </div>
      </div>

      <div className="flex-1 p-4 flex gap-4 overflow-hidden">
        {/* Main Content Area: Responsive Grid based on alert count */}
        <div className={`flex-1 grid gap-4 ${
            cameras.length === 1 ? 'grid-cols-1' : 
            cameras.length === 2 ? 'grid-cols-2' : 
            'grid-cols-2 grid-rows-2'
        }`}>
          {cameras.slice(0, 4).map((camera) => (
            <div key={camera.id} className="relative group border-2 border-red-600/50 bg-neutral-900 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.2)]">
              <img 
                src={`https://picsum.photos/seed/${camera.id}/1280/720`} 
                className="w-full h-full object-cover opacity-90"
                alt={camera.name}
              />
              
              {/* Alert Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 via-transparent to-black/40"></div>
              
              {/* Scanning Effect */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-red-500/50 shadow-[0_0_15px_#ef4444] animate-[scan_3s_linear_infinite]"></div>

              {/* Data Overlays */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                <div className="bg-black/80 border border-red-600/50 px-3 py-1.5 rounded flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    <span className="text-white font-black text-xs">{camera.name}</span>
                </div>
                <div className="flex gap-2">
                    <div className="bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold flex items-center space-x-1">
                        <Thermometer size={12} />
                        <span>{camera.temp}°C</span>
                    </div>
                    <div className="bg-orange-600 text-white px-2 py-1 rounded text-[10px] font-bold flex items-center space-x-1">
                        <Wind size={12} />
                        <span>SMOKE: {camera.smokeLevel}%</span>
                    </div>
                </div>
              </div>

              {/* Large Central Warning Icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                 <AlertTriangle size={120} className="text-red-500" />
              </div>

              {/* Bottom Actions */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                 <button className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full border border-white/20">
                    <Maximize2 size={16} />
                 </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar: Event Stream & Procedures */}
        <div className="w-80 flex flex-col gap-4">
            <div className="flex-1 bg-black/40 border border-white/10 rounded-lg p-4 overflow-y-auto">
                <h3 className="text-red-500 text-[10px] font-black uppercase mb-4 tracking-widest">Real-time Analysis</h3>
                <div className="space-y-4">
                    {Array.from({length: 5}).map((_, i) => (
                        <div key={i} className="flex gap-3 border-l-2 border-red-500 pl-3 py-1">
                            <div className="flex-1">
                                <div className="text-[10px] text-gray-400">10:54:3{i} AM</div>
                                <div className="text-xs text-white font-bold">Heat increase detected in Sector B</div>
                                <div className="text-[9px] text-gray-500 uppercase">Confidence: 98.4%</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-red-900/40 border border-red-500/30 rounded-lg p-4">
                <h3 className="text-white text-[10px] font-black uppercase mb-3 tracking-widest">Emergency Protocol</h3>
                <div className="space-y-2">
                    <button className="w-full bg-white text-red-700 py-2 rounded font-black text-[10px] uppercase shadow-xl hover:bg-gray-100">
                        Trigger Fire Alarm
                    </button>
                    <button className="w-full bg-transparent border border-white/40 text-white py-2 rounded font-black text-[10px] uppercase hover:bg-white/10">
                        Dispatch Fire Service
                    </button>
                </div>
            </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default EmergencyWarRoom;
