import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ChevronRight, Home, ArrowLeft } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
  id?: string
}

const Breadcrumb: React.FC = () => {
  const location = useLocation()
  const params = useParams<{
    advertiserId?: string
    campaignId?: string
    adGroupId?: string
    id?: string
  }>()

  const [entityNames, setEntityNames] = useState<{
    advertiser?: string
    campaign?: string
    adGroup?: string
    creative?: string
  }>({})

  // В реальном приложении здесь будут API вызовы для получения имен сущностей
  useEffect(() => {
    const loadEntityNames = async () => {
      const names: typeof entityNames = {}
      
      if (params.advertiserId) {
        // names.advertiser = await getAdvertiserName(params.advertiserId)
        names.advertiser = 'ООО Зеленоглазое такси' // Mock data
      }
      
      if (params.campaignId) {
        // names.campaign = await getCampaignName(params.campaignId)
        names.campaign = 'РК 1' // Mock data
      }
      
      if (params.adGroupId) {
        // names.adGroup = await getAdGroupName(params.adGroupId)
        names.adGroup = 'Объявление 1' // Mock data
      }
      
      setEntityNames(names)
    }

    loadEntityNames()
  }, [params.advertiserId, params.campaignId, params.adGroupId])

  // Генерируем хлебные крошки на основе текущего пути
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    // Обрабатываем известные маршруты
    if (pathSegments.length > 0) {
      const segment = pathSegments[0]
      
      if (segment === 'advertisers') {
        // Рекламодатели
        if (pathSegments.length === 1) {
          breadcrumbs.push({ label: 'Рекламодатели' })
        } else if (pathSegments.length >= 2) {
          breadcrumbs.push({
            label: 'Рекламодатели',
            href: '/advertisers',
          })
          
          const secondSegment = pathSegments[1]
          if (secondSegment === 'create') {
            breadcrumbs.push({ label: 'Создание рекламодателя' })
          } else if (pathSegments.length >= 3 && pathSegments[2] === 'edit') {
            breadcrumbs.push({ 
              label: entityNames.advertiser || 'Рекламодатель',
              href: `/advertisers/${params.advertiserId}`
            })
            breadcrumbs.push({ label: 'Редактирование' })
          } else if (pathSegments.length >= 3 && pathSegments[2] === 'campaigns') {
            // Добавляем рекламодателя
            breadcrumbs.push({ 
              label: entityNames.advertiser || 'Рекламодатель',
              href: `/advertisers/${params.advertiserId}`
            })
            
            if (pathSegments.length === 3) {
              breadcrumbs.push({ label: 'Рекламные кампании' })
            } else if (pathSegments.length >= 4 && pathSegments[3] === 'create') {
              breadcrumbs.push({
                label: 'Рекламные кампании',
                href: `/advertisers/${params.advertiserId}/campaigns`
              })
              breadcrumbs.push({ label: 'Создание кампании' })
            } else if (pathSegments.length >= 5 && pathSegments[4] === 'edit') {
              breadcrumbs.push({
                label: 'Рекламные кампании',
                href: `/advertisers/${params.advertiserId}/campaigns`
              })
              breadcrumbs.push({ 
                label: entityNames.campaign || 'Кампания',
                href: `/advertisers/${params.advertiserId}/campaigns/${params.campaignId}`
              })
              breadcrumbs.push({ label: 'Редактирование' })
            } else if (pathSegments.length >= 5 && pathSegments[4] === 'adgroups') {
              breadcrumbs.push({
                label: 'Рекламные кампании',
                href: `/advertisers/${params.advertiserId}/campaigns`
              })
              breadcrumbs.push({ 
                label: entityNames.campaign || 'Кампания',
                href: `/advertisers/${params.advertiserId}/campaigns/${params.campaignId}`
              })
              
              if (pathSegments.length === 5) {
                breadcrumbs.push({ label: 'Группы объявлений' })
              } else if (pathSegments.length >= 6 && pathSegments[5] === 'create') {
                breadcrumbs.push({
                  label: 'Группы объявлений',
                  href: `/advertisers/${params.advertiserId}/campaigns/${params.campaignId}/adgroups`
                })
                breadcrumbs.push({ label: 'Создание группы' })
              } else if (pathSegments.length >= 7 && pathSegments[6] === 'edit') {
                breadcrumbs.push({
                  label: 'Группы объявлений',
                  href: `/advertisers/${params.advertiserId}/campaigns/${params.campaignId}/adgroups`
                })
                breadcrumbs.push({ 
                  label: entityNames.adGroup || 'Группа объявлений',
                  href: `/advertisers/${params.advertiserId}/campaigns/${params.campaignId}/adgroups/${params.adGroupId}`
                })
                breadcrumbs.push({ label: 'Редактирование' })
              } else if (pathSegments.length >= 7 && pathSegments[6] === 'creatives') {
                breadcrumbs.push({
                  label: 'Группы объявлений',
                  href: `/advertisers/${params.advertiserId}/campaigns/${params.campaignId}/adgroups`
                })
                breadcrumbs.push({ 
                  label: entityNames.adGroup || 'Группа объявлений',
                  href: `/advertisers/${params.advertiserId}/campaigns/${params.campaignId}/adgroups/${params.adGroupId}`
                })
                
                if (pathSegments.length === 7) {
                  breadcrumbs.push({ label: 'Креативы' })
                } else if (pathSegments.length >= 8 && pathSegments[7] === 'create') {
                  breadcrumbs.push({
                    label: 'Креативы',
                    href: `/advertisers/${params.advertiserId}/campaigns/${params.campaignId}/adgroups/${params.adGroupId}/creatives`
                  })
                  breadcrumbs.push({ label: 'Создание креатива' })
                } else if (pathSegments.length >= 9 && pathSegments[8] === 'edit') {
                  breadcrumbs.push({
                    label: 'Креативы',
                    href: `/advertisers/${params.advertiserId}/campaigns/${params.campaignId}/adgroups/${params.adGroupId}/creatives`
                  })
                  breadcrumbs.push({ 
                    label: entityNames.creative || 'Креатив',
                    href: `/advertisers/${params.advertiserId}/campaigns/${params.campaignId}/adgroups/${params.adGroupId}/creatives/${params.id}`
                  })
                  breadcrumbs.push({ label: 'Редактирование' })
                }
              }
            }
          }
        }
      } else if (segment === 'campaigns') {
        breadcrumbs.push({ label: 'Все кампании' })
      } else if (segment === 'adgroups') {
        breadcrumbs.push({ label: 'Все группы объявлений' })
      } else if (segment === 'creatives') {
        breadcrumbs.push({ label: 'Все креативы' })
      } else if (segment === 'segments') {
        breadcrumbs.push({ label: 'Сегменты' })
      } else if (segment === 'analytics') {
        breadcrumbs.push({ label: 'Аналитика' })
      } else if (segment === 'fraud-detection') {
        breadcrumbs.push({ label: 'Защита от фрода' })
      } else if (segment === 'audience-insights') {
        breadcrumbs.push({ label: 'Анализ аудитории' })
      } else if (segment === 'creative-performance') {
        breadcrumbs.push({ label: 'Эффективность креативов' })
      }
    }

    return breadcrumbs
  }

  // Функция для получения пути назад
  const getBackPath = (): string | null => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    
    if (pathSegments.length <= 1) return null
    
    // Убираем последний сегмент или два последних если это action (create/edit)
    const lastSegment = pathSegments[pathSegments.length - 1]
    if (lastSegment === 'create' || lastSegment === 'edit') {
      pathSegments.pop() // убираем action
      pathSegments.pop() // убираем id или сущность
    } else {
      pathSegments.pop() // убираем последний сегмент
    }
    
    return '/' + pathSegments.join('/')
  }



  const breadcrumbs = generateBreadcrumbs()
  const backPath = getBackPath()

  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <nav 
      className="w-full flex items-center gap-2 sm:gap-4" 
      aria-label="Breadcrumb"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {/* Back Button */}
      {backPath && (
        <Link
          to={backPath}
          className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm border border-white/20"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline font-normal">Назад</span>
        </Link>
      )}

      {/* Breadcrumbs */}
      <div className="flex-1 min-w-0">
        {/* Desktop version */}
        <ol className="hidden sm:flex items-center flex-wrap gap-1">
          <li className="flex items-center">
            <Link
              to="/advertisers"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Home className="h-4 w-4" />
            </Link>
          </li>

          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index} className="flex items-center min-w-0">
              <ChevronRight className="h-4 w-4 text-gray-400 mx-1 flex-shrink-0" />
              {breadcrumb.href ? (
                <Link
                  to={breadcrumb.href}
                  className="text-sm font-normal text-gray-600 hover:text-gray-900 transition-colors truncate"
                >
                  {breadcrumb.label}
                </Link>
              ) : (
                <span className="text-sm font-normal text-gray-900 truncate">
                  {breadcrumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>

        {/* Mobile version - show only current and previous */}
        <ol className="flex sm:hidden items-center gap-1 min-w-0">
          <li className="flex items-center">
            <Link
              to="/advertisers"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Home className="h-4 w-4" />
            </Link>
          </li>
          
          {/* Show only the last 2 breadcrumbs on mobile to avoid crowding */}
          {breadcrumbs.slice(-2).map((breadcrumb, index) => (
            <li key={index} className="flex items-center min-w-0">
              <ChevronRight className="h-3 w-3 text-gray-400 mx-0.5 flex-shrink-0" />
              {breadcrumb.href ? (
                <Link
                  to={breadcrumb.href}
                  className="text-xs font-normal text-gray-600 hover:text-gray-900 transition-colors truncate max-w-24"
                >
                  {breadcrumb.label}
                </Link>
              ) : (
                <span className="text-xs font-normal text-gray-900 truncate max-w-28">
                  {breadcrumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}

export default Breadcrumb
