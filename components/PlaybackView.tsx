
import React from 'react';
import { Camera, CameraStatus } from '../types';
import Timeline from './Timeline';
import { AlertCircle, Video } from 'lucide-react';

interface PlaybackViewProps {
  cameras: Camera[];
  selectedIds: string[];
  selectedDate: number | null;
}

const PlaybackView: React.FC<PlaybackViewProps> = ({ cameras, selectedIds, selectedDate }) => {
  const selectedCameras = cameras.filter(cam => selectedIds.includes(cam.id));
  const dateStr = selectedDate ? `2024-05-${selectedDate.toString().padStart(2, '0')}` : '2024-05-20';

  const getGridClass = () => {
    const count = selectedCameras.length;
    if (count <= 1) return 'grid-cols-1';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 9) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  return (
    <div className="flex-1 flex flex-col bg-black overflow-hidden">
      <div className="flex-1 p-2 relative flex flex-col">
        {selectedCameras.length > 0 ? (
          <div className={`grid gap-2 h-full ${getGridClass()}`}>
            {selectedCameras.map(cam => (
              <div key={cam.id} className="relative bg-[#0a0a0a] border border-[#222] rounded overflow-hidden group shadow-lg">
                <img 
                  src={`https://picsum.photos/seed/playback-${cam.id}-${selectedDate}/800/450`} 
                  className="w-full h-full object-cover opacity-60 grayscale-[0.3]"
                  alt={cam.name}
                />
                
                <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
                    <div className="bg-black/70 px-2 py-1 rounded border border-white/10 flex items-center space-x-2 backdrop-blur-sm">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-bold text-white uppercase tracking-tight">{cam.name}</span>
                    </div>
                    <div className="bg-black/50 text-[9px] text-gray-400 px-1.5 py-0.5 rounded border border-white/5 font-mono">
                      {cam.ip}
                    </div>
                </div>

                {cam.status === CameraStatus.ALERT && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="p-12 border-2 border-red-600/20 rounded-full animate-pulse">
                           <AlertCircle size={48} className="text-red-500/30" />
                        </div>
                    </div>
                )}
                
                <div className="absolute bottom-2 right-2 font-mono text-[9px] text-white/50 bg-black/40 px-2 rounded border border-white/5">
                   {dateStr} 10:52:45
                </div>

                <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 border border-dashed border-[#222] m-2 rounded-lg flex flex-col items-center justify-center text-gray-700 bg-[#050505]">
             <div className="p-8 bg-[#0a0a0a] rounded-full border border-[#111] mb-6 shadow-2xl">
                <Video size={64} className="opacity-20 text-blue-500" />
             </div>
             <h3 className="text-gray-500 font-black text-sm uppercase tracking-[0.3em] mb-2">No Feeds Active</h3>
             <p className="text-[10px] text-gray-600 uppercase tracking-widest text-center max-w-[200px] leading-relaxed">
               Select camera channels from the device panel to begin multi-track playback analysis
             </p>
             <div className="mt-8 flex space-x-2">
                <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
             </div>
          </div>
        )}
      </div>

      <Timeline isMultiTrack cameras={cameras} selectedIds={selectedIds} activeDate={dateStr} />
    </div>
  );
};

export default PlaybackView;
