
import React from 'react';
import { Camera, LayoutType, ViewType, CameraStatus } from '../types';
import { ChevronDown, Search, ShieldAlert, Info, Cpu, Maximize } from 'lucide-react';
import Calendar from './Calendar';
import { getCameraTypeIcon } from '../constants';

interface ControlPanelProps {
  camera: Camera;
  layout: LayoutType;
  viewMode?: ViewType;
  onLayoutChange: (layout: LayoutType) => void;
  selectedDate: number | null;
  onDateSelect: (date: number | null) => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode }> = ({ title, children, icon }) => (
  <div className="border-b border-[#333]">
    <div className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#252525] group">
      <div className="flex items-center space-x-2">
        {icon && <span className="text-gray-500 group-hover:text-blue-400">{icon}</span>}
        <span className="text-[11px] font-bold text-gray-400 group-hover:text-white uppercase tracking-tighter">{title}</span>
      </div>
      <ChevronDown size={14} className="text-gray-600" />
    </div>
    <div className="px-3 pb-3">
      {children}
    </div>
  </div>
);

const InfoRow: React.FC<{ label: string; value: string | number | React.ReactNode; icon?: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="flex justify-between items-center py-1.5 group/row">
    <div className="flex items-center space-x-2">
      {icon && <span className="text-gray-600 group-hover/row:text-gray-400">{icon}</span>}
      <span className="text-gray-500 text-[10px] uppercase font-medium">{label}</span>
    </div>
    <span className="text-gray-200 font-mono text-[11px]">{value}</span>
  </div>
);

const ControlPanel: React.FC<ControlPanelProps> = ({ camera, layout, viewMode = 'monitor', onLayoutChange, selectedDate, onDateSelect }) => {
  return (
    <div className="flex flex-col h-full text-[11px] select-none bg-[#1a1a1a]">
      {/* Top Header Label */}
      <div className="h-10 border-b border-[#333] flex items-center px-4 bg-[#1f1f1f]">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
          {viewMode === 'monitor' ? 'Camera Analytics' : 'Incident Search'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {viewMode === 'monitor' ? (
          <>
            <Section title="General Information" icon={<Info size={14} />}>
              <div className="mt-2 space-y-1">
                <InfoRow label="Device Name" value={camera.name} />
                <InfoRow label="Status" value={
                  <div className="flex items-center space-x-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      camera.status === CameraStatus.RECORDING ? 'bg-red-500 animate-pulse' : 
                      camera.status === CameraStatus.ALERT ? 'bg-yellow-500' : 
                      camera.status === CameraStatus.DISCONNECTED ? 'bg-gray-600' : 'bg-green-500'
                    }`}></div>
                    <span className={
                      camera.status === CameraStatus.ALERT ? 'text-yellow-500' : 
                      camera.status === CameraStatus.RECORDING ? 'text-red-500' : 'text-gray-400'
                    }>
                      {camera.status}
                    </span>
                  </div>
                } />
                <InfoRow label="Type" value={
                  <div className="flex items-center space-x-1">
                    {getCameraTypeIcon(camera.type)}
                    <span className="capitalize">{camera.type.toLowerCase()}</span>
                  </div>
                } />
              </div>
            </Section>

            <Section title="Hardware & Network" icon={<Cpu size={14} />}>
              <div className="mt-2 space-y-1">
                <InfoRow label="IP Address" value={camera.ip} />
                <InfoRow label="Hardware ID" value={camera.model} />
                <InfoRow label="Resolution" value={camera.resolution} icon={<Maximize size={12} />} />
                <InfoRow label="Bitrate" value="4.2 Mbps" />
                <InfoRow label="Frame Rate" value="30 FPS" />
              </div>
            </Section>
          </>
        ) : (
          <>
            <Section title="Event Calendar">
               <div className="mt-2">
                  <Calendar selectedDate={selectedDate || 0} onDateSelect={onDateSelect} />
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
    </div>
  );
};

export default ControlPanel;
