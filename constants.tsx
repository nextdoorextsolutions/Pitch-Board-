
import { Column } from './types';

export const COLUMNS: Column[] = [
  // Pitch Board Stages
  { id: 'LEAD', title: 'New Lead', borderColor: 'border-slate-500', accentColor: 'text-slate-400', pipeline: 'PITCH' },
  { id: 'APPOINTMENT_SET', title: 'Appointment Set', borderColor: 'border-[#22d3ee]', accentColor: 'text-[#22d3ee]', pipeline: 'PITCH' },
  { id: 'PROSPECT', title: 'Prospect / Bid', borderColor: 'border-[#22d3ee]', accentColor: 'text-[#22d3ee]', pipeline: 'PITCH' },
  { id: 'CLOSING_TRIGGER', title: 'Closing (Hand-off)', borderColor: 'border-emerald-500', accentColor: 'text-emerald-400', pipeline: 'PITCH' },

  // Production Board Stages
  { id: 'APPROVED', title: 'Approved', borderColor: 'border-emerald-500', accentColor: 'text-emerald-400', pipeline: 'PRODUCTION' },
  { id: 'PROJECT_SCHEDULED', title: 'Scheduled', borderColor: 'border-[#4ade80]', accentColor: 'text-[#4ade80]', pipeline: 'PRODUCTION' },
  { id: 'COMPLETED', title: 'Completed', borderColor: 'border-emerald-600', accentColor: 'text-emerald-500', pipeline: 'PRODUCTION' },
  { id: 'INVOICED', title: 'Invoiced', borderColor: 'border-lime-500', accentColor: 'text-lime-400', pipeline: 'PRODUCTION' },
  { id: 'CLOSED_DEAL', title: 'Closed Deal', borderColor: 'border-yellow-500', accentColor: 'text-yellow-400', pipeline: 'PRODUCTION' },
];

export const CARRIERS = ['All', 'State Farm', 'Allstate', 'Liberty Mutual', 'Geico'];
export const SOURCES = ['All', 'Google', 'Referral', 'Door Knock', 'Facebook', 'Website'];
