// Role permission types
type UserRole = 'employee_admin' | 'employee_traffic' | 'advertiser_admin' | 'advertiser_traffic'
type Permission = string

/**
 * Разрешения для каждой роли согласно техническому заданию
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // Сотрудник. Администратор - полный доступ ко всем функциям
  employee_admin: [
    'view_advertisers',
    'create_advertiser',
    'edit_advertiser',
    'delete_advertiser',
    'manage_advertiser_budget',
    'view_campaigns',
    'create_campaign',
    'edit_campaign',
    'delete_campaign',
    'change_campaign_status',
    'view_adgroups',
    'create_adgroup',
    'edit_adgroup',
    'delete_adgroup',
    'change_adgroup_status',
    'view_creatives',
    'create_creative',
    'edit_creative',
    'delete_creative',
    'change_creative_status',
    'view_segments',
    'create_segment',
    'edit_segment',
    'delete_segment',
    'view_analytics',
    'view_statistics',
    'export_reports',
  ],

  // Сотрудник. Трафик менеджер - только кампании и статистика (не может редактировать данные рекламодателя и менять бюджет)
  employee_traffic: [
    'view_advertisers', // может видеть список, но не редактировать
    'view_campaigns',
    'create_campaign',
    'edit_campaign',
    'delete_campaign',
    'change_campaign_status',
    'view_adgroups',
    'create_adgroup',
    'edit_adgroup',
    'delete_adgroup',
    'change_adgroup_status',
    'view_creatives',
    'create_creative',
    'edit_creative',
    'delete_creative',
    'change_creative_status',
    'view_segments',
    'create_segment',
    'edit_segment',
    'delete_segment',
    'view_analytics',
    'view_statistics',
    'export_reports',
    // НЕ МОЖЕТ: edit_advertiser, delete_advertiser, manage_advertiser_budget
  ],

  // Рекламодатель. Администратор - только свои кампании и статистика + редактирование данных рекламодателя (но не бюджета)
  advertiser_admin: [
    'view_advertisers', // только свои
    'edit_advertiser', // может редактировать данные своего рекламодателя
    'view_campaigns',
    'create_campaign',
    'edit_campaign',
    'delete_campaign',
    'change_campaign_status',
    'view_adgroups',
    'create_adgroup',
    'edit_adgroup',
    'delete_adgroup',
    'change_adgroup_status',
    'view_creatives',
    'create_creative',
    'edit_creative',
    'delete_creative',
    'change_creative_status',
    'view_segments',
    'create_segment',
    'edit_segment',
    'delete_segment',
    'view_analytics',
    'view_statistics',
    'export_reports',
    // НЕ МОЖЕТ: create_advertiser, delete_advertiser, manage_advertiser_budget
  ],

  // Рекламодатель. Трафик менеджер - только свои кампании и статистика (не может редактировать данные рекламодателя и менять бюджет)
  advertiser_traffic: [
    'view_advertisers', // только свои (read-only)
    'view_campaigns',
    'create_campaign',
    'edit_campaign',
    'delete_campaign',
    'change_campaign_status',
    'view_adgroups',
    'create_adgroup',
    'edit_adgroup',
    'delete_adgroup',
    'change_adgroup_status',
    'view_creatives',
    'create_creative',
    'edit_creative',
    'delete_creative',
    'change_creative_status',
    'view_segments',
    'create_segment',
    'edit_segment',
    'delete_segment',
    'view_analytics',
    'view_statistics',
    'export_reports',
    // НЕ МОЖЕТ: create_advertiser, edit_advertiser, delete_advertiser, manage_advertiser_budget
  ],
}

/**
 * Получить все разрешения для роли
 */
export const getPermissionsForRole = (role: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[role] || []
}

/**
 * Проверить, есть ли у роли конкретное разрешение
 */
export const hasRolePermission = (role: UserRole, permission: Permission): boolean => {
  const rolePermissions = getPermissionsForRole(role)
  return rolePermissions.includes(permission)
}

/**
 * Проверить, есть ли у роли любое из указанных разрешений
 */
export const hasAnyRolePermission = (role: UserRole, permissions: Permission[]): boolean => {
  const rolePermissions = getPermissionsForRole(role)
  return permissions.some(permission => rolePermissions.includes(permission))
}

/**
 * Проверить, есть ли у роли все указанные разрешения
 */
export const hasAllRolePermissions = (role: UserRole, permissions: Permission[]): boolean => {
  const rolePermissions = getPermissionsForRole(role)
  return permissions.every(permission => rolePermissions.includes(permission))
}

/**
 * Получить человекочитаемое название роли
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    employee_admin: 'Сотрудник. Администратор',
    employee_traffic: 'Сотрудник. Трафик менеджер',
    advertiser_admin: 'Рекламодатель. Администратор',
    advertiser_traffic: 'Рекламодатель. Трафик менеджер',
  }
  
  return roleNames[role] || role
}

/**
 * Получить описание роли
 */
export const getRoleDescription = (role: UserRole): string => {
  const descriptions: Record<UserRole, string> = {
    employee_admin: 'Полный доступ ко всем рекламодателям, их кампаниям и статистике. Может редактировать, удалять, изменять статус любой сущности.',
    employee_traffic: 'Доступ только к рекламным кампаниям и статистике у заданных рекламодателей. Не может редактировать данные рекламодателя и менять лимит бюджета.',
    advertiser_admin: 'Доступ только к рекламным кампаниям и статистике у заданных рекламодателей. Может редактировать данные рекламодателя, но не может менять лимит бюджета.',
    advertiser_traffic: 'Доступ только к рекламным кампаниям и статистике у заданных рекламодателей. Не может редактировать данные рекламодателя и менять лимит бюджета.',
  }
  
  return descriptions[role] || 'Описание роли не найдено'
}

