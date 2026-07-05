import {
  BarChart3,
  Bell,
  Calendar,
  ClipboardList,
  LayoutDashboard,
  Settings,
  Star,
  Target,
  UserSquare2,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { ROLES, type Role } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'

export interface AppNavItem {
  label: string
  href: string
  icon: LucideIcon
  /** Roles that see this item in the sidebar. */
  roles: Role[]
}

const ALL_ROLES: Role[] = Object.values(ROLES)
const STAFF: Role[] = [ROLES.PROGRAM_COORDINATOR, ROLES.FACILITATOR]

/**
 * Single source of truth for dashboard navigation. The sidebar filters this
 * by the signed-in user's role.
 */
export const NAV_ITEMS: AppNavItem[] = [
  {
    label: 'Dashboard',
    href: ROUTES.dashboard,
    icon: LayoutDashboard,
    roles: ALL_ROLES,
  },
  {
    label: 'Assessments',
    href: ROUTES.assessments,
    icon: ClipboardList,
    roles: ALL_ROLES,
  },
  {
    label: 'Journey Star',
    href: ROUTES.journeyStar,
    icon: Star,
    roles: ALL_ROLES,
  },
  { label: 'Goals', href: ROUTES.goals, icon: Target, roles: ALL_ROLES },
  {
    label: 'Coaching',
    href: ROUTES.coaching,
    icon: Calendar,
    roles: ALL_ROLES,
  },
  { label: 'Reports', href: ROUTES.reports, icon: BarChart3, roles: ALL_ROLES },
  { label: 'Teams', href: ROUTES.teams, icon: UserSquare2, roles: STAFF },
  {
    label: 'Users',
    href: ROUTES.users,
    icon: Users,
    roles: [ROLES.PROGRAM_COORDINATOR],
  },
  {
    label: 'Notifications',
    href: ROUTES.notifications,
    icon: Bell,
    roles: ALL_ROLES,
  },
  {
    label: 'Settings',
    href: ROUTES.settings,
    icon: Settings,
    roles: [ROLES.PROGRAM_COORDINATOR],
  },
]

export function getNavItems(role: Role | null | undefined): AppNavItem[] {
  if (!role) return []
  return NAV_ITEMS.filter((item) => item.roles.includes(role))
}
