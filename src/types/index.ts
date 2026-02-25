export enum ProcessType {
  POR_CANTIDAD = "POR_CANTIDAD",
  UNITARIO = "UNITARIO"
}

export enum ProcessStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED"
}

export enum FolioStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export enum GarmentStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED"
}

export enum FolioRouteStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED"
}

export enum AuditAction {
  STATE_CHANGE = "STATE_CHANGE",
  PROGRESS_UPDATE = "PROGRESS_UPDATE",
  DATE_CHANGE = "DATE_CHANGE",
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  DELETED = "DELETED"
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  role_id: number;
  section_id: number | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AuthPayload {
  id: number;
  email: string;
  role_id: number;
  section_id: number | null;
}

export interface Folio {
  id: number;
  folio_number: string;
  project_id: number;
  quantity: number;
  status: FolioStatus;
  created_at: Date;
  updated_at: Date;
}

export interface Garment {
  id: number;
  folio_id: number;
  garment_number: number;
  garment_code: string;
  status: GarmentStatus;
  created_at: Date;
  updated_at: Date;
}

export interface Section {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Client {
  id: number;
  name: string;
  contact_email: string | null;
  phone: string | null;
  address: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: number;
  name: string;
  client_id: number;
  salesman_id: number;
  description: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Route {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface RouteSection {
  id: number;
  route_id: number;
  section_id: number;
  sequence_order: number;
  is_active: boolean;
  created_at: Date;
}

export interface Process {
  id: number;
  section_id: number;
  name: string;
  description: string | null;
  type: ProcessType;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface FolioRoute {
  id: number;
  folio_id: number;
  route_id: number;
  current_route_section_id: number | null;
  status: FolioRouteStatus;
  started_at: Date | null;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface FolioProcess {
  id: number;
  folio_id: number;
  garment_id: number;
  process_id: number;
  route_section_id: number;
  status: ProcessStatus;
  total_quantity: number;
  completed_quantity: number;
  started_at: Date | null;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface ProcessProgress {
  id: number;
  folio_process_id: number;
  quantity_completed: number;
  updated_by_user_id: number;
  reason: string;
  comments: string | null;
  updated_at: Date;
}

export interface DeliveryDate {
  id: number;
  folio_id: number;
  due_date: Date;
  notes: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface DeliveryDateHistory {
  id: number;
  folio_id: number;
  old_due_date: Date;
  new_due_date: Date;
  changed_by_user_id: number;
  reason: string;
  changed_at: Date;
}

export interface AuditLog {
  id: number;
  action: AuditAction;
  entity_type: string;
  entity_id: number;
  user_id: number;
  old_value: string | null;
  new_value: string | null;
  description: string;
  timestamp: Date;
}
