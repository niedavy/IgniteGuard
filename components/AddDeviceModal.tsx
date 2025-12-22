
import React, { useState } from 'react';
import { X, Info, Network, Monitor, FolderPlus, Layers } from 'lucide-react';
import { CameraType, Camera, Scene } from '../types';

interface AddDeviceModalProps {
  isOpen: boolean;
  existingScenes: Scene[];
  onClose: () => void;
  onAdd: (camera: Omit<Camera, 'id' | 'status'>, sceneOption: { id?: string; newName?: string }) => void;
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ isOpen, existingScenes, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    model: 'IB-9000-NEW',
    type: CameraType.CAMERA,
    resolution: '1920x1080'
  });

  const [sceneMode, setSceneMode] = useState<'existing' | 'new'>('existing');
  const [selectedSceneId, setSelectedSceneId] = useState<string>(existingScenes[0]?.id || '');
  const [newSceneName, setNewSceneName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.ip) return;
    if (sceneMode === 'new' && !newSceneName) return;

    onAdd(formData, {
      id: sceneMode === 'existing' ? selectedSceneId : undefined,
      newName: sceneMode === 'new' ? newSceneName : undefined
    });

    // Reset
    setFormData({ name: '', ip: '', model: 'IB-9000-NEW', type: CameraType.CAMERA, resolution: '1920x1080' });
    setNewSceneName('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1a1a1a] border border-[#333] w-[480px] rounded shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-4 py-3 bg-[#252525] border-b border-[#333]">
          <div className="flex items-center space-x-2">
            <PlusCircle size={16} className="text-blue-500" />
            <span className="text-sm font-bold tracking-wide">ADD CAMERA CHANNEL</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Device Core Info */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] text-gray-500 font-bold uppercase">Device Name</label>
              <div className="relative">
                <input
                  autoFocus
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0f0f0f] border border-[#333] rounded px-9 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g. 07 - Loading Dock"
                />
                <Info size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-gray-500 font-bold uppercase">IP Address</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.ip}
                  onChange={e => setFormData({ ...formData, ip: e.target.value })}
                  className="w-full bg-[#0f0f0f] border border-[#333] rounded px-9 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="192.168.1.1XX"
                />
                <Network size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] text-gray-500 font-bold uppercase">Camera Type</label>
              <div className="relative">
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as CameraType })}
                  className="w-full bg-[#0f0f0f] border border-[#333] rounded px-9 py-2 text-sm focus:outline-none focus:border-blue-500 appearance-none transition-colors"
                >
                  <option value={CameraType.CAMERA}>Standard</option>
                  <option value={CameraType.FISHEYE}>Fisheye</option>
                  <option value={CameraType.PTZ}>PTZ</option>
                </select>
                <Monitor size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-gray-500 font-bold uppercase">Resolution</label>
              <div className="relative">
                <select
                  value={formData.resolution}
                  onChange={e => setFormData({ ...formData, resolution: e.target.value })}
                  className="w-full bg-[#0f0f0f] border border-[#333] rounded px-9 py-2 text-sm focus:outline-none focus:border-blue-500 appearance-none transition-colors"
                >
                  <option value="1920x1080">1080p (2MP)</option>
                  <option value="2560x1440">1440p (4MP)</option>
                  <option value="3840x2160">2160p (4K)</option>
                </select>
                <Monitor size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Scene Selection Logic */}
          <div className="pt-2 border-t border-[#333] space-y-3">
             <div className="flex items-center justify-between">
                <label className="text-[11px] text-gray-500 font-bold uppercase">Assign to Scene</label>
                <div className="flex bg-[#252525] p-0.5 rounded text-[10px]">
                  <button 
                    type="button"
                    onClick={() => setSceneMode('existing')}
                    className={`px-2 py-0.5 rounded-sm transition-colors ${sceneMode === 'existing' ? 'bg-blue-600 text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Existing
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSceneMode('new')}
                    className={`px-2 py-0.5 rounded-sm transition-colors ${sceneMode === 'new' ? 'bg-blue-600 text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Create New
                  </button>
                </div>
             </div>

             {sceneMode === 'existing' ? (
                <div className="relative">
                  <select
                    value={selectedSceneId}
                    onChange={e => setSelectedSceneId(e.target.value)}
                    className="w-full bg-[#0f0f0f] border border-[#333] rounded px-9 py-2 text-sm focus:outline-none focus:border-blue-500 appearance-none transition-colors"
                  >
                    {existingScenes.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                    {existingScenes.length === 0 && <option value="" disabled>No scenes found</option>}
                  </select>
                  <Layers size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
             ) : (
                <div className="relative">
                  <input
                    type="text"
                    value={newSceneName}
                    onChange={e => setNewSceneName(e.target.value)}
                    className="w-full bg-[#0f0f0f] border border-[#333] rounded px-9 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Enter new scene name..."
                  />
                  <FolderPlus size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
             )}
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.name || !formData.ip || (sceneMode === 'new' && !newSceneName)}
              className="px-8 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold rounded shadow-lg transition-all uppercase"
            >
              Confirm Addition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PlusCircle = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);

export default AddDeviceModal;
