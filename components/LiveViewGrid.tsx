import React, { useMemo } from 'react';
// Added CameraType to the import list to fix the reference error in the visibleCameras useMemo.
import { Camera, LayoutType, CameraStatus, CameraType } from '../types';
import { Maximize2, Settings, Thermometer, Wind, ChevronLeft, ChevronRight } from 'lucide-react';

interface LiveViewGridProps {
  layout: LayoutType;
  cameras: Camera[];
  selectedId: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  onLayoutChange: (layout: LayoutType) => void;
  onSelect: (id: string) => void;
}

const CameraFeed: React.FC<{ camera: Camera; isSelected: boolean; onClick: () => void }> = ({ camera, isSelected, onClick }) => {
  const isAlert = camera.status === CameraStatus.ALERT;

  return (
    <div 
      className={`relative w-full h-full bg-neutral-900 border transition-all overflow-hidden cursor-pointer group ${
        isSelected 
          ? 'border-blue-500 z-10 shadow-lg' 
          : isAlert 
            ? 'border-red-600 shadow-[inset_0_0_20px_rgba(220,38,38,0.3)]' 
            : 'border-[#222]'
      }`}
      onClick={onClick}
    >
      {/* Alert Pulsing Background Overlay */}
      {isAlert && (
        <div className="absolute inset-0 pointer-events-none bg-red-600/10 animate-pulse z-0"></div>
      )}

      {/* Simulation of Video Feed */}
      {camera.id.startsWith('filler') ? (
        <div className="w-full h-full bg-[#050505] flex items-center justify-center">
           <span className="text-[10px] text-gray-800 font-bold tracking-widest uppercase">No Signal</span>
        </div>
      ) : (
        <img 
          src={`https://picsum.photos/seed/${camera.id}/800/450`} 
          className={`w-full h-full object-cover transition-opacity duration-500 ${camera.status === CameraStatus.DISCONNECTED ? 'opacity-20 grayscale' : 'opacity-80'}`}
          alt={camera.name}
        />
      )}

      {/* Connection Offline Overlay */}
      {camera.status === CameraStatus.DISCONNECTED && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
           <Wind size={32} className="text-gray-500 mb-2" />
           <span className="text-xs text-gray-400">Signal Lost</span>
        </div>
      )}

      {/* AI Detection Visualizations */}
      {camera.status !== CameraStatus.DISCONNECTED && !camera.id.startsWith('filler') && (
        <>
          {isAlert && (
            <div className="absolute top-1/4 left-1/3 w-24 h-24 border-2 border-red-500 animate-pulse flex flex-col items-center justify-center z-20">
              <span className="bg-red-500 text-white text-[8px] font-bold px-1 absolute -top-4">FLAME DETECTED</span>
              <div className="absolute inset-0 bg-red-500/10 animate-ping rounded-sm"></div>
            </div>
          )}
          {(camera.smokeLevel || 0) > 10 && (
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] mix-blend-screen animate-pulse z-10"></div>
          )}
        </>
      )}

      {/* Camera Header Info */}
      <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-start z-30">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-white shadow-sm">{camera.name}</span>
          {!camera.id.startsWith('filler') && <span className="text-[8px] text-gray-300">{camera.ip}</span>}
        </div>
        <div className="flex space-x-2">
          {!camera.id.startsWith('filler') && (
            <>
              <Thermometer size={14} className={camera.temp && camera.temp > 27 ? "text-orange-500" : "text-gray-400"} />
              <Settings size={14} className="text-gray-400 hover:text-white" />
              <Maximize2 size={14} className="text-gray-400 hover:text-white" />
            </>
          )}
        </div>
      </div>

      {/* Smart Analysis Footer */}
      {!camera.id.startsWith('filler') && (
        <div className="absolute bottom-2 left-2 flex space-x-2 z-30">
          {camera.temp && (
            <div className={`px-2 py-0.5 rounded text-[10px] flex items-center space-x-1 ${camera.temp > 27 ? 'bg-red-900/80 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'bg-black/60 text-gray-300'}`}>
              <Thermometer size={10} />
              <span>{camera.temp}°C</span>
            </div>
          )}
          {camera.smokeLevel !== undefined && (
              <div className={`px-2 py-0.5 rounded text-[10px] flex items-center space-x-1 ${camera.smokeLevel > 10 ? 'bg-orange-900/80 text-white' : 'bg-black/60 text-gray-300'}`}>
                  <Wind size={10} />
                  <span>Smoke: {camera.smokeLevel}%</span>
              </div>
          )}
        </div>
      )}

      {/* Status Tags */}
      {!camera.id.startsWith('filler') && (
        <div className="absolute top-2 right-2 flex space-x-1 z-30">
          {camera.status === CameraStatus.RECORDING && (
            <div className="bg-red-600/90 text-white text-[8px] px-1 rounded flex items-center space-x-1">
              <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
              <span>REC</span>
            </div>
          )}
          <div className="bg-blue-600/90 text-white text-[8px] px-1 rounded flex items-center">
            VCA
          </div>
        </div>
      )}
    </div>
  );
};

