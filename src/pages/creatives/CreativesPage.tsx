import React from 'react'
import { Card } from '@components/ui'

const CreativesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-secondary-900">
        Креативы
      </h1>

      <Card>
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-secondary-600">
              Страница креативов в разработке.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default CreativesPage
