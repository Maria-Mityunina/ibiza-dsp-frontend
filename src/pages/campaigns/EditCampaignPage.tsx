import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, X } from 'lucide-react'
import { GlassCard, Button } from '@components/ui'
import { notify } from '@stores/notificationStore'

const editCampaignSchema = z.object({
  name: z.string().min(1, 'Введите название').max(64, 'Максимум 64 символа'),
  budget: z.string().regex(/^\d{1,7}$/, 'Только цифры (до 7 символов)'),
  startDate: z.string().min(1, 'Выберите дату начала'),
  endDate: z.string().min(1, 'Выберите дату окончания'),
  description: z.string().max(500, 'Максимум 500 символов').optional(),
})

type EditCampaignFormData = z.infer<typeof editCampaignSchema>

const getMockCampaignData = (id: string): EditCampaignFormData => ({
  name: 'РК 1',
  budget: '1000',
  startDate: '2024-01-15',
  endDate: '2024-03-15',
  description: 'Рекламная кампания для продвижения мобильного приложения',
})

const EditCampaignPage: React.FC = () => {
  const navigate = useNavigate()
  const { advertiserId, id } = useParams()
  const [isLoading, setIsLoading] = React.useState(false)

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<EditCampaignFormData>({
    resolver: zodResolver(editCampaignSchema),
  })

  useEffect(() => {
    if (id) {
      const campaignData = getMockCampaignData(id)
      reset(campaignData)
    }
  }, [id, reset])

  const onSubmit = async (data: EditCampaignFormData) => {
    try {
      setIsLoading(true)
      // Update campaign implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      notify.success('Изменения сохранены', 'Кампания успешно обновлена')
      navigate(`/advertisers/${advertiserId}/campaigns`)
    } catch (error) {
      notify.error('Ошибка сохранения', 'Не удалось обновить кампанию')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (isDirty && !confirm('Есть несохраненные изменения. Покинуть страницу?')) return
    navigate(`/advertisers/${advertiserId}/campaigns`)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/40 backdrop-blur-sm border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-8 text-sm">
          <div>
            <span className="text-gray-600">Рекламодатель:</span>
            <span className="ml-2 text-black">ООО "Технологии будущего"</span>
          </div>
          <div>
            <span className="text-gray-600">Бюджет:</span>
            <span className="ml-2 text-black">500,000₽</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <GlassCard className="p-8">
          <div className="flex items-center space-x-4 mb-8">
            <button
              type="button"
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl text-black">Редактирование рекламной кампании</h1>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Название РК *</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white/30 border border-gray-300 rounded-lg text-black"
                {...register('name')}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Бюджет *</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white/30 border border-gray-300 rounded-lg text-black"
                {...register('budget')}
              />
              {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>}
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-700 mb-2">Дата начала *</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-white/30 border border-gray-300 rounded-lg text-black"
                  {...register('startDate')}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-700 mb-2">Дата окончания *</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-white/30 border border-gray-300 rounded-lg text-black"
                  {...register('endDate')}
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Описание</label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 bg-white/30 border border-gray-300 rounded-lg text-black resize-none"
                {...register('description')}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200/50">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                <X className="h-4 w-4 mr-2" />
                Отменить
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !isDirty}
                className="bg-black text-white hover:bg-gray-800"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </div>
        </GlassCard>
      </form>
    </div>
  )
}

export default EditCampaignPage