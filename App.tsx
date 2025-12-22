
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DeviceList from './components/DeviceList';
import LiveViewGrid from './components/LiveViewGrid';
import ControlPanel from './components/ControlPanel';
import AddDeviceModal from './components/AddDeviceModal';
import EmergencyWarRoom from './components/EmergencyWarRoom';
import PlaybackView from './components/PlaybackView';
import GalleryView from './components/GalleryView';
import { Camera, CameraType, CameraStatus, LayoutType, FireEvent, Scene, ViewType } from './types';

const INITIAL_CAMERAS: Camera[] = [
  { id: '1', name: '01 - Main Entrance', type: CameraType.CAMERA, status: CameraStatus.RECORDING, ip: '192.168.1.101', model: 'IB9389-H', resolution: '1920x1080', temp: 24.5, smokeLevel: 2 },
  { id: '2', name: '02 - Lobby West', type: CameraType.FISHEYE, status: CameraStatus.RECORDING, ip: '192.168.1.102', model: 'FE9191', resolution: '2048x2048', temp: 23.8, smokeLevel: 1 },
  { id: '3', name: '03 - Server Room', type: CameraType.CAMERA, status: CameraStatus.ALERT, ip: '192.168.1.103', model: 'IB9389-H', resolution: '1920x1080', temp: 58.2, smokeLevel: 65 },
  { id: '4', name: '04 - Parking PTZ', type: CameraType.PTZ, status: CameraStatus.DEFAULT, ip: '192.168.1.104', model: 'SD9364-EHL', resolution: '1920x1080', temp: 21.0, smokeLevel: 0 },
  { id: '5', name: '05 - Cafeteria', type: CameraType.CAMERA, status: CameraStatus.ALERT, ip: '192.168.1.105', model: 'IB9389-H', resolution: '1920x1080', temp: 42.1, smokeLevel: 32 },
  { id: '6', name: '06 - Warehouse East', type: CameraType.CAMERA, status: CameraStatus.DISCONNECTED, ip: '192.168.1.106', model: 'IB9389-H', resolution: '1920x1080' },
  { id: '7', name: '07 - Office A', type: CameraType.CAMERA, status: CameraStatus.RECORDING, ip: '192.168.1.107', model: 'IB9389-H', resolution: '1920x1080', temp: 22.0, smokeLevel: 0 },
  { id: '8', name: '08 - Office B', type: CameraType.CAMERA, status: CameraStatus.DEFAULT, ip: '192.168.1.108', model: 'IB9389-H', resolution: '1920x1080', temp: 22.5, smokeLevel: 0 },
  { id: '9', name: '09 - Hallway South', type: CameraType.CAMERA, status: CameraStatus.RECORDING, ip: '192.168.1.109', model: 'IB9389-H', resolution: '1920x1080', temp: 23.0, smokeLevel: 0 },
  { id: '10', name: '10 - Roof Access', type: CameraType.CAMERA, status: CameraStatus.DEFAULT, ip: '192.168.1.110', model: 'IB9389-H', resolution: '1920x1080', temp: 19.0, smokeLevel: 0 },
];

const INITIAL_SCENES: Scene[] = [
  { id: 's1', name: 'Floor 01', cameraIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] }
];

