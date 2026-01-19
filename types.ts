
export type UserRole = 'ADMIN' | 'TEAM_LEAD' | 'SALES_REP';

export type PipelineType = 'PITCH' | 'PRODUCTION';

export type LeadStatus = 
  | 'LEAD' 
  | 'APPOINTMENT_SET' 
  | 'PROSPECT' 
  | 'CLOSING_TRIGGER' // Special bucket on Pitch Board
  | 'APPROVED' 
  | 'PROJECT_SCHEDULED' 
  | 'COMPLETED' 
  | 'INVOICED' 
  | 'CLOSED_DEAL';

export type FinancingType = 'INSURANCE' | 'CASH' | 'FINANCED';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  teamId?: string;
}

export interface Lead {
  id: string;
  name: string;
  address: string;
  value: string;
  financingType: FinancingType;
  insuranceCarrier?: string;
  status: LeadStatus;
  statusNote?: string;
  assignedToId: string;
  createdAt: string;
  lastActivityAt: string;
  convertedAt?: string;
  phone: string;
}

export interface Column {
  id: LeadStatus;
  title: string;
  borderColor: string;
  accentColor: string;
  pipeline: PipelineType | 'BOTH';
}
