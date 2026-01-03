import React, { HTMLAttributes } from 'react'
import './Sidebar.css'

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  collapsed?: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${className}`} {...props}>
      {children}
    </aside>
  )
}

export interface SidebarHeaderProps extends HTMLAttributes<HTMLDivElement> {
  logo?: React.ReactNode
  title?: string
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  logo,
  title,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`sidebar-header ${className}`} {...props}>
      {logo && <div className="sidebar-logo">{logo}</div>}
      {title && <span className="sidebar-title">{title}</span>}
      {children}
    </div>
  )
}

export interface SidebarNavProps extends HTMLAttributes<HTMLElement> {}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <nav className={`sidebar-nav ${className}`} {...props}>
      {children}
    </nav>
  )
}

export interface NavItemProps extends HTMLAttributes<HTMLAnchorElement> {
  href?: string
  icon?: React.ReactNode
  active?: boolean
  badge?: React.ReactNode
  as?: React.ElementType
}

export const NavItem: React.FC<NavItemProps> = ({
  href,
  icon,
  active = false,
  badge,
  children,
  className = '',
  as: Component = 'a',
  ...props
}) => {
  return (
    <Component
      href={href}
      className={`nav-item ${active ? 'active' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="nav-item-icon">{icon}</span>}
      <span className="nav-item-text">{children}</span>
      {badge && <span className="nav-item-badge">{badge}</span>}
    </Component>
  )
}

export interface SidebarFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`sidebar-footer ${className}`} {...props}>
      {children}
    </div>
  )
}

export interface UserProfileProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  email?: string
  avatar?: React.ReactNode
}

export const UserProfile: React.FC<UserProfileProps> = ({
  name,
  email,
  avatar,
  className = '',
  ...props
}) => {
  return (
    <div className={`user-profile ${className}`} {...props}>
      {avatar && <div className="user-avatar">{avatar}</div>}
      <div className="user-info">
        <span className="user-name">{name}</span>
        {email && <span className="user-email">{email}</span>}
      </div>
    </div>
  )
}
