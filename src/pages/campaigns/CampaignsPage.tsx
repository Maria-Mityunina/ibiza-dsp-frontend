import React from 'react'
import { useParams } from 'react-router-dom'
import { Card } from '@components/ui'

const CampaignsPage: React.FC = () => {
  const { advertiserId } = useParams()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">
          Рекламные кампании
        </h1>
        <p className="text-sm text-secondary-600">
          Advertiser ID: {advertiserId}
        </p>
      </div>

      <Card>
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-secondary-600">
              Страница рекламных кампаний в разработке.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default CampaignsPage
