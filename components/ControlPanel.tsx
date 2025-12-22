
import React, { useState } from 'react';
// Fix: Import ViewType from '../types' as it is defined and exported there, not in '../App'.
import { Camera, LayoutType, ViewType } from '../types';
import { ChevronDown, Info, Shield, Bookmark, Trash2, Sliders, Volume2, Maximize, Search, Calendar as CalendarIcon, Filter, ShieldAlert } from 'lucide-react';
import Calendar from './Calendar';

interface ControlPanelProps {
  camera: Camera;
  layout: LayoutType;
  viewMode?: ViewType;
  onLayoutChange: (layout: LayoutType) => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="border-b border-[#333]">
    <div className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#252525] group">
      <span className="text-[11px] font-bold text-gray-400 group-hover:text-white uppercase tracking-tighter">{title}</span>
      <ChevronDown size={14} className="text-gray-600" />
    </div>
    <div className="px-3 pb-3">
      {children}
    </div>
  </div>
);

const ControlPanel: React.FC<ControlPanelProps> = ({ camera, layout, viewMode = 'monitor', onLayoutChange }) => {
  const [selectedDay, setSelectedDay] = useState(20);

  return (
    <div className="flex flex-col h-full text-[11px] select-none">
      <div className="flex bg-[#252525] p-1 gap-1">
        <button className={`flex-1 py-1 rounded-sm font-medium transition-colors ${viewMode === 'monitor' ? 'bg-[#3b82f6] text-white' : 'text-gray-400'}`}>
          {viewMode === 'monitor' ? 'Control' : 'Search'}
        </button>
        <button className="flex-1 py-1 text-gray-400 hover:text-white rounded-sm font-medium">
          Settings
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {viewMode === 'monitor' ? (
          <>
            <Section title={`Live Camera ${camera.id.padStart(2, '0')}`}>
              <div className="space-y-2 mt-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">IP Address</span>
                  <span className="text-gray-300">{camera.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Model</span>
                  <span className="text-gray-300">{camera.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Resolution</span>
                  <span className="text-gray-300">{camera.resolution}</span>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 bg-red-600 hover:bg-red-700 py-1.5 rounded flex items-center justify-center border border-red-700">
                    <Trash2 size={14} />
                    <span className="ml-2 font-bold text-[10px] uppercase">Remove</span>
                  </button>
                </div>
              </div>
            </Section>

            <Section title="Image Adjust">
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-2">
                    <Sliders size={14} className="text-gray-500" />
                    <div className="flex-1 h-[2px] bg-[#333] relative">
                        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full border border-white"></div>
                    </div>
                </div>
              </div>
            </Section>
          </>
        ) : (
          <>
            <Section title="Event Calendar">
               <div className="mt-2">
                  <Calendar selectedDate={selectedDay} onDateSelect={setSelectedDay} />
               </div>
            </Section>

            <Section title="Incident Types">
               <div className="space-y-2 mt-2">
                 <div className="flex items-center space-x-3 bg-red-900/10 p-2.5 rounded border border-red-500/20 shadow-inner">
                    <ShieldAlert size={16} className="text-red-500 animate-pulse" />
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-[10px]">FIRE & SMOKE</span>
                      <span className="text-[8px] text-gray-500 uppercase">Detection Alarms Only</span>
                    </div>
                    <div className="ml-auto w-4 h-4 rounded-full bg-red-600 flex items-center justify-center">
                       <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                 </div>
                 <p className="text-[9px] text-gray-500 px-1 pt-1 italic">
                   Note: System is currently filtered to show only confirmed AI fire incidents. Heat warnings are excluded.
                 </p>
               </div>
            </Section>

            <Section title="Search Range">
               <div className="space-y-3 mt-2">
                  <div className="flex gap-2">
                    <div className="flex-1 bg-[#111] p-1.5 border border-[#333] rounded text-center text-gray-400 font-mono">06:00</div>
                    <div className="text-gray-600 flex items-center text-[9px] font-bold">TO</div>
                    <div className="flex-1 bg-[#111] p-1.5 border border-[#333] rounded text-center text-gray-400 font-mono">18:00</div>
                  </div>
                  <button className="w-full bg-red-600 hover:bg-red-500 py-2.5 rounded font-black text-white flex items-center justify-center space-x-2 shadow-lg shadow-red-900/20 transition-all active:scale-95 border border-red-500/50">
                    <Search size={14} />
                    <span className="tracking-widest">FETCH INCIDENTS</span>
                  </button>
               </div>
            </Section>
          </>
        )}
      </div>

      <div className="p-3 border-t border-[#333] mt-auto">
        <div className="flex items-center space-x-2 p-2 bg-red-900/20 rounded border border-red-500/20">
          <Shield size={14} className="text-red-500" />
          <span className="text-[10px] text-red-400 font-bold uppercase tracking-tight">AI Fire Forensic Mode</span>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
