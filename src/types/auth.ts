// Типы для авторизации и пользователей

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  permissions: Permission[]
  createdAt: string
  lastLogin?: string
}

export type UserRole = 
  | 'employee_admin'       // Сотрудник. Администратор
  | 'employee_traffic'     // Сотрудник. Трафик менеджер
  | 'advertiser_admin'     // Рекламодатель. Администратор
  | 'advertiser_traffic'   // Рекламодатель. Трафик менеджер

export type Permission = 
  | 'view_advertisers'
  | 'create_advertiser'
  | 'edit_advertiser'
  | 'delete_advertiser'
  | 'manage_advertiser_budget'
  | 'view_campaigns'
  | 'create_campaign'
  | 'edit_campaign'
  | 'delete_campaign'
  | 'change_campaign_status'
  | 'view_adgroups'
  | 'create_adgroup'
  | 'edit_adgroup'
  | 'delete_adgroup'
  | 'change_adgroup_status'
  | 'view_creatives'
  | 'create_creative'
  | 'edit_creative'
  | 'delete_creative'
  | 'change_creative_status'
  | 'view_segments'
  | 'create_segment'
  | 'edit_segment'
  | 'delete_segment'
  | 'view_analytics'
  | 'view_statistics'
  | 'export_reports'

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
}
