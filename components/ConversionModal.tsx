
import React from 'react';
import { Lead } from '../types';

interface ConversionModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConversionModal: React.FC<ConversionModalProps> = ({ lead, isOpen, onConfirm, onCancel }) => {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
            <i className="fa-solid fa-rocket text-3xl"></i>
          </div>
          <h3 className="text-2xl font-bold text-center text-white mb-2">Convert to Job?</h3>
          <p className="text-slate-400 text-center text-sm mb-8 leading-relaxed">
            Ready to start production? Moving <strong>{lead.name}</strong> to the Job Board will transfer all notes and customer details.
          </p>
          
          <div className="bg-white/5 rounded-2xl p-5 mb-8 border border-white/5">
            <div className="flex justify-between items-center text-sm mb-3">
              <span className="text-slate-500 uppercase tracking-widest font-bold text-[10px]">Client</span>
              <span className="font-semibold text-white">{lead.name}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 uppercase tracking-widest font-bold text-[10px]">Contract</span>
              <span className="font-bold text-[#22d3ee]">{lead.value}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={onConfirm}
              className="w-full py-4 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-[#050914] font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-emerald-500/20"
            >
              Start Project
            </button>
            <button 
              onClick={onCancel}
              className="w-full py-4 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 font-bold text-xs uppercase tracking-widest transition-colors"
            >
              Wait, Not Yet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionModal;
