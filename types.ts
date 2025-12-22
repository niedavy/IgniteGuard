
export enum CameraStatus {
  DEFAULT = 'DEFAULT',
  RECORDING = 'RECORDING',
  DISCONNECTED = 'DISCONNECTED',
  ALERT = 'ALERT'
}

export enum CameraType {
  CAMERA = 'CAMERA',
  FISHEYE = 'FISHEYE',
  PTZ = 'PTZ'
}

export interface Camera {
  id: string;
  name: string;
  type: CameraType;
  status: CameraStatus;
  ip: string;
  model: string;
  resolution: string;
  temp?: number;
  smokeLevel?: number;
}

export interface Scene {
  id: string;
  name: string;
  cameraIds: string[];
}

export interface FireEvent {
  id: string;
  timestamp: string;
  cameraId: string;
  cameraName: string;
  type: 'FLAME' | 'SMOKE' | 'HEAT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  thumbnail: string;
  confidence: number;
}

export type LayoutType = '1x1' | '2x2' | '3x3' | '1P+3' | '1M+5';
export type ViewType = 'monitor' | 'playback' | 'gallery';
