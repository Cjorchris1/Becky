
import React from 'react';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  BrainCircuit, 
  Settings, 
  Wifi, 
  Battery, 
  Navigation, 
  Cpu 
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { id: 'DASHBOARD', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'MISSION_PLANNER', label: 'Mission', icon: <MapIcon size={20} /> },
  { id: 'AI_ANALYST', label: 'AI Analyst', icon: <BrainCircuit size={20} /> },
  { id: 'SETTINGS', label: 'Settings', icon: <Settings size={20} /> },
];

export const MOCK_TELEMETRY: any[] = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}:00`,
  altitude: 100 + Math.random() * 20,
  speed: 15 + Math.random() * 5,
  battery: 85 - i,
}));
