
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Lead, Column } from '../types';
import LeadCard from './LeadCard';

interface BoardColumnProps {
  column: Column;
  leads: Lead[];
  onCall: (lead: Lead) => void;
  onMap: (lead: Lead) => void;
  onAction: (lead: Lead) => void;
}

const BoardColumn: React.FC<BoardColumnProps> = ({ column, leads, onCall, onMap, onAction }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className={`flex flex-col w-[calc(100vw-64px)] sm:w-[320px] shrink-0 h-full bg-[#0a0f1e]/40 border-2 rounded-2xl ${column.borderColor} shadow-lg shadow-black/20 overflow-hidden`}>
      {/* Column Header */}
      <div className="p-3 md:p-4 text-center border-b border-white/5 bg-white/5 backdrop-blur-sm shrink-0">
        <h3 className="font-bold text-white text-sm md:text-base tracking-wide whitespace-nowrap overflow-hidden text-ellipsis uppercase">
          {column.title}
        </h3>
      </div>

      {/* Cards Area - Independent Vertical Scroll */}
      <div 
        ref={setNodeRef}
        className="flex-1 px-3 py-3 md:px-4 md:py-4 overflow-y-auto scrollbar-hide no-scrollbar touch-pan-y"
      >
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <LeadCard 
              key={lead.id} 
              lead={lead} 
              onCall={onCall} 
              onMap={onMap} 
              onAction={onAction} 
            />
          ))}
        </SortableContext>
        {leads.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/10 rounded-2xl text-white/20">
            <i className="fa-solid fa-layer-group text-2xl mb-2"></i>
            <span className="text-[10px] uppercase tracking-widest font-black">Empty Stage</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardColumn;
