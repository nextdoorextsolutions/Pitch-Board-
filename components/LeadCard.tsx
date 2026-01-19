
import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lead, LeadStatus } from '../types';

interface LeadCardProps {
  lead: Lead;
  onCall: (lead: Lead) => void;
  onMap: (lead: Lead) => void;
  onAction: (lead: Lead) => void;
}

// Fix: Updated status keys to match LeadStatus type and added missing statuses to handle all valid LeadStatus values
const getActionIcon = (status: LeadStatus) => {
  switch (status) {
    case 'LEAD': return 'fa-arrow-up-from-bracket';
    case 'APPOINTMENT_SET': return 'fa-calendar-days text-[#4ade80]';
    case 'PROSPECT': return 'fa-file-lines text-[#22d3ee]';
    case 'CLOSING_TRIGGER': return 'fa-arrows-rotate text-[#22d3ee]';
    case 'APPROVED': return 'fa-check text-emerald-500';
    case 'PROJECT_SCHEDULED': return 'fa-calendar-check text-[#4ade80]';
    case 'COMPLETED': return 'fa-house-circle-check text-emerald-600';
    case 'INVOICED': return 'fa-file-invoice-dollar text-lime-500';
    case 'CLOSED_DEAL': return 'fa-handshake text-yellow-500';
    default: return 'fa-plus';
  }
};

const getBadgeStyles = (lead: Lead) => {
  if (lead.financingType === 'INSURANCE') return 'bg-[#22d3ee]/20 text-[#22d3ee] border-[#22d3ee]/30';
  if (lead.financingType === 'CASH') return 'bg-[#4ade80]/20 text-[#4ade80] border-[#4ade80]/30';
  if (lead.financingType === 'FINANCED') return 'bg-[#c084fc]/20 text-[#c084fc] border-[#c084fc]/30';
  return 'bg-slate-100 text-slate-600 border-slate-200';
};

const LeadCard: React.FC<LeadCardProps> = ({ lead, onCall, onMap, onAction }) => {
  const [isJustDropped, setIsJustDropped] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
  };

  useEffect(() => {
    const lastActive = new Date(lead.lastActivityAt).getTime();
    const now = new Date().getTime();
    if (now - lastActive < 800) {
      setIsJustDropped(true);
      const timer = setTimeout(() => setIsJustDropped(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [lead.status, lead.lastActivityAt]);

  const now = new Date().getTime();
  const lastActive = new Date(lead.lastActivityAt).getTime();
  const diffDays = (now - lastActive) / (1000 * 3600 * 24);
  
  const isRotting = diffDays >= 7;
  const isStale = diffDays >= 3 && diffDays < 7;

  let healthBorder = 'border-transparent';
  let cardOpacity = 'opacity-100';

  if (isRotting) {
    healthBorder = 'border-red-500/80';
    cardOpacity = 'opacity-90 shadow-[0_0_20px_rgba(239,68,68,0.1)]';
  } else if (isStale) {
    healthBorder = 'border-orange-400/80';
  }

  const badgeText = lead.financingType === 'INSURANCE' 
    ? lead.insuranceCarrier 
    : lead.financingType === 'CASH' ? 'Cash Bid' : 'Financed';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-2xl p-4 mb-4 shadow-xl transition-all border-2 ${healthBorder} ${cardOpacity} ${isDragging ? 'opacity-30' : ''} ${isJustDropped ? 'animate-drop animate-highlight' : ''}`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing select-none">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h4 className="font-bold text-slate-900 text-base md:text-lg leading-tight truncate">{lead.name}</h4>
          {isRotting && (
             <span title="Rotting Lead (> 7 Days)" className="text-red-500 animate-pulse shrink-0">
                <i className="fa-solid fa-clock-rotate-left text-xs"></i>
             </span>
          )}
        </div>
        <p className="text-slate-500 text-xs md:text-sm mb-3 truncate">{lead.address}</p>
        
        <div className="mb-3 flex flex-wrap gap-1">
          <span className={`px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider border ${getBadgeStyles(lead)}`}>
            {badgeText}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider border border-slate-100 text-slate-400 bg-slate-50">
            {lead.value}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-1">
        <button 
          onClick={(e) => { e.stopPropagation(); onCall(lead); }} 
          className="flex-1 flex justify-center py-2 text-[#22d3ee] active:bg-[#22d3ee]/10 rounded-xl transition-colors"
        >
          <i className="fa-solid fa-phone text-lg md:text-xl"></i>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onMap(lead); }} 
          className="flex-1 flex justify-center py-2 text-[#22d3ee] active:bg-[#22d3ee]/10 rounded-xl transition-colors"
        >
          <i className="fa-solid fa-map-location-dot text-lg md:text-xl"></i>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onAction(lead); }} 
          className="flex-1 flex justify-center py-2 active:bg-slate-100 rounded-xl transition-colors"
        >
          <i className={`fa-solid ${getActionIcon(lead.status)} text-lg md:text-xl`}></i>
        </button>
      </div>
    </div>
  );
};

export default LeadCard;
