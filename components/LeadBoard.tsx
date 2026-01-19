
import React, { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Lead, LeadStatus, PipelineType } from '../types';
import { COLUMNS, CARRIERS, SOURCES } from '../constants';
import { INITIAL_LEADS } from '../services/mockData';
import BoardColumn from './BoardColumn';
import LeadCard from './LeadCard';
import ConversionModal from './ConversionModal';

const SidebarItem: React.FC<{ icon: string; label: string; active?: boolean }> = ({ icon, label, active = false }) => (
  <div className={`px-2 py-3 md:px-4 cursor-pointer flex flex-col md:flex-row items-center gap-1 md:gap-4 transition-all hover:bg-white/5 ${active ? 'text-[#22d3ee]' : 'text-slate-500 hover:text-slate-300'}`}>
    <div className="w-8 flex justify-center shrink-0">
      <i className={`fa-solid ${icon} text-lg md:text-xl`}></i>
    </div>
    <span className="text-[10px] md:text-sm font-semibold whitespace-nowrap md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex-1">{label}</span>
  </div>
);

const SummaryCard = ({ title, count, icon, colorClass }: { title: string, count: number, icon: string, colorClass: string }) => (
  <div className={`flex-1 min-w-[200px] bg-[#0a0f1e] border-2 rounded-2xl p-6 flex items-center gap-4 shadow-xl transition-all hover:border-white/20 ${colorClass}`}>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-opacity-10 border border-opacity-20 ${colorClass.replace('border-', 'bg-').replace('border-', 'border-')}`}>
      <i className={`fa-solid ${icon} text-xl`}></i>
    </div>
    <div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-3xl font-black text-white">{count}</p>
    </div>
  </div>
);

const PipelineOverview = ({ leads, currentPipeline, onNavigate }: { leads: Lead[], currentPipeline: PipelineType, onNavigate: (p: PipelineType) => void }) => {
  const stages = [
    { id: 'LEAD', label: 'Lead', p: 'PITCH' as PipelineType },
    { id: 'APPOINTMENT_SET', label: 'Appointment Set', p: 'PITCH' as PipelineType },
    { id: 'PROSPECT', label: 'Prospect', p: 'PITCH' as PipelineType },
    { id: 'APPROVED', label: 'Approved', p: 'PRODUCTION' as PipelineType },
    { id: 'PROJECT_SCHEDULED', label: 'Project Scheduled', p: 'PRODUCTION' as PipelineType },
    { id: 'COMPLETED', label: 'Completed', p: 'PRODUCTION' as PipelineType },
    { id: 'INVOICED', label: 'Invoiced', p: 'PRODUCTION' as PipelineType },
    { id: 'CLOSED_DEAL', label: 'Closed Deal', p: 'PRODUCTION' as PipelineType },
  ];

  return (
    <div className="px-8 py-6">
      <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tighter">Pipeline Overview</h2>
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide no-scrollbar pb-4">
        {stages.map((stage, i) => {
          const count = leads.filter(l => l.status === stage.id).length;
          const isActive = currentPipeline === stage.p;
          return (
            <React.Fragment key={stage.id}>
              <button 
                onClick={() => onNavigate(stage.p)}
                className={`flex flex-col items-start p-3 rounded-xl border-2 transition-all min-w-[140px] ${isActive ? 'bg-[#22d3ee]/10 border-[#22d3ee]' : 'bg-[#0a0f1e] border-white/5 opacity-50 hover:opacity-100'}`}
              >
                <span className={`text-[10px] font-black uppercase tracking-tighter mb-2 ${isActive ? 'text-[#22d3ee]' : 'text-slate-500'}`}>{stage.label}</span>
                <span className="text-2xl font-black text-white">{count}</span>
              </button>
              {i < stages.length - 1 && <i className="fa-solid fa-chevron-right text-slate-700 text-xs mx-1"></i>}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const LeadBoard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [conversionLead, setConversionLead] = useState<Lead | null>(null);
  const [pipelineView, setPipelineView] = useState<PipelineType>('PITCH');
  const boardRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 300, tolerance: 8 } }),
  );

  const activeLead = activeId ? leads.find(l => l.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) { setActiveId(null); return; }
    
    const overId = over.id;
    if (overId === 'CLOSING_TRIGGER') {
      const lead = leads.find(l => l.id === active.id);
      if (lead) setConversionLead(lead);
      setActiveId(null);
      return;
    }

    if (COLUMNS.some(c => c.id === overId)) {
      setLeads(prev => prev.map(l => l.id === active.id ? { ...l, status: overId as LeadStatus, lastActivityAt: new Date().toISOString() } : l));
    }
    setActiveId(null);
  };

  const promoteToJob = (leadId: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'APPROVED', lastActivityAt: new Date().toISOString() } : l));
    setConversionLead(null);
    setPipelineView('PRODUCTION');
    // In a real app, toast notification would go here
  };

  const currentColumns = COLUMNS.filter(c => c.pipeline === pipelineView);
  const insuranceDeals = leads.filter(l => l.financingType === 'INSURANCE').length;
  const cashDeals = leads.filter(l => l.financingType === 'CASH').length;
  const financedDeals = leads.filter(l => l.financingType === 'FINANCED').length;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#050914] text-white overflow-hidden">
      <aside className="hidden md:flex group w-16 hover:w-64 flex-col items-start py-6 border-r border-white/5 bg-[#0a0f1e] transition-all duration-300 z-50 shrink-0">
        <div className="px-4 mb-10 text-[#22d3ee] flex items-center gap-4">
          <i className="fa-solid fa-cloud-bolt shrink-0 text-3xl"></i>
          <span className="text-xl font-black tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">VELOCITY CRM</span>
        </div>
        <div className="flex-1 w-full">
          <SidebarItem icon="fa-table-columns" label="Pitch Board" active={pipelineView === 'PITCH'} />
          <SidebarItem icon="fa-rocket" label="Production" active={pipelineView === 'PRODUCTION'} />
          <SidebarItem icon="fa-users" label="Team" />
        </div>
        <div className="mt-auto w-full"><SidebarItem icon="fa-gear" label="Settings" /></div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto scrollbar-hide no-scrollbar">
        <header className="px-8 py-6 flex items-center justify-between border-b border-white/5 shrink-0">
          <h1 className="text-3xl font-black uppercase tracking-tighter">{pipelineView === 'PITCH' ? 'Pitch Board' : 'Production Board'}</h1>
          <button className="bg-[#22d3ee] text-[#050914] px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#22d3ee]/20 transition-all hover:scale-105 active:scale-95">
            <i className="fa-solid fa-plus mr-2"></i> New Project
          </button>
        </header>

        {/* Summary Row */}
        <div className="px-8 py-6 flex gap-6 overflow-x-auto scrollbar-hide shrink-0">
          <SummaryCard title="Insurance Deals" count={insuranceDeals} icon="fa-shield-halved" colorClass="border-blue-500 text-blue-400" />
          <SummaryCard title="Cash Deals" count={cashDeals} icon="fa-money-bill-wave" colorClass="border-emerald-500 text-emerald-400" />
          <SummaryCard title="Financed Deals" count={financedDeals} icon="fa-credit-card" colorClass="border-purple-500 text-purple-400" />
        </div>

        <PipelineOverview leads={leads} currentPipeline={pipelineView} onNavigate={setPipelineView} />

        <main ref={boardRef} className="flex-1 overflow-x-auto p-8 pt-0 min-h-[500px]">
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex gap-6 h-full min-w-max pb-10">
              {currentColumns.map((column) => (
                <BoardColumn
                  key={column.id}
                  column={column}
                  leads={leads.filter((l) => l.status === column.id)}
                  onCall={(l) => alert(`Call: ${l.phone}`)}
                  onMap={(l) => window.open(`https://maps.google.com?q=${l.address}`)}
                  onAction={() => {}}
                />
              ))}
            </div>
            <DragOverlay dropAnimation={null}>
              {activeLead ? <div className="rotate-2 scale-105 shadow-2xl z-[1000]"><LeadCard lead={activeLead} onCall={() => {}} onMap={() => {}} onAction={() => {}} /></div> : null}
            </DragOverlay>
          </DndContext>
        </main>
      </div>

      <ConversionModal 
        isOpen={!!conversionLead} 
        lead={conversionLead} 
        onConfirm={() => promoteToJob(conversionLead!.id)} 
        onCancel={() => setConversionLead(null)} 
      />
    </div>
  );
};

export default LeadBoard;
