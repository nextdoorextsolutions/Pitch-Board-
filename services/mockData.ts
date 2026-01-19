
import { Lead, User } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Admin', role: 'ADMIN' },
  { id: 'u2', name: 'Bob TeamLead', role: 'TEAM_LEAD', teamId: 't1' },
  { id: 'u3', name: 'Charlie Sales', role: 'SALES_REP', teamId: 't1' },
];

const now = new Date();
const subMins = (m: number) => new Date(now.getTime() - m * 60 * 1000).toISOString();

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'l1',
    name: 'John Smith',
    address: '123 Maple Ave.',
    value: '$15k',
    financingType: 'INSURANCE',
    insuranceCarrier: 'State Farm',
    status: 'LEAD',
    assignedToId: 'u3',
    createdAt: subMins(10),
    lastActivityAt: subMins(10),
    phone: '555-0101'
  },
  {
    id: 'l2',
    name: 'Jane Doe',
    address: '456 Oak St.',
    value: '$12k',
    financingType: 'CASH',
    status: 'APPOINTMENT_SET',
    assignedToId: 'u3',
    createdAt: subMins(60),
    lastActivityAt: subMins(60),
    phone: '555-0102'
  },
  {
    id: 'l3',
    name: 'Bob Jones',
    address: '789 Pine Ln.',
    value: '$18k',
    financingType: 'INSURANCE',
    insuranceCarrier: 'Allstate',
    status: 'PROSPECT',
    statusNote: 'Claim Filed',
    assignedToId: 'u3',
    createdAt: subMins(120),
    lastActivityAt: subMins(120),
    phone: '555-0103'
  },
  {
    id: 'l4',
    name: 'Sarah Lee',
    address: '101 Elm Dr.',
    value: '$22k',
    financingType: 'FINANCED',
    status: 'APPROVED',
    statusNote: 'Production Ready',
    assignedToId: 'u3',
    createdAt: subMins(180),
    lastActivityAt: subMins(180),
    phone: '555-0104'
  }
];
