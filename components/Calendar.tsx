
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  onDateSelect: (date: number | null) => void;
  selectedDate: number;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, selectedDate }) => {
  // Mock data: Days in May 2024 that have fire events
  // Only these days will be interactive
  const fireEventDays = [3, 12, 20, 21, 28];
  
  const daysInMonth = 31;
  const startDay = 3; // Wednesday for May 2024
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const handleDayClick = (day: number) => {
    if (day === selectedDate) {
      onDateSelect(null); // Deselect if clicking the same day
    } else {
      onDateSelect(day);
    }
  };

  return (
    <div className="bg-[#111] border border-[#333] rounded-md p-3 select-none">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">May 2024</span>
        <div className="flex space-x-1">
          <button className="p-1 hover:bg-[#222] rounded transition-colors text-gray-600 hover:text-white">
            <ChevronLeft size={14} />
          </button>
          <button className="p-1 hover:bg-[#222] rounded transition-colors text-gray-600 hover:text-white">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {weekDays.map(d => (
          <span key={d} className="text-[9px] font-bold text-gray-600">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {blanks.map(b => (
          <div key={`b-${b}`} className="h-7" />
        ))}
        {days.map(day => {
          const isFireDay = fireEventDays.includes(day);
          const isSelected = selectedDate === day;
          const isToday = day === 20;

          return (
            <div
              key={day}
              onClick={() => isFireDay && handleDayClick(day)}
              className={`
                h-7 flex items-center justify-center text-[10px] font-medium rounded transition-all relative
                ${isFireDay 
                  ? 'bg-red-600 text-white font-black shadow-[0_0_12px_rgba(220,38,38,0.3)] hover:bg-red-500 cursor-pointer active:scale-90 z-10' 
                  : 'text-gray-700 cursor-default pointer-events-none'}
                ${isSelected ? 'ring-2 ring-white ring-inset scale-105' : ''}
              `}
            >
              {day}
              {isToday && !isSelected && (
                <div className="absolute -bottom-0.5 w-1 h-1 bg-blue-500 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-[#222] flex items-center justify-between px-1">
          <div className="flex items-center space-x-1.5">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_5px_rgba(220,38,38,1)]"></div>
              <span className="text-[8px] text-gray-400 font-bold uppercase tracking-tight">Selectable Event Day</span>
          </div>
          <div className="flex items-center space-x-1.5">
              <span className="text-[8px] text-gray-600 uppercase font-bold italic">Other days disabled</span>
          </div>
      </div>
    </div>
  );
};

export default Calendar;
