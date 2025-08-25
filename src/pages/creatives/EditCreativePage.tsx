import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, X, Upload } from 'lucide-react'
import { GlassCard, Button } from '@components/ui'
import { notify } from '@stores/notificationStore'

const editCreativeSchema = z.object({
  placement: z.string().min(1, 'Выберите плейсмент'),
  name: z.string().min(1, 'Введите название').max(16, 'Максимум 16 символов'),
  budget: z.string().regex(/^\d{1,7}$/, 'Только цифры (до 7 символов)'),
  title: z.string().max(16, 'Максимум 16 символов').optional(),
  text: z.string().max(32, 'Максимум 32 символа').optional(),
  link: z.string().min(1, 'Введите ссылку').max(500, 'Максимум 500 символов'),
  cpm: z.string().regex(/^\d{1,4}$/, 'CPM: только цифры (до 4 символов)'),
  launchAfterSave: z.boolean().optional(),
})

type EditCreativeFormData = z.infer<typeof editCreativeSchema>

const getMockCreativeData = (id: string): EditCreativeFormData => ({
  placement: '6_маленький',
  name: 'Большой крео 1',
  budget: '1000',
  title: 'Где лучшие тусовки?',
  text: 'Колограммы денег просто ни к чему...',
  link: 'https://runadevklube.com',
  cpm: '25',
  launchAfterSave: false,
})

const EditCreativePage: React.FC = () => {
  const navigate = useNavigate()
  const { advertiserId, campaignId, adgroupId, id } = useParams()
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string>('')

  const { register, handleSubmit, formState: { errors, isDirty }, reset, watch } = useForm<EditCreativeFormData>({
    resolver: zodResolver(editCreativeSchema),
  })

  const placementValue = watch('placement')

  useEffect(() => {
    if (id) {
      const creativeData = getMockCreativeData(id)
      reset(creativeData)
    }
  }, [id, reset])

  const onSubmit = async (data: EditCreativeFormData) => {
    try {
      setIsLoading(true)
      // Update creative implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      notify.success('Изменения сохранены', 'Креатив успешно обновлен')
      navigate(`/advertisers/${advertiserId}/campaigns/${campaignId}/adgroups/${adgroupId}/creatives`)
    } catch (error) {
      notify.error('Ошибка сохранения', 'Не удалось обновить креатив')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (isDirty && !confirm('Есть несохраненные изменения. Покинуть страницу?')) return
    navigate(`/advertisers/${advertiserId}/campaigns/${campaignId}/adgroups/${adgroupId}/creatives`)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const isBigCreative = placementValue?.includes('большой')
  const isSmallCreative = placementValue?.includes('маленький')

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
            <h1 className="text-xl text-black">Редактирование креатива</h1>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Плейсмент *</label>
              <select 
                className="w-full px-4 py-3 bg-white/30 border border-gray-300 rounded-lg text-black"
                {...register('placement')}
              >
                <option value="">Выберите плейсмент</option>
                <option value="6_маленький">6 маленький</option>
                <option value="16_маленький">16 Маленький</option>
                <option value="4_большой">4 большой</option>
                <option value="13_маленький">13 маленький</option>
                <option value="10_большой">10 большой</option>
              </select>
              {errors.placement && <p className="mt-1 text-sm text-red-600">{errors.placement.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Название креатива *</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white/30 border border-gray-300 rounded-lg text-black"
                placeholder="Максимум 16 символов"
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

            {isBigCreative && (
              <div>
                <label className="block text-sm text-gray-700 mb-2">Изображение</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {previewUrl ? (
                    <div className="space-y-4">
                      <img src={previewUrl} alt="Preview" className="mx-auto max-h-64 rounded-lg" />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImage(null)
                          setPreviewUrl('')
                        }}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Удалить изображение
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div className="text-sm text-gray-600">
                        <p>Перетащите сюда изображение или нажмите чтобы выбрать</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Размеры: 1200х675, 1080х608, 5000х2812 пикселей
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {isSmallCreative && (
              <>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Заголовок креатива</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/30 border border-gray-300 rounded-lg text-black"
                    placeholder="Максимум 16 символов"
                    {...register('title')}
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Текст креатива</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 bg-white/30 border border-gray-300 rounded-lg text-black resize-none"
                    placeholder="Максимум 32 символа"
                    {...register('text')}
                  />
                  {errors.text && <p className="mt-1 text-sm text-red-600">{errors.text.message}</p>}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-2">Ссылка *</label>
              <input
                type="url"
                className="w-full px-4 py-3 bg-white/30 border border-gray-300 rounded-lg text-black"
                placeholder="https://example.com"
                {...register('link')}
              />
              {errors.link && <p className="mt-1 text-sm text-red-600">{errors.link.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">CPM *</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white/30 border border-gray-300 rounded-lg text-black"
                {...register('cpm')}
              />
              {errors.cpm && <p className="mt-1 text-sm text-red-600">{errors.cpm.message}</p>}
            </div>

            <div>
              <button
                type="button"
                className="px-6 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
              >
                Предпросмотр
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="launchAfterSave"
                className="h-4 w-4 text-black focus:ring-black/20 border-gray-300 rounded"
                {...register('launchAfterSave')}
              />
              <label htmlFor="launchAfterSave" className="text-sm text-gray-700">
                Запуск после сохранения
              </label>
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

export default EditCreativePage