
import React, { useState, useMemo } from 'react';
import { Calendar, Activity, Camera as CameraIcon, ListFilter, Search, LayoutPanelTop, ShieldAlert } from 'lucide-react';
import { Camera } from '../types';

interface TimelineProps {
  isMultiTrack?: boolean;
  cameras?: Camera[];
  selectedIds?: string[]; // Prop to link with sidebar checkboxes
}

const Timeline: React.FC<TimelineProps> = ({ isMultiTrack = false, cameras = [], selectedIds }) => {
  const [isCompact, setIsCompact] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock: IDs of cameras that have historical fire/smoke alarms on the selected date
  const camerasWithFireAlarms = ['3', '5']; 

  const filteredCameras = useMemo(() => {
    return cameras.filter(cam => {
      const matchesSearch = cam.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Rule 1: Must have a fire alarm (as per previous requirement)
      const hasAlarm = camerasWithFireAlarms.includes(cam.id);
      
      // Rule 2: Must be selected in the sidebar (the "linkage" requirement)
      const isSelected = selectedIds ? selectedIds.includes(cam.id) : true;
      
      return matchesSearch && hasAlarm && isSelected;
    });
  }, [cameras, searchQuery, selectedIds]);

  const renderEventBars = (id: string) => (
    <>
      {/* Visual representation of fire/smoke incident segments */}
      <div className="absolute top-0 left-[15%] w-[0.8%] h-full bg-red-600/80 shadow-[0_0_8px_#dc2626]"></div>
      <div className="absolute top-0 left-[32%] w-[2%] h-full bg-red-600 shadow-[0_0_10px_#dc2626]"></div>
      {id === '3' && (
         <div className="absolute top-0 left-[52%] w-[12%] h-full bg-red-600 animate-pulse shadow-[0_0_15px_#dc2626]"></div>
      )}
      <div className="absolute top-0 left-[75%] w-[1%] h-full bg-red-600/80 shadow-[0_0_8px_#dc2626]"></div>
    </>
  );

  return (
    <div className={`${isMultiTrack ? 'h-80' : 'h-28'} bg-[#1a1a1a] border-t border-[#333] flex flex-col select-none transition-all duration-300 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-40`}>
      {/* Enhanced Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#252525] bg-[#1d1d1d] shrink-0">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
             <ShieldAlert size={14} className="text-red-500" />
             <span className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">Fire Incident Timeline</span>
             <span className="text-blue-500 text-[10px] font-mono">2024/05/20</span>
          </div>

          {isMultiTrack && (
            <div className="flex items-center space-x-2 ml-4">
              <div className="relative">
                <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Filter alerted cameras..." 
                  className="bg-black/40 border border-[#333] rounded px-7 py-1 text-[10px] focus:outline-none focus:border-blue-500 w-40"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button 
                onClick={() => setIsCompact(!isCompact)}
                className={`flex items-center space-x-1.5 px-2 py-1 rounded transition-colors ${isCompact ? 'bg-blue-900/40 border border-blue-500/50 text-blue-400' : 'bg-[#252525] border border-[#333] text-gray-400'}`}
              >
                <LayoutPanelTop size={12} />
                <span className="text-[9px] font-bold uppercase">Compact View</span>
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4 text-[9px] text-gray-500">
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 bg-red-600 rounded-full shadow-[0_0_5px_#dc2626] animate-pulse"></div>
            <span className="text-red-500 font-bold uppercase tracking-tight">Confirmed Fire Alert</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative flex flex-col group overflow-hidden">
        {/* Sticky Hour Markers */}
        <div className="flex h-6 border-b border-[#252525] bg-black/40 shrink-0 z-20">
           <div className="w-32 shrink-0 border-r border-[#252525]"></div>
           <div className="flex-1 flex">
             {Array.from({ length: 12 }).map((_, i) => (
               <div key={i} className="flex-1 border-l border-[#252525] text-[9px] text-gray-600 pl-1 pt-1 font-mono">
                 {(i + 6).toString().padStart(2, '0')}:00
               </div>
             ))}
           </div>
        </div>

        {/* Scrollable Tracks Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[#0a0a0a]">
          {/* Vertical Time Indicator Lines */}
          <div className="absolute inset-0 pointer-events-none flex">
            <div className="w-32 shrink-0"></div>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex-1 border-l border-[#222]/30 h-full"></div>
            ))}
          </div>

          <div className="flex flex-col relative min-h-full">
            {filteredCameras.length > 0 ? (
              filteredCameras.map(camera => (
                <div 
                  key={camera.id} 
                  className={`${isCompact ? 'h-8' : 'h-14'} w-full border-b border-[#222] flex group/track hover:bg-red-500/5 transition-colors`}
                >
                   <div className="w-32 bg-[#151515] border-r border-[#222] flex flex-col justify-center px-3 shrink-0 z-10 shadow-lg">
                      <div className="flex items-center space-x-1 text-white/80">
                         <Activity size={isCompact ? 8 : 10} className="text-red-500" />
                         <span className={`${isCompact ? 'text-[8px]' : 'text-[9px]'} font-bold truncate`}>{camera.name}</span>
                      </div>
                      {!isCompact && <span className="text-[8px] text-gray-600 font-mono">{camera.ip}</span>}
                   </div>
                   <div className="flex-1 relative">
                      {renderEventBars(camera.id)}
                   </div>
                </div>
              ))
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 space-y-3 bg-[#0a0a0a]">
                <div className="p-4 bg-white/5 rounded-full border border-white/5">
                  <ShieldAlert size={40} className="opacity-20 text-gray-400" />
                </div>
                <div className="text-center">
                  <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">No Fire Alerts Found</span>
                  <span className="text-[9px] text-gray-600 uppercase">
                    {selectedIds && selectedIds.length > 0 
                      ? "The selected channels do not have fire incidents recorded" 
                      : "Select channels from the device list to view historical alerts"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Time Playhead */}
        {filteredCameras.length > 0 && (
          <div className="absolute top-0 bottom-0 left-[55%] w-[1px] bg-red-500 z-30 pointer-events-none shadow-[0_0_15px_rgba(239,68,68,1)]">
              <div className="absolute top-0 -left-1.5 w-3 h-6 bg-red-600 border border-white/20 flex flex-col items-center justify-center rounded-b-sm">
                 <div className="w-[1px] h-3 bg-white/60"></div>
              </div>
              <div className="absolute top-[2px] left-2 whitespace-nowrap bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xl font-mono border border-white/10">
                 10:52:45
              </div>
          </div>
        )}
      </div>
      
      {/* Bottom Status Summary */}
      <div className="h-5 w-full bg-[#080808] border-t border-[#333] shrink-0 flex items-center px-4 justify-between">
         <span className="text-[8px] text-gray-600 uppercase font-bold tracking-widest">
           Playback Matrix Monitoring System
         </span>
         <div className="flex space-x-4">
            <span className={`text-[8px] font-bold uppercase ${filteredCameras.length > 0 ? 'text-red-500' : 'text-gray-600'}`}>
              Alerted Channels in View: {filteredCameras.length}
            </span>
         </div>
      </div>
    </div>
  );
};

export default Timeline;
