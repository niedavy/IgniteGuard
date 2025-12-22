
import React from 'react';
import { Home, Monitor, Play, Settings, HelpCircle, Power, LayoutGrid } from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; active?: boolean; onClick?: () => void; label: string }> = ({ icon, active, onClick, label }) => (
  <div 
    onClick={onClick}
    title={label}
    className={`p-3 cursor-pointer transition-all hover:text-white ${active ? 'text-blue-500 border-l-2 border-blue-500 bg-blue-500/5' : 'text-gray-500 hover:bg-white/5'}`}
  >
    {icon}
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="w-14 bg-[#111111] flex flex-col items-center py-4 space-y-4 border-r border-[#222]">
      <div className="mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center font-bold text-white text-xs">IG</div>
      </div>
      
      <NavItem icon={<Home size={20} />} label="Dashboard" />
      <NavItem 
        icon={<Monitor size={20} />} 
        active={currentView === 'monitor'} 
        onClick={() => onViewChange('monitor')}
        label="Live Monitor"
      />
      <NavItem 
        icon={<Play size={20} />} 
        active={currentView === 'playback'} 
        onClick={() => onViewChange('playback')}
        label="Playback"
      />
      <NavItem 
        icon={<LayoutGrid size={20} />} 
        active={currentView === 'gallery'} 
        onClick={() => onViewChange('gallery')}
        label="Incident Gallery"
      />
    </div>
  );
};

export default Sidebar;
