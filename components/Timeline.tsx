
import React, { useState, useMemo, useRef, WheelEvent, useLayoutEffect } from 'react';
import { Activity, Search, ShieldAlert, ZoomIn, ZoomOut, Clock } from 'lucide-react';
import { Camera } from '../types';

interface TimelineProps {
  isMultiTrack?: boolean;
  cameras?: Camera[];
  selectedIds?: string[];
  activeDate?: string;
}

const Timeline: React.FC<TimelineProps> = ({ 
  isMultiTrack = false, 
  cameras = [], 
  selectedIds, 
  activeDate = '2024-05-20' 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(2.7); // 默认截图中的 2.7x
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sidebarWidth = 160; 
  
  // 用于记录缩放瞬间的锚点状态，防止重绘闪烁
  const zoomAnchorRef = useRef<{ percent: number; x: number } | null>(null);

  // 模拟报警数据
  const camerasWithFireAlarms = ['3', '2', '5']; 

  const filteredCameras = useMemo(() => {
    return cameras.filter(cam => {
      const matchesSearch = cam.name.toLowerCase().includes(searchQuery.toLowerCase());
      const hasAlarm = camerasWithFireAlarms.includes(cam.id);
      const isSelected = selectedIds ? (selectedIds.length > 0 ? selectedIds.includes(cam.id) : true) : true;
      return matchesSearch && hasAlarm && isSelected;
    });
  }, [cameras, searchQuery, selectedIds]);

  // 使用 useLayoutEffect 在 DOM 更新后、浏览器绘制前同步调整滚动条
  useLayoutEffect(() => {
    if (zoomAnchorRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const contentWidth = container.scrollWidth - sidebarWidth;
      // 计算新的滚动位置：(锚点百分比 * 新内容宽度) - 鼠标相对容器的位移
      const newScrollLeft = (zoomAnchorRef.current.percent * contentWidth) - zoomAnchorRef.current.x;
      container.scrollLeft = newScrollLeft;
      // 重置锚点
      zoomAnchorRef.current = null;
    }
  }, [zoomLevel]);

  const handleWheel = (e: WheelEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // 接管滚动，实现无按键直接缩放
    e.preventDefault();

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    // 如果鼠标在左侧侧边栏，仅处理垂直滚动
    if (mouseX < sidebarWidth) {
      container.scrollTop += e.deltaY;
      return;
    }

    const trackMouseX = mouseX - sidebarWidth;
    const scrollLeft = container.scrollLeft;
    const contentWidth = container.scrollWidth - sidebarWidth;
    
    // 记录缩放前的锚点百分比（0.0 - 1.0）
    const cursorPointPercent = (scrollLeft + trackMouseX) / contentWidth;

    const zoomFactor = 0.1;
    const delta = e.deltaY > 0 ? -zoomFactor : zoomFactor;
    // 采用乘法增长使缩放感更线性平滑
    const nextZoom = Math.max(1, Math.min(50, zoomLevel * (1 + delta)));
    
    if (nextZoom !== zoomLevel) {
      zoomAnchorRef.current = { percent: cursorPointPercent, x: trackMouseX };
      setZoomLevel(nextZoom);
    }
  };

  const renderEventBars = (id: string) => {
    const events = [
      { start: 40, width: 2, color: 'bg-red-600/80' },
      { start: 70, width: 1.5, color: 'bg-red-600/80' },
    ];

    return events.map((ev, idx) => (
      <div 
        key={idx}
        style={{ left: `${ev.start}%`, width: `${ev.width}%` }}
        className={`absolute top-0 bottom-0 ${ev.color} shadow-[0_0_15px_rgba(220,38,38,0.4)] z-10`}
      ></div>
    ));
  };

  const timeMarkers = useMemo(() => {
    const markers = [];
    const totalHours = 12; // 07:00 to 19:00
    
    let step = 1;
    if (zoomLevel > 3) step = 0.5;
    if (zoomLevel > 8) step = 1/6;
    if (zoomLevel > 20) step = 1/12;

    for (let i = 0; i <= totalHours; i += step) {
      const hour = Math.floor(7 + i);
      const mins = Math.round((i % 1) * 60);
      const label = `${hour.toString().padStart(2, '0')}:00`;
      const isMajor = mins === 0;
      
      markers.push({
        pos: (i / totalHours) * 100,
        label,
        isMajor
      });
    }
    return markers;
  }, [zoomLevel]);

  return (
    <div 
      className={`
        ${isMultiTrack ? 'max-h-[40%] h-auto min-h-[220px]' : 'h-40'} 
        bg-[#080808] border-t border-[#222] flex flex-col select-none z-40 relative shadow-[0_-10px_30px_rgba(0,0,0,0.5)]
      `}
      onWheel={handleWheel}
    >
      {/* 顶部控制面板 - 依照截图还原 */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1a1a1a] bg-[#0c0c0c] shrink-0">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
             <div className="p-1.5 bg-red-900/20 rounded border border-red-600/20">
                <ShieldAlert size={14} className="text-red-500" />
             </div>
             <div className="flex flex-col">
               <span className="text-gray-400 uppercase tracking-widest text-[9px] font-black leading-none mb-1">Fire Analytics Stream</span>
               <span className="text-blue-500 text-[10px] font-bold leading-none">{activeDate}</span>
             </div>
          </div>

          <div className="h-6 w-[1px] bg-[#222]"></div>

          <div className="flex items-center bg-black/60 rounded border border-[#222] p-0.5 space-x-1">
            <button 
              onClick={() => setZoomLevel(prev => Math.max(1, prev * 0.8))}
              className="p-1 hover:bg-white/5 rounded text-gray-600 hover:text-white transition-colors"
            >
              <ZoomOut size={14} />
            </button>
            <div className="px-3 text-[10px] font-mono font-black text-blue-400 min-w-[45px] text-center border-x border-[#222]">
              {zoomLevel.toFixed(1)}x
            </div>
            <button 
              onClick={() => setZoomLevel(prev => Math.min(50, prev * 1.2))}
              className="p-1 hover:bg-white/5 rounded text-gray-600 hover:text-white transition-colors"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          <div className="flex items-center space-x-2 text-[10px] text-gray-600">
            <Clock size={12} className="opacity-50" />
            <span>Scroll to zoom at mouse pointer</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600" />
            <input 
              type="text" 
              placeholder="Filter channels..." 
              className="bg-black/80 border border-[#222] rounded-full px-8 py-1.5 text-[10px] focus:outline-none focus:border-blue-500/30 w-44 transition-all placeholder:text-gray-700 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 滚动区 */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar relative flex bg-[#050505]"
      >
        {/* 固定侧边栏 */}
        <div className="w-40 sticky left-0 z-30 bg-[#0c0c0c] border-r border-[#1a1a1a] flex flex-col shadow-[20px_0_40px_rgba(0,0,0,0.9)]">
          <div className="h-7 border-b border-[#1a1a1a] shrink-0"></div>
          <div className="flex-1">
             {filteredCameras.map(camera => (
                <div key={camera.id} className="h-10 border-b border-[#141414] flex flex-col justify-center px-4 hover:bg-white/[0.02] transition-colors shrink-0">
                   <div className="flex items-center space-x-2">
                      <div className={`w-1 h-1 rounded-full ${camera.status === 'ALERT' ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'bg-blue-500'}`}></div>
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tight truncate">
                        {camera.name}
                      </span>
                   </div>
                   <span className="text-[8px] text-gray-600 font-mono mt-0.5 ml-3 opacity-60">{camera.ip}</span>
                </div>
             ))}
          </div>
        </div>

        {/* 时间轴轨道 */}
        <div 
          className="relative shrink-0 flex flex-col"
          style={{ width: `${100 * zoomLevel}%`, minWidth: '100%' }}
        >
          {/* 时间标尺刻度 */}
          <div className="h-7 flex border-b border-[#1a1a1a] bg-black/40 sticky top-0 z-20 backdrop-blur-sm">
             {timeMarkers.map((marker, i) => (
               <div 
                key={i} 
                className={`absolute h-full border-l ${marker.isMajor ? 'border-gray-800' : 'border-gray-900/30'} flex items-end pb-1.5 pl-1.5`}
                style={{ left: `${marker.pos}%` }}
               >
                 {marker.isMajor && (
                   <span className="text-[9px] font-mono leading-none text-gray-500 font-bold">
                     {marker.label}
                   </span>
                 )}
               </div>
             ))}
          </div>

          {/* 背景纵向网格 */}
          <div className="absolute inset-0 pointer-events-none">
             {timeMarkers.filter(m => m.isMajor).map((m, i) => (
               <div key={i} className="absolute h-full border-l border-white/[0.02]" style={{ left: `${m.pos}%` }}></div>
             ))}
          </div>

          {/* 事件轨道内容 */}
          <div className="flex-1 flex flex-col">
             {filteredCameras.map(camera => (
                <div key={camera.id} className="h-10 w-full border-b border-[#141414] relative group/track">
                   {renderEventBars(camera.id)}
                </div>
             ))}
          </div>
        </div>
      </div>
      
      {/* 底部状态栏 - 完全参照截图细节 */}
      <div className="h-7 bg-[#0c0c0c] border-t border-[#1a1a1a] shrink-0 flex items-center px-4 justify-between">
         <div className="flex items-center space-x-4">
            <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">Chronos Engine 2.0</span>
            <div className="h-3 w-[1px] bg-[#222]"></div>
            <span className="text-[8px] text-gray-600 uppercase font-bold">
               Viewing: {Math.round(12 / zoomLevel * 60)}m span
            </span>
         </div>
         <div className="flex items-center">
            <div className="flex items-center space-x-2">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
               <span className="text-[8px] text-green-500 font-black uppercase tracking-widest">
                 Storage Sync Active
               </span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Timeline;