const MOCK_EVENTS: FireEvent[] = [
  { id: 'e1', timestamp: '2024-05-20 10:45:32', cameraId: '3', cameraName: '03 - Server Room', type: 'HEAT' as any, severity: 'HIGH', thumbnail: 'https://picsum.photos/seed/fire1/200/150', confidence: 92.4 },
  { id: 'e2', timestamp: '2024-05-20 10:48:15', cameraId: '3', cameraName: '03 - Server Room', type: 'SMOKE', severity: 'CRITICAL', thumbnail: 'https://picsum.photos/seed/smoke1/200/150', confidence: 98.1 },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('monitor');
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [scenes, setScenes] = useState<Scene[]>(INITIAL_SCENES);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('1');
  
  const [selectedSecondaryIds, setSelectedSecondaryIds] = useState<string[]>(() => INITIAL_CAMERAS.map(c => c.id));
  
  const [layout, setLayout] = useState<LayoutType>('2x2');
  const [currentPage, setCurrentPage] = useState(1);
  const [events] = useState<FireEvent[]>(MOCK_EVENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  const alertCameras = useMemo(() => cameras.filter(c => c.status === CameraStatus.ALERT), [cameras]);
  const selectedCamera = cameras.find(c => c.id === (currentView === 'monitor' ? selectedCameraId : selectedSecondaryIds[0])) || cameras[0];

  const getPageSize = (l: LayoutType) => {
    switch (l) {
      case '1x1': return 1;
      case '2x2': return 4;
      case '3x3': return 9;
      case '1P+3': return 4;
      default: return 4;
    }
  };

  const handleSelect = (id: string) => {
    if (currentView === 'monitor') {
      setSelectedCameraId(id);
      
      const cameraIndex = cameras.findIndex(c => c.id === id);
      if (cameraIndex !== -1) {
        const pageSize = getPageSize(layout);
        const targetPage = Math.floor(cameraIndex / pageSize) + 1;
        if (targetPage !== currentPage) {
          setCurrentPage(targetPage);
        }
      }
    } else {
      setSelectedSecondaryIds(prev => 
        prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
      );
    }
  };

  // Requirement: Change layout while maintaining visibility of the selected camera
  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayout(newLayout);
    if (currentView === 'monitor') {
      const cameraIndex = cameras.findIndex(c => c.id === selectedCameraId);
      if (cameraIndex !== -1) {
        const pageSize = getPageSize(newLayout);
        const targetPage = Math.floor(cameraIndex / pageSize) + 1;
        setCurrentPage(targetPage);
      }
    }
  };

  const handleSelectScene = (scene: Scene) => {
    if (currentView === 'monitor') return;

    const sceneCameraIds = scene.cameraIds;
    const allSelected = sceneCameraIds.every(id => selectedSecondaryIds.includes(id));

    if (allSelected) {
      setSelectedSecondaryIds(prev => prev.filter(id => !sceneCameraIds.includes(id)));
    } else {
      setSelectedSecondaryIds(prev => {
        const newIds = [...prev];
        sceneCameraIds.forEach(id => {
          if (!newIds.includes(id)) newIds.push(id);
        });
        return newIds;
      });
    }
  };

  const renderMainView = () => {
    switch (currentView) {
      case 'monitor':
        return (
          <LiveViewGrid 
            layout={layout} 
            cameras={cameras} 
            selectedId={selectedCameraId}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onLayoutChange={handleLayoutChange}
            onSelect={setSelectedCameraId}
          />
        );
      case 'playback':
        return (
          <PlaybackView 
            cameras={cameras}
            selectedIds={selectedSecondaryIds}
          />
        );
      case 'gallery':
        return (
          <GalleryView 
            cameras={cameras} 
            selectedCameraIds={selectedSecondaryIds} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-[#e0e0e0] overflow-hidden select-none relative">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          events={events} 
          alertCount={alertCameras.length} 
          isEmergencyMode={isEmergencyMode}
          onToggleEmergency={() => setIsEmergencyMode(!isEmergencyMode)}
        />

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 flex flex-col border-r border-[#333] bg-[#1a1a1a]">
            <DeviceList 
              cameras={cameras} 
              scenes={scenes}
              selectedId={currentView === 'monitor' ? selectedCameraId : ''}
              selectedPlaybackIds={selectedSecondaryIds}
              isPlaybackMode={currentView !== 'monitor'}
              onSelect={handleSelect}
              onSelectScene={handleSelectScene}
              onAddTrigger={() => setIsModalOpen(true)}
              showAddButton={currentView === 'monitor'}
            />
          </div>

          <div className="flex-1 flex flex-col bg-black relative">
            {renderMainView()}
          </div>

          <div className="w-80 flex flex-col border-l border-[#333] bg-[#1a1a1a]">
            <ControlPanel 
              camera={selectedCamera} 
              layout={layout} 
              viewMode={currentView === 'monitor' ? 'monitor' : 'playback'}
              onLayoutChange={handleLayoutChange}
            />
          </div>
        </div>
      </div>

      <AddDeviceModal 
        isOpen={isModalOpen} 
        existingScenes={scenes}
        onClose={() => setIsModalOpen(false)} 
        onAdd={(cam, scene) => {
          const newId = (Math.max(...cameras.map(c => parseInt(c.id)), 0) + 1).toString();
          const camera = { ...cam, id: newId, status: CameraStatus.DEFAULT };
          setCameras(prev => [...prev, camera]);
          if (scene.id) {
            setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, cameraIds: [...s.cameraIds, newId] } : s));
          } else if (scene.newName) {
            setScenes(prev => [...prev, { id: 's' + (scenes.length + 1), name: scene.newName!, cameraIds: [newId] }]);
          }
          setIsModalOpen(false);
        }} 
      />

      {isEmergencyMode && (
        <EmergencyWarRoom 
          cameras={alertCameras} 
          onClose={() => setIsEmergencyMode(false)} 
        />
      )}
    </div>
  );
};

export default App;
