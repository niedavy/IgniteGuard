
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { FireEvent, Camera } from '../types';
import { Search, Filter, Calendar as CalendarIcon, Download, Maximize2, ShieldAlert, Thermometer, Wind, Loader2 } from 'lucide-react';

interface GalleryViewProps {
  cameras: Camera[];
  selectedCameraIds: string[];
}

// Helper to generate mock data for performance testing
const generateMockEvents = (count: number, cameras: Camera[]): FireEvent[] => {
  return Array.from({ length: count }).map((_, i) => {
    const cam = cameras[Math.floor(Math.random() * cameras.length)];
    const date = new Date();
    date.setMinutes(date.getMinutes() - i * 5); // 5 mins interval
    
    return {
      id: `evt-${i}`,
      timestamp: date.toLocaleString(),
      cameraId: cam.id,
      cameraName: cam.name,
      type: i % 3 === 0 ? 'FLAME' : (i % 2 === 0 ? 'SMOKE' : 'HEAT'),
      severity: i % 10 === 0 ? 'CRITICAL' : (i % 5 === 0 ? 'HIGH' : 'MEDIUM'),
      thumbnail: `https://picsum.photos/seed/fire-${i}/400/225`,
      confidence: 85 + Math.random() * 14
    };
  });
};

const EventCard = React.memo(({ event }: { event: FireEvent }) => (
  <div className="bg-[#1a1a1a] border border-[#333] rounded overflow-hidden hover:border-red-500/50 transition-all group shadow-lg flex flex-col">
    <div className="relative aspect-video bg-black overflow-hidden">
      <img 
        src={event.thumbnail} 
        loading="lazy"
        alt={event.cameraName}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
      />
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform">
        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-bold py-1 rounded flex items-center justify-center gap-1">
          <Maximize2 size={10} /> VIEW FOOTAGE
        </button>
      </div>
    </div>
    <div className="p-2 space-y-1">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold text-gray-200 truncate flex-1 pr-2">{event.cameraName}</span>
        <span className="text-[9px] text-blue-400 font-mono">{event.confidence.toFixed(1)}%</span>
      </div>
      <div className="flex justify-between items-center text-[9px] text-gray-500">
        <span className="font-mono">{event.timestamp.split(', ')[1]}</span>
        <span className="text-gray-600">{event.timestamp.split(', ')[0]}</span>
      </div>
    </div>
  </div>
));

const GalleryView: React.FC<GalleryViewProps> = ({ cameras, selectedCameraIds }) => {
  const [allEvents] = useState(() => generateMockEvents(2000, cameras));
  const [visibleCount, setVisibleCount] = useState(40);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef(null);

  const filteredEvents = useMemo(() => {
    if (selectedCameraIds.length === 0) return allEvents;
    return allEvents.filter(e => selectedCameraIds.includes(e.cameraId));
  }, [allEvents, selectedCameraIds]);

  const displayedEvents = useMemo(() => {
    return filteredEvents.slice(0, visibleCount);
  }, [filteredEvents, visibleCount]);

  // Group events by hour for better readability
  const groupedEvents = useMemo(() => {
    const groups: Record<string, FireEvent[]> = {};
    displayedEvents.forEach(event => {
      const date = event.timestamp.split(', ')[0];
      const hour = event.timestamp.split(', ')[1].split(':')[0] + ':00';
      const key = `${date} ${hour}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(event);
    });
    return groups;
  }, [displayedEvents]);

  const loadMore = useCallback(() => {
    if (visibleCount < filteredEvents.length) {
      setLoading(true);
      setTimeout(() => {
        setVisibleCount(prev => prev + 40);
        setLoading(false);
      }, 400);
    }
  }, [visibleCount, filteredEvents.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore, loading]);

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] overflow-hidden">
      {/* Gallery Header */}
      <div className="h-12 bg-[#1a1a1a] border-b border-[#333] flex items-center justify-between px-4 shrink-0 shadow-md">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ShieldAlert size={18} className="text-red-500" />
            <h2 className="text-sm font-bold tracking-tight">AI INCIDENT LOGS</h2>
          </div>
          <div className="h-4 w-[1px] bg-[#333]"></div>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            Total Detections: {filteredEvents.length}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search timestamp or type..." 
              className="bg-black/40 border border-[#333] rounded-full px-9 py-1.5 text-xs w-64 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <button className="p-2 hover:bg-[#252525] rounded-full text-gray-400 hover:text-white transition-colors">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
        {Object.entries(groupedEvents).map(([timeLabel, events]) => (
          <div key={timeLabel} className="mb-8">
            <div className="flex items-center gap-4 mb-4 sticky top-0 bg-[#0a0a0a] py-2 z-10">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">
                {timeLabel}
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#333] to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        ))}

        {/* Loading Indicator & Observer Target */}
        <div ref={observerTarget} className="py-10 flex flex-col items-center justify-center text-gray-600 gap-2">
          {loading ? (
            <>
              <Loader2 size={24} className="animate-spin text-blue-500" />
              <span className="text-[10px] uppercase font-bold tracking-widest">Fetching next batch...</span>
            </>
          ) : visibleCount >= filteredEvents.length ? (
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-30">End of Incident History</span>
          ) : null}
        </div>
      </div>

      {/* Gallery Stats Bar */}
      <div className="h-8 bg-[#111] border-t border-[#333] flex items-center px-4 justify-between shrink-0">
        <div className="flex space-x-4">
           {/* Labels removed per request */}
        </div>
        <div className="text-[9px] text-gray-600 uppercase font-bold">
          AI Confidence: High (`{'>'}`85%)
        </div>
      </div>
    </div>
  );
};

export default GalleryView;
