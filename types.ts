
export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  MISSION_PLANNER = 'MISSION_PLANNER',
  AI_ANALYST = 'AI_ANALYST',
  SETTINGS = 'SETTINGS',
}

export enum FlightMode {
  STABILIZE = 'STABILIZE',
  ALT_HOLD = 'ALT_HOLD',
  LOITER = 'LOITER',
  AUTO = 'AUTO',
  GUIDED = 'GUIDED',
  RTL = 'RTL',
  LAND = 'LAND',
  CIRCLE = 'CIRCLE',
}

export enum MissionStatus {
  IDLE = 'IDLE',
  UPLOADED = 'UPLOADED',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
}

export interface NetworkInfo {
  type: '4G' | '5G' | 'LTE' | 'WiFi';
  latency: number; // ms
  signalStrength: number; // dBm
  packetLoss: number;
}

export interface DeviceHardwareStatus {
  id: string;
  name: string;
  battery: number;
  temperature: number;
  cameraActive: boolean;
  flashlight: boolean;
  network: NetworkInfo;
}

export interface TelemetryData {
  altitude: number;
  groundSpeed: number;
  airSpeed: number;
  throttle: number;
  battery: number;
  hdop: number;
  satellites: number;
  pitch: number;
  roll: number;
  yaw: number;
  mavlinkHeartbeat: boolean;
  flightMode: FlightMode;
  onboardDevice: DeviceHardwareStatus;
  gcsDevice: DeviceHardwareStatus;
  fpvControlActive: boolean;
  activeMission: Waypoint[] | null;
  missionStatus: MissionStatus;
}

export type WaypointAction = 
  | 'WAYPOINT' 
  | 'TAKEOFF' 
  | 'LAND' 
  | 'RTL' 
  | 'SERVO_OPEN' 
  | 'SERVO_CLOSE' 
  | 'LOITER' 
  | 'SURVEY_GRID' 
  | 'SPRAY_START' 
  | 'SPRAY_STOP';

export interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  alt: number; 
  action: WaypointAction;
  speed?: number; 
  param1?: number; 
  param2?: number; 
  isEditing?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ServerConfig {
  serverUrl: string;
  accessCode: string;
  groupId: string;
  isLocal: boolean;
  port: string;
}