const LiveViewGrid: React.FC<LiveViewGridProps> = ({ 
  layout, 
  cameras, 
  selectedId, 
  currentPage, 
  onPageChange, 
  onLayoutChange, 
  onSelect 
}) => {
  const layouts: LayoutType[] = ['1x1', '2x2', '3x3', '1P+3'];

  const pageSize = useMemo(() => {
    switch (layout) {
      case '1x1': return 1;
      case '2x2': return 4;
      case '3x3': return 9;
      case '1P+3': return 4;
      default: return 4;
    }
  }, [layout]);

  const totalPages = Math.max(1, Math.ceil(cameras.length / pageSize));
  
  const visibleCameras = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const list = cameras.slice(startIndex, startIndex + pageSize);
    
    // Fill remaining slots if necessary
    while (list.length < pageSize) {
      list.push({ 
        id: `filler-${list.length}-${currentPage}`, 
        name: 'Empty Slot',
        // Fix: Use CameraType.CAMERA which is now imported
        type: CameraType.CAMERA,
        status: CameraStatus.DISCONNECTED,
        ip: '0.0.0.0',
        model: 'None',
        resolution: 'N/A'
      });
    }
    return list;
  }, [layout, cameras, currentPage, pageSize]);

  const getGridClass = () => {
    switch (layout) {
      case '1x1': return 'grid-cols-1 grid-rows-1';
      case '2x2': return 'grid-cols-2 grid-rows-2';
      case '3x3': return 'grid-cols-3 grid-rows-3';
      case '1P+3': return 'grid-cols-3 grid-rows-3'; 
      default: return 'grid-cols-2 grid-rows-2';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 p-1">
        <div className={`grid h-full gap-1 ${getGridClass()}`}>
          {visibleCameras.map(camera => (
            <CameraFeed 
              key={camera.id} 
              camera={camera} 
              isSelected={selectedId === camera.id} 
              onClick={() => onSelect(camera.id)} 
            />
          ))}
        </div>
      </div>

      {/* Monitor Bottom Bar */}
      <div className="h-10 bg-[#1a1a1a] border-t border-[#333] flex items-center justify-between px-4 shrink-0 z-40 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-black/40 rounded border border-[#333] p-0.5">
            {layouts.map(l => (
              <button
                key={l}
                onClick={() => onLayoutChange(l)}
                className={`p-1.5 rounded-sm transition-all ${layout === l ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-500 hover:text-gray-300'}`}
                title={`Layout ${l}`}
              >
                <div className={`grid gap-0.5 ${l === '1x1' ? 'grid-cols-1' : l === '2x2' ? 'grid-cols-2' : 'grid-cols-3'}`}>
                  {Array.from({ length: l === '1x1' ? 1 : l === '2x2' ? 4 : l === '3x3' ? 9 : 4 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-current rounded-[0.5px]"></div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
             <button 
               disabled={currentPage === 1}
               onClick={() => onPageChange(currentPage - 1)}
               className={`p-1.5 rounded transition-colors ${currentPage === 1 ? 'text-gray-800 cursor-not-allowed' : 'text-gray-400 hover:bg-[#333] hover:text-white'}`}
             >
               <ChevronLeft size={16} />
             </button>
             
             <div className="flex items-center space-x-1.5">
               <span className="text-[11px] font-bold text-blue-500 font-mono tracking-tighter">{currentPage.toString().padStart(2, '0')}</span>
               <span className="text-[10px] text-gray-700">/</span>
               <span className="text-[11px] font-bold text-gray-500 font-mono tracking-tighter">{totalPages.toString().padStart(2, '0')}</span>
             </div>

             <button 
               disabled={currentPage === totalPages}
               onClick={() => onPageChange(currentPage + 1)}
               className={`p-1.5 rounded transition-colors ${currentPage === totalPages ? 'text-gray-800 cursor-not-allowed' : 'text-gray-400 hover:bg-[#333] hover:text-white'}`}
             >
               <ChevronRight size={16} />
             </button>
          </div>
          
          <div className="h-4 w-[1px] bg-[#333]"></div>
          
          <div className="flex items-center space-x-2">
            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Live Matrix</span>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveViewGrid;