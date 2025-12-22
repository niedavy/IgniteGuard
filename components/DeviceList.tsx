
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, Plus, Check, Minus } from 'lucide-react';
import { Camera, Scene } from '../types';
import { getCameraTypeIcon, getStatusIcon } from '../constants';

interface DeviceListProps {
  cameras: Camera[];
  scenes: Scene[];
  selectedId: string;
  selectedPlaybackIds?: string[];
  isPlaybackMode?: boolean;
  onSelect: (id: string) => void;
  onSelectScene?: (scene: Scene) => void;
  onAddTrigger: () => void;
  showAddButton?: boolean;
}

const DeviceList: React.FC<DeviceListProps> = ({ 
  cameras, 
  scenes, 
  selectedId, 
  selectedPlaybackIds = [],
  isPlaybackMode = false,
  onSelect, 
  onSelectScene,
  onAddTrigger,
  showAddButton = true
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    scenes.forEach(s => initial[s.id] = true);
    return initial;
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const getSceneSelectionStatus = (scene: Scene) => {
    const selectedCount = scene.cameraIds.filter(id => selectedPlaybackIds.includes(id)).length;
    if (selectedCount === 0) return 'none';
    if (selectedCount === scene.cameraIds.length) return 'all';
    return 'partial';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tab Switcher removed per user request */}
      
      <div className="flex-1 overflow-y-auto mt-2">
        {scenes.map(scene => {
          const selectionStatus = getSceneSelectionStatus(scene);
          
          return (
            <div key={scene.id} className="mb-1">
              <div 
                className="flex items-center px-2 py-1.5 hover:bg-[#252525] cursor-pointer group"
              >
                <div 
                  className="p-0.5 hover:bg-white/10 rounded transition-colors mr-0.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleGroup(scene.id);
                  }}
                >
                  {expandedGroups[scene.id] ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />}
                </div>

                {isPlaybackMode && (
                  <div 
                    onClick={() => onSelectScene?.(scene)}
                    className={`w-3.5 h-3.5 rounded border mr-2 flex items-center justify-center transition-all ${
                      selectionStatus === 'all' 
                        ? 'bg-blue-600 border-blue-600 shadow-[0_0_5px_rgba(37,99,235,0.5)]' 
                        : selectionStatus === 'partial'
                          ? 'bg-blue-600/40 border-blue-600'
                          : 'border-gray-600 bg-black/40'
                    }`}
                  >
                    {selectionStatus === 'all' && <Check size={10} className="text-white" strokeWidth={4} />}
                    {selectionStatus === 'partial' && <Minus size={10} className="text-white" strokeWidth={4} />}
                  </div>
                )}

                <div className="flex-1 flex items-center" onClick={() => isPlaybackMode ? onSelectScene?.(scene) : toggleGroup(scene.id)}>
                  <Folder size={14} className={`mx-1.5 ${selectionStatus === 'all' ? 'text-blue-400' : 'text-gray-500'} fill-blue-400/10`} />
                  <span className={`text-[11px] font-medium flex-1 ${selectionStatus === 'all' ? 'text-blue-100' : ''}`}>{scene.name}</span>
                  <span className="text-[9px] text-gray-600 mr-1 opacity-0 group-hover:opacity-100 transition-opacity">({scene.cameraIds.length})</span>
                </div>
              </div>

              {expandedGroups[scene.id] && (
                <div className="flex flex-col">
                  {scene.cameraIds.map(camId => {
                    const camera = cameras.find(c => c.id === camId);
                    if (!camera) return null;
                    
                    const isPlaybackSelected = selectedPlaybackIds.includes(camera.id);
                    const isSelected = isPlaybackMode ? isPlaybackSelected : selectedId === camera.id;

                    return (
                      <div 
                        key={camera.id}
                        className={`flex items-center px-6 py-1.5 cursor-pointer transition-colors group relative ${isSelected ? 'bg-white/5 text-white' : 'text-gray-400 hover:bg-[#252525] hover:text-gray-200'}`}
                        onClick={() => onSelect(camera.id)}
                      >
                        {isPlaybackMode && (
                          <div className={`w-3.5 h-3.5 rounded border mr-2 flex items-center justify-center transition-all ${isPlaybackSelected ? 'bg-blue-600 border-blue-600 shadow-[0_0_5px_rgba(37,99,235,0.5)]' : 'border-gray-600 bg-black/40'}`}>
                            {isPlaybackSelected && <Check size={10} className="text-white" strokeWidth={4} />}
                          </div>
                        )}
                        
                        <div className={`mr-2 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                          {getCameraTypeIcon(camera.type)}
                        </div>
                        <span className="text-[11px] truncate flex-1">{camera.name}</span>
                        <div className="ml-2">
                          {getStatusIcon(camera.status)}
                        </div>

                        {/* Selection Glow Bar */}
                        {isSelected && !isPlaybackMode && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showAddButton && (
        <div className="p-2 border-t border-[#333]">
          <button 
            onClick={onAddTrigger}
            className="w-full bg-[#252525] hover:bg-[#333] text-[11px] py-2 flex items-center justify-center space-x-2 rounded transition-colors group"
          >
            <Plus size={14} className="text-blue-500 group-hover:scale-110 transition-transform" />
            <span>Add Channel</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DeviceList;
