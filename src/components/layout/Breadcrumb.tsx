import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

const Breadcrumb: React.FC = () => {
  const location = useLocation()

  // Генерируем хлебные крошки на основе текущего пути
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    // Всегда добавляем главную
    breadcrumbs.push({
      label: 'Главная',
      href: '/advertisers',
    })

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
            breadcrumbs.push({ label: 'Создание' })
          } else if (pathSegments.length >= 3 && pathSegments[2] === 'edit') {
            breadcrumbs.push({ label: 'Редактирование' })
          } else if (pathSegments.length >= 3 && pathSegments[2] === 'campaigns') {
            // advertiserId/campaigns
            breadcrumbs.push({ label: 'Рекламные кампании' })
            
            if (pathSegments.length >= 4 && pathSegments[3] === 'create') {
              breadcrumbs.push({ label: 'Создание' })
            } else if (pathSegments.length >= 5 && pathSegments[4] === 'edit') {
              breadcrumbs.push({ label: 'Редактирование' })
            } else if (pathSegments.length >= 5 && pathSegments[4] === 'adgroups') {
              breadcrumbs.push({ label: 'Группы объявлений' })
              
              if (pathSegments.length >= 6 && pathSegments[5] === 'create') {
                breadcrumbs.push({ label: 'Создание' })
              } else if (pathSegments.length >= 7 && pathSegments[6] === 'edit') {
                breadcrumbs.push({ label: 'Редактирование' })
              } else if (pathSegments.length >= 7 && pathSegments[6] === 'creatives') {
                breadcrumbs.push({ label: 'Креативы' })
                
                if (pathSegments.length >= 8 && pathSegments[7] === 'create') {
                  breadcrumbs.push({ label: 'Создание' })
                } else if (pathSegments.length >= 9 && pathSegments[8] === 'edit') {
                  breadcrumbs.push({ label: 'Редактирование' })
                }
              }
            }
          }
        }
      } else if (segment === 'campaigns') {
        breadcrumbs.push({ label: 'Рекламные кампании' })
      } else if (segment === 'adgroups') {
        breadcrumbs.push({ label: 'Группы объявлений' })
      } else if (segment === 'creatives') {
        breadcrumbs.push({ label: 'Креативы' })
      }
    }

    return breadcrumbs
  }



  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <nav className="w-full" aria-label="Breadcrumb">
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
          <li key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-gray-400 mx-1 flex-shrink-0" />
            {breadcrumb.href ? (
              <Link
                to={breadcrumb.href}
                className="text-sm font-normal text-gray-600 hover:text-black transition-colors whitespace-nowrap"
              >
                {breadcrumb.label}
              </Link>
            ) : (
              <span className="text-sm font-normal text-black whitespace-nowrap">
                {breadcrumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>

      {/* Mobile version - compact single line */}
      <ol className="flex sm:hidden items-center flex-wrap gap-1">
        <li className="flex items-center">
          <Link
            to="/advertisers"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="h-3 w-3 text-gray-400 mx-1 flex-shrink-0" />
            {breadcrumb.href ? (
              <Link
                to={breadcrumb.href}
                                        className="text-xs font-normal text-gray-600 hover:text-black transition-colors truncate font-['Montserrat']"
              >
                {breadcrumb.label}
              </Link>
            ) : (
                                    <span className="text-xs font-normal text-black truncate font-['Montserrat']">
                        {breadcrumb.label}
                      </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumb
