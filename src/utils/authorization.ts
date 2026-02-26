/**
 * RF-01: Authorization Utilities
 * 
 * Provides RBAC (Role-Based Access Control) helper functions
 * Centralizes permission logic for consistent enforcement across layers
 */

import { AuthPayload, UserRole } from "../types";
import logger from "../config/logger";

// ============================================================================
// ROLE-TO-PERMISSION MAPPINGS
// ============================================================================

/**
 * Define which roles can perform which actions
 * Used for authorization checks across the application
 */
export const RolePermissions: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: [
    "user:create",
    "user:read",
    "user:update",
    "user:delete",
    "user:assign_role",
    "user:assign_section",
    "role:manage",
    "section:manage",
    "client:manage",
    "project:manage",
    "folio:create",
    "folio:update",
    "folio:delete",
    "folio:close",
    "process:create",
    "process:update",
    "process:delete",
    "process:execute",
    "process:pause",
    "process:resume",
    "audit:view"
  ],
  [UserRole.PLANNING]: [
    "user:read",
    "client:read",
    "client:create",
    "client:update",
    "project:create",
    "project:read",
    "project:update",
    "folio:create",
    "folio:read",
    "folio:update",
    "folio:close",
    "section:read",
    "process:read"
  ],
  [UserRole.SECTION_CHIEF]: [
    "user:read",
    "user:read_section",
    "section:read",
    "section:read_own",
    "process:read",
    "process:read_section",
    "process:execute",
    "process:pause",
    "process:resume",
    "folio:read",
    "audit:view_section"
  ],
  [UserRole.OPERATOR]: [
    "user:read_self",
    "section:read_own",
    "process:read",
    "process:execute",
    "process:pause",
    "process:resume",
    "folio:read"
  ],
  [UserRole.SALESMAN]: [
    "client:read",
    "client:create",
    "client:update",
    "project:read",
    "folio:read"
  ],
  [UserRole.MANAGER]: [
    "user:read",
    "client:read",
    "project:read",
    "folio:read",
    "process:read",
    "audit:view"
  ]
};

// ============================================================================
// AUTHORIZATION CHECK FUNCTIONS
// ============================================================================

/**
 * Check if a user has a specific role
 * 
 * @param user - AuthPayload from JWT
 * @param requiredRoles - One or more role IDs required
 * @returns true if user has any of the required roles
 */
export function hasRole(user: AuthPayload, ...requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(user.role_id);
}

/**
 * Check if a user has a specific permission
 * 
 * @param user - AuthPayload from JWT
 * @param permission - Permission string (e.g., "folio:create")
 * @returns true if user's role includes this permission
 */
export function hasPermission(user: AuthPayload, permission: string): boolean {
  const permissions = RolePermissions[user.role_id] || [];
  return permissions.includes(permission);
}

/**
 * Check if a user can access a specific section
 * Enforces section-scoped access control for section-assigned roles
 * 
 * @param user - AuthPayload from JWT
 * @param targetSectionId - Section ID being accessed
 * @returns true if user can access the section
 * 
 * RULES:
 * - ADMIN: Can access any section
 * - SECTION_CHIEF/OPERATOR: Can only access their assigned section
 * - Other roles: Cannot access section-specific data
 */
export function canAccessSection(user: AuthPayload, targetSectionId: number): boolean {
  // ADMIN can access any section
  if (user.role_id === UserRole.ADMIN) {
    return true;
  }

  // SECTION_CHIEF and OPERATOR can only access their assigned section
  if (user.role_id === UserRole.SECTION_CHIEF || user.role_id === UserRole.OPERATOR) {
    return user.section_id === targetSectionId;
  }

  // Other roles cannot access section-specific data
  return false;
}

/**
 * Check if a user can perform an action on a resource in a specific section
 * Combines role permission check with section access control
 * 
 * @param user - AuthPayload from JWT
 * @param permission - Permission to check (e.g., "process:execute")
 * @param targetSectionId - Section ID of the resource
 * @returns true if user has permission and can access the section
 */
