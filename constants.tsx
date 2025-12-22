
import React from 'react';
import { 
  Camera as CameraIcon, 
  Eye, 
  Gamepad2, 
  Video, 
  AlertTriangle, 
  Circle, 
  XCircle 
} from 'lucide-react';
import { CameraType, CameraStatus } from './types';

export const THEME_COLORS = {
  bg_dark: '#0f0f0f',
  bg_panel: '#1a1a1a',
  primary: '#3b82f6',
  danger: '#ef4444',
  warning: '#f59e0b',
  success: '#10b981',
  border: '#333333'
};

export const getCameraTypeIcon = (type: CameraType) => {
  switch (type) {
    case CameraType.CAMERA: return <CameraIcon size={16} />;
    case CameraType.FISHEYE: return <Eye size={16} />;
    case CameraType.PTZ: return <Gamepad2 size={16} />;
  }
};

export const getStatusIcon = (status: CameraStatus) => {
  switch (status) {
    case CameraStatus.RECORDING: return <Circle size={8} fill="#ef4444" className="text-red-500 animate-pulse" />;
    case CameraStatus.DISCONNECTED: return <XCircle size={12} className="text-gray-600" />;
    case CameraStatus.ALERT: return <AlertTriangle size={12} className="text-yellow-500 animate-bounce" />;
    default: return null;
  }
};
