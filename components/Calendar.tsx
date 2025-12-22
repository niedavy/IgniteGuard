
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  onDateSelect: (date: number) => void;
  selectedDate: number;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, selectedDate }) => {
  // Mock data: Days in May 2024 that have fire events
  const fireEventDays = [3, 12, 20, 21, 28];
  
  const daysInMonth = 31;
  const startDay = 3; // Wednesday for May 2024
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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
              onClick={() => onDateSelect(day)}
              className={`
                h-7 flex items-center justify-center text-[10px] font-medium cursor-pointer rounded transition-all
                ${isFireDay 
                  ? 'bg-red-600 text-white font-bold shadow-[0_0_10px_rgba(220,38,38,0.4)] hover:bg-red-500' 
                  : isSelected 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-500 hover:bg-[#222] hover:text-white'}
                ${isToday && !isFireDay ? 'border border-blue-500' : ''}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
      
      <div className="mt-3 flex items-center justify-between px-1">
          <div className="flex items-center space-x-1.5">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
              <span className="text-[8px] text-gray-500 uppercase">Fire Event</span>
          </div>
          <div className="flex items-center space-x-1.5">
              <div className="w-1.5 h-1.5 border border-blue-500 rounded-full"></div>
              <span className="text-[8px] text-gray-500 uppercase">Current</span>
          </div>
      </div>
    </div>
  );
};

export default Calendar;