export function canActOnSectionResource(
  user: AuthPayload,
  permission: string,
  targetSectionId: number
): boolean {
  return hasPermission(user, permission) && canAccessSection(user, targetSectionId);
}

// ============================================================================
// AUTHORIZATION GUARDS (Thrown Exceptions)
// ============================================================================

/**
 * Guard: Check role, throw if not authorized
 * Use in service layer for business logic protection
 */
export function requireRole(user: AuthPayload, ...requiredRoles: UserRole[]): void {
  if (!hasRole(user, ...requiredRoles)) {
    logger.warn("Authorization failed - insufficient role", {
      userId: user.id,
      userRole: user.role_id,
      requiredRoles,
      action: "requireRole"
    });
    throw new Error("Insufficient permissions: required role not found");
  }
}

/**
 * Guard: Check permission, throw if not authorized
 * Use in service layer for granular permission checks
 */
export function requirePermission(user: AuthPayload, permission: string): void {
  if (!hasPermission(user, permission)) {
    logger.warn("Authorization failed - insufficient permission", {
      userId: user.id,
      userRole: user.role_id,
      requiredPermission: permission,
      action: "requirePermission"
    });
    throw new Error(`Insufficient permissions: ${permission} not granted`);
  }
}

/**
 * Guard: Check section access, throw if not authorized
 * Use in service layer for section-scoped operations
 */
export function requireSectionAccess(user: AuthPayload, targetSectionId: number): void {
  if (!canAccessSection(user, targetSectionId)) {
    logger.warn("Authorization failed - section access denied", {
      userId: user.id,
      userRole: user.role_id,
      userSection: user.section_id,
      targetSection: targetSectionId,
      action: "requireSectionAccess"
    });
    throw new Error(`Access denied: cannot access section ${targetSectionId}`);
  }
}

/**
 * Guard: Check both permission and section access, throw if not authorized
 * Combined authorization for section-scoped operations
 */
export function requireSectionResourceAccess(
  user: AuthPayload,
  permission: string,
  targetSectionId: number
): void {
  if (!canActOnSectionResource(user, permission, targetSectionId)) {
    logger.warn("Authorization failed - section resource access denied", {
      userId: user.id,
      userRole: user.role_id,
      userSection: user.section_id,
      requiredPermission: permission,
      targetSection: targetSectionId,
      action: "requireSectionResourceAccess"
    });
    throw new Error(
      `Access denied: cannot perform '${permission}' on section ${targetSectionId}`
    );
  }
}

// ============================================================================
// ROLE METADATA (For UI and Documentation)
// ============================================================================

export const RoleMetadata: Record<
  UserRole,
  {
    name: string;
    label: string;
    description: string;
    scope: "system" | "section";
  }
> = {
  [UserRole.ADMIN]: {
    name: "ADMIN",
    label: "System Administrator",
    description: "Full system access, user management, configuration",
    scope: "system"
  },
  [UserRole.PLANNING]: {
    name: "PLANNING",
    label: "Planning Manager",
    description: "Project and folio management, resource allocation",
    scope: "system"
  },
  [UserRole.SECTION_CHIEF]: {
    name: "SECTION_CHIEF",
    label: "Section Manager",
    description: "Manage section-level operations and personnel",
    scope: "section"
  },
  [UserRole.OPERATOR]: {
    name: "OPERATOR",
    label: "Process Operator",
    description: "Execute processes, update progress, manage workload",
    scope: "section"
  },
  [UserRole.SALESMAN]: {
    name: "SALESMAN",
    label: "Sales Representative",
    description: "Manage client relationships and sales opportunities",
    scope: "system"
  },
  [UserRole.MANAGER]: {
    name: "MANAGER",
    label: "Executive / Management",
    description: "View reports, dashboards, and business metrics",
    scope: "system"
  }
};

/**
 * Get human-readable role name
 */
export function getRoleLabel(roleId: UserRole): string {
  return RoleMetadata[roleId]?.label || `Unknown Role (${roleId})`;
}

/**
 * Get role description
 */
export function getRoleDescription(roleId: UserRole): string {
  return RoleMetadata[roleId]?.description || "No description available";
}
