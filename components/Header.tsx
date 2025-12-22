
import React, { useState } from 'react';
import { Bell, Info, User, ChevronDown, ShieldAlert, Zap } from 'lucide-react';
import { FireEvent } from '../types';

interface HeaderProps {
  events: FireEvent[];
  alertCount: number;
  isEmergencyMode: boolean;
  onToggleEmergency: () => void;
}

const Header: React.FC<HeaderProps> = ({ events, alertCount, isEmergencyMode, onToggleEmergency }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className={`h-12 border-b flex items-center justify-between px-4 z-50 transition-colors duration-500 ${isEmergencyMode ? 'bg-red-950/30 border-red-900/50' : 'bg-[#1a1a1a] border-[#333]'}`}>
      <div className="flex items-center space-x-4">
        <span className={`text-sm font-semibold tracking-wider transition-colors ${isEmergencyMode ? 'text-red-500' : 'text-blue-400'}`}>
          IGNITEGUARD {isEmergencyMode ? 'WAR-ROOM' : 'NVR-9000'}
        </span>
        <div className="h-4 w-[1px] bg-[#333]"></div>
        
        {alertCount > 0 && (
          <button 
            onClick={onToggleEmergency}
            className={`flex items-center space-x-2 px-3 py-1 rounded text-[10px] font-bold transition-all animate-pulse shadow-lg ${isEmergencyMode ? 'bg-white text-red-600' : 'bg-red-600 text-white'}`}
          >
            <ShieldAlert size={14} />
            <span>{isEmergencyMode ? 'EXIT EMERGENCY VIEW' : `${alertCount} ACTIVE ALERTS - VIEW HUB`}</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-4 text-gray-400">
          {/* Wrap Zap icon as Lucide icons do not support the 'title' prop directly for tooltips */}
          <div 
            title="Toggle Emergency War Room"
            className="flex items-center"
          >
            <Zap 
              size={18} 
              className={`cursor-pointer transition-colors ${isEmergencyMode ? 'text-yellow-400' : 'hover:text-white'}`} 
              onClick={onToggleEmergency}
            />
          </div>
          <Info size={18} className="cursor-pointer hover:text-white" />
          
          <div className="relative">
            <Bell 
              size={18} 
              className="cursor-pointer hover:text-white" 
              onClick={() => setShowNotifications(!showNotifications)} 
            />
            {events.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] text-white font-bold px-1 rounded-full border border-[#1a1a1a]">
                {events.length}
              </span>
            )}

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-[#252525] border border-[#444] shadow-2xl rounded-md overflow-hidden">
                <div className="p-3 border-b border-[#444] flex justify-between items-center">
                  <span className="text-xs font-bold">Recent Alerts</span>
                  <span className="text-[10px] text-blue-400 cursor-pointer">Mark all as read</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {events.map(event => (
                    <div key={event.id} className="p-3 border-b border-[#333] flex space-x-3 hover:bg-[#333] transition-colors">
                      <img src={event.thumbnail} className="w-16 h-12 object-cover rounded" alt="thumb" />
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-center">
                          <span className={`text-[10px] font-bold ${event.severity === 'CRITICAL' ? 'text-red-500' : 'text-yellow-500'}`}>
                            {event.type} DETECTED
                          </span>
                          <span className="text-[9px] text-gray-500">{event.timestamp.split(' ')[1]}</span>
                        </div>
                        <span className="text-xs text-gray-300 truncate">{event.cameraName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-4 w-[1px] bg-[#333]"></div>

        <div className="flex items-center space-x-2 cursor-pointer group">
          <div className="w-7 h-7 bg-[#333] rounded-full flex items-center justify-center border border-gray-600 overflow-hidden">
            <User size={16} className="text-gray-400" />
          </div>
          <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Admin</span>
          <ChevronDown size={14} className="text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default Header;
