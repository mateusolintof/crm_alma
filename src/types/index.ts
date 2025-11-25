// ============================================
// TIPOS CENTRALIZADOS - ALMA CRM
// ============================================
import type React from 'react';

// --- Entidades Base ---

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  primaryColor: string;
  logoDarkHorizontalUrl?: string;
}

// --- Contatos e Empresas ---

export interface Contact {
  id: string;
  tenantId: string;
  companyId?: string;
  name: string;
  jobTitle?: string;
  mainChannel?: string;
  phones: string; // JSON array
  emails: string; // JSON array
  company?: Company;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  tenantId: string;
  name: string;
  segment?: string;
  size?: string;
  website?: string;
  tags: string;
  _count?: {
    contacts: number;
  };
}

// --- Leads ---

export interface Lead {
  id: string;
  tenantId: string;
  companyId?: string;
  primaryContactId?: string;
  ownerId?: string;
  status: LeadStatus;
  sourceType: string;
  budgetRange?: string;
  urgency?: string;
  leadScore: number;
  createdAt: string;
  updatedAt: string;
  primaryContact?: Contact;
  company?: Company;
  owner?: User;
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST';

// --- Pipeline e Deals ---

export interface Pipeline {
  id: string;
  tenantId: string;
  name: string;
  type: PipelineType;
  stages: Stage[];
  _count?: {
    deals: number;
  };
}

export type PipelineType = 'NEW_BUSINESS' | 'UPSELL' | 'RENEWAL' | 'CUSTOM';

export interface Stage {
  id: string;
  pipelineId: string;
  name: string;
  orderIndex: number;
  defaultProbability?: number;
  deals?: Deal[];
  _count?: {
    deals: number;
  };
}

export interface Deal {
  id: string;
  tenantId: string;
  pipelineId: string;
  stageId: string;
  companyId?: string;
  primaryContactId?: string;
  ownerId?: string;
  title: string;
  expectedMRR?: number;
  expectedOneOff?: number;
  probability?: number;
  expectedCloseDate?: string;
  status: DealStatus;
  createdAt: string;
  updatedAt: string;
  pipeline?: Pipeline;
  stage?: Stage;
  company?: Company;
  primaryContact?: Contact;
  owner?: User;
}

export type DealStatus = 'OPEN' | 'WON' | 'LOST';

// --- Inbox e Mensagens ---

export interface Conversation {
  id: string;
  tenantId: string;
  contactId?: string;
  companyId?: string;
  channelType: ChannelType;
  status: ConversationStatus;
  unreadCount: number;
  lastMessageAt: string;
  linkedDealId?: string;
  contact?: Contact;
  company?: Company;
  linkedDeal?: Deal & { stage: Stage };
  messages: Message[];
}

export type ChannelType = 'WHATSAPP' | 'EMAIL' | 'SMS' | 'INSTAGRAM' | 'WEBCHAT';
export type ConversationStatus = 'OPEN' | 'CLOSED' | 'ARCHIVED';

export interface Message {
  id: string;
  tenantId: string;
  conversationId: string;
  channelType: ChannelType;
  direction: MessageDirection;
  senderId?: string;
  contactId?: string;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  timestamp: string;
  sender?: User;
  contact?: Contact;
}

export type MessageDirection = 'INBOUND' | 'OUTBOUND';

// --- UI Types ---

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface ModalConfig {
  id: string;
  component: React.ComponentType<Record<string, unknown>>;
  props?: Record<string, unknown>;
}

// --- Filtros ---

export type QueryFilters = Record<string, string | number | boolean | null | undefined>;

export interface InboxFilters {
  channel?: ChannelType;
  status?: ConversationStatus;
  search?: string;
}

export interface LeadFilters {
  status?: LeadStatus;
  sourceType?: string;
  search?: string;
}

export interface DealFilters {
  stageId?: string;
  status?: DealStatus;
  search?: string;
}

// --- API Response Types ---

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode: number;
}
