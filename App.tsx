
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MissionPlanner from './components/MissionPlanner';
import AIAnalyst from './components/AIAnalyst';
import Settings from './components/Settings';
import { ViewMode, FlightMode, Waypoint, MissionStatus } from './types';
import { Wifi, Radio, ShieldCheck, ChevronDown, Gamepad2 } from 'lucide-react';

const FLIGHT_MODE_CONFIG: Record<FlightMode, { label: string; color: string; description: string }> = {
  [FlightMode.STABILIZE]: { label: 'STABILIZE', color: 'bg-purple-900/30 text-purple-400 border-purple-800/50', description: 'Manual control with self-leveling.' },
  [FlightMode.ALT_HOLD]: { label: 'ALT_HOLD', color: 'bg-blue-900/30 text-blue-400 border-blue-800/50', description: 'Manual control with altitude maintenance.' },
  [FlightMode.LOITER]: { label: 'LOITER', color: 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50', description: 'GPS position and altitude hold.' },
  [FlightMode.AUTO]: { label: 'AUTO', color: 'bg-indigo-900/30 text-indigo-400 border-indigo-800/50', description: 'Executing autonomous mission.' },
  [FlightMode.GUIDED]: { label: 'GUIDED', color: 'bg-indigo-900/30 text-indigo-400 border-indigo-800/50', description: 'External navigation control (GCS).' },
  [FlightMode.RTL]: { label: 'RTL', color: 'bg-amber-900/30 text-amber-400 border-amber-800/50', description: 'Returning to launch coordinates.' },
  [FlightMode.LAND]: { label: 'LAND', color: 'bg-rose-900/30 text-rose-400 border-rose-800/50', description: 'Executing vertical landing.' },
  [FlightMode.CIRCLE]: { label: 'CIRCLE', color: 'bg-teal-900/30 text-teal-400 border-teal-800/50', description: 'Orbiting current point.' },
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [currentFlightMode, setCurrentFlightMode] = useState<FlightMode>(FlightMode.LOITER);
  const [isModeSelectorOpen, setIsModeSelectorOpen] = useState(false);
  const [isFPVMode, setIsFPVMode] = useState(false);
  
  // Mission state shared across components
  const [activeMission, setActiveMission] = useState<Waypoint[] | null>(null);
  const [missionStatus, setMissionStatus] = useState<MissionStatus>(MissionStatus.IDLE);

  const handleUploadMission = (waypoints: Waypoint[]) => {
    setActiveMission(waypoints);
    setMissionStatus(MissionStatus.UPLOADED);
    setCurrentView(ViewMode.DASHBOARD);
  };

  const handleMissionAction = (action: 'EXECUTE' | 'DELETE') => {
    if (action === 'DELETE') {
      setActiveMission(null);
      setMissionStatus(MissionStatus.IDLE);
      if (currentFlightMode === FlightMode.AUTO) {
        setCurrentFlightMode(FlightMode.LOITER);
      }
    } else if (action === 'EXECUTE') {
      setMissionStatus(MissionStatus.RUNNING);
      setCurrentFlightMode(FlightMode.AUTO);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case ViewMode.DASHBOARD:
        return (
          <Dashboard 
            isFPVMode={isFPVMode} 
            activeMission={activeMission} 
            missionStatus={missionStatus}
            onMissionAction={handleMissionAction}
          />
        );
      case ViewMode.MISSION_PLANNER:
        return (
          <MissionPlanner 
            onUploadMission={handleUploadMission} 
          />
        );
      case ViewMode.AI_ANALYST:
        return <AIAnalyst />;
      case ViewMode.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard 
          isFPVMode={isFPVMode} 
          activeMission={activeMission} 
          missionStatus={missionStatus}
          onMissionAction={handleMissionAction}
        />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#0a0a0a] text-zinc-200 overflow-hidden font-sans">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header bar */}
        <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-8 bg-zinc-900/30 backdrop-blur-md z-30">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">UNIT_ID</span>
                <span className="text-xs text-indigo-400 font-mono bg-indigo-950/30 px-2 py-0.5 rounded border border-indigo-800/30 italic">BECKY-01-TAC</span>
             </div>
             <div className="h-4 w-px bg-zinc-800" />
             
             {/* Dynamic Flight Mode Selector */}
             <div className="relative">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">CONTROL_LOGIC</span>
                  <button 
                    onClick={() => setIsModeSelectorOpen(!isModeSelectorOpen)}
                    className={`flex items-center gap-2 px-3 py-1 rounded border text-xs font-black transition-all hover:brightness-125 ${FLIGHT_MODE_CONFIG[currentFlightMode].color}`}
                  >
                    {FLIGHT_MODE_CONFIG[currentFlightMode].label}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isModeSelectorOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {isModeSelectorOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsModeSelectorOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-40 overflow-hidden p-1 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-3 border-b border-zinc-800/50">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Switch Mode</span>
                      </div>
                      {Object.entries(FLIGHT_MODE_CONFIG).map(([mode, config]) => (
                        <button
                          key={mode}
                          onClick={() => {
                            setCurrentFlightMode(mode as FlightMode);
                            setIsModeSelectorOpen(false);
                          }}
                          className={`w-full flex flex-col items-start p-3 rounded-xl transition-all hover:bg-zinc-800 text-left group ${currentFlightMode === mode ? 'bg-zinc-800/50' : ''}`}
                        >
                          <div className="flex items-center justify-between w-full mb-0.5">
                            <span className={`text-[11px] font-black tracking-tight ${config.color.split(' ')[1]}`}>{config.label}</span>
                            {currentFlightMode === mode && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                          </div>
                          <span className="text-[10px] text-zinc-500 leading-tight">{config.description}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
             </div>

             <div className="h-4 w-px bg-zinc-800" />

             {/* FPV Mode Toggle */}
             <div className="flex items-center gap-3">
               <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">RC_LINK</span>
               <button 
                onClick={() => setIsFPVMode(!isFPVMode)}
                className={`group relative flex items-center h-7 w-12 rounded-full transition-all duration-300 ${isFPVMode ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-zinc-800'}`}
               >
                 <div className={`absolute left-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center ${isFPVMode ? 'translate-x-5' : 'translate-x-0'}`}>
                    <Gamepad2 size={12} className={isFPVMode ? 'text-amber-600' : 'text-zinc-400'} />
                 </div>
               </button>
               {isFPVMode && (
                 <span className="text-[10px] font-black text-amber-500 animate-pulse">JOYSTICK OVERRIDE</span>
               )}
             </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700/50">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">BECKY Secure Tunnel</span>
             </div>
             <button className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-xl text-xs font-black tracking-widest transition-all shadow-lg shadow-red-900/20 active:scale-95">
                DISARM
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {renderView()}
          
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        </div>
      </main>
    </div>
  );
};

export default App;
