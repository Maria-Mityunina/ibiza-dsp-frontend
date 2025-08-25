import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { Upload } from 'lucide-react'
import { GlassCard } from '@components/ui'
import { notify } from '@stores/notificationStore'

const createCreativeSchema = z.object({
  placement: z.string().min(1, 'Выберите плейсмент'),
  name: z.string().min(1, 'Введите название').max(16, 'Максимум 16 символов'),
  budget: z.string().regex(/^\d{1,7}$/, 'Только цифры (до 7 символов)'),
  title: z.string().max(16, 'Максимум 16 символов').optional(),
  text: z.string().max(32, 'Максимум 32 символа').optional(),
  link: z.string().min(1, 'Введите ссылку').max(500, 'Максимум 500 символов'),
  cpm: z.string().regex(/^\d{1,4}$/, 'CPM: только цифры (до 4 символов)'),
  launchAfterSave: z.boolean().optional(),
})

type CreateCreativeFormData = z.infer<typeof createCreativeSchema>

const CreateCreativePage: React.FC = () => {
  const navigate = useNavigate()
  const { advertiserId, campaignId, adgroupId } = useParams()
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedPlacement, setSelectedPlacement] = React.useState('')
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string>('')

  const { register, handleSubmit, formState: { errors, isDirty }, setValue, watch } = useForm<CreateCreativeFormData>({
    resolver: zodResolver(createCreativeSchema),
  })

  const placementValue = watch('placement')

  const onSubmit = async (data: CreateCreativeFormData) => {
    try {
      setIsLoading(true)
      // Create creative implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      notify.success('Креатив создан', 'Креатив успешно добавлен')
      navigate(`/advertisers/${advertiserId}/campaigns/${campaignId}/adgroups/${adgroupId}/creatives`)
    } catch (error) {
      notify.error('Ошибка создания', 'Не удалось создать креатив')
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
          <h1 className="text-xl text-black mb-6">Создание креатива</h1>
          
          <div className="space-y-6">
            {/* Плейсмент */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Плейсмент *
              </label>
              <select
                {...register('placement')}
                onChange={(e) => {
                  setValue('placement', e.target.value)
                  setSelectedPlacement(e.target.value)
                }}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              >
                <option value="">Выберите плейсмент</option>
                <option value="6 маленький">6 маленький</option>
                <option value="16 маленький">16 маленький</option>
                <option value="4 большой">4 большой</option>
                <option value="13 маленький">13 маленький</option>
                <option value="10 большой">10 большой</option>
                <option value="3 маленький">3 маленький</option>
                <option value="15 маленький">15 маленький</option>
                <option value="97 маленький">97 маленький</option>
              </select>
              {errors.placement && (
                <p className="text-red-500 text-sm mt-1">{errors.placement.message}</p>
              )}
            </div>

            {/* Название креатива */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Название креатива *
              </label>
              <input
                {...register('name')}
                type="text"
                maxLength={16}
                placeholder="Максимум 16 символов"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Бюджет */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Бюджет *
              </label>
              <input
                {...register('budget')}
                type="text"
                maxLength={7}
                placeholder="Только цифры"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
              {errors.budget && (
                <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
              )}
            </div>

            {/* Изображение */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Изображение
              </label>
              <div className="flex space-x-4">
                {/* Превью изображения */}
                <div className="w-48 h-32 bg-gray-50 border-2 border-gray-200 rounded-lg flex items-center justify-center">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-sm text-gray-500">
                        Перетащите сюда изображение или нажмите кнопку справа, чтобы выбрать из приложения
                      </p>
                    </div>
                  )}
                </div>

                {/* Кнопка загрузки */}
                <div className="flex flex-col justify-center">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <label className="cursor-pointer flex flex-col items-center">
                      <div className="w-8 h-8 bg-black rounded flex items-center justify-center mb-2">
                        <Upload className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-xs text-gray-600 text-center">
                        Размеры изображения: <br />
                        1200x675, 1080x608, <br />
                        500x282 пикселей
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {/* Информационная заметка */}
                  <div className="mt-2 p-2 bg-yellow-100 rounded text-xs text-gray-700">
                    JPG-изображение подойдет лучше всего для статичного формата рекламы
                  </div>
                </div>
              </div>
            </div>

            {/* Заголовок креатива (только для маленьких) */}
            {isSmallCreative && (
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Введите заголовок креатива
                </label>
                <input
                  {...register('title')}
                  type="text"
                  maxLength={16}
                  placeholder="Максимум 16 символов"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
                <p className="text-xs text-gray-500 mt-1">Максимум 16 символов</p>
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>
            )}

            {/* Текст креатива */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Введите текст креатива
              </label>
              <textarea
                {...register('text')}
                maxLength={32}
                rows={3}
                placeholder="Максимум 32 символа"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">Максимум 32 символа</p>
              {errors.text && (
                <p className="text-red-500 text-sm mt-1">{errors.text.message}</p>
              )}
            </div>

            {/* Ссылка */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Введите ссылку *
              </label>
              <input
                {...register('link')}
                type="url"
                maxLength={500}
                placeholder="https://runaweblube.com"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
              {errors.link && (
                <p className="text-red-500 text-sm mt-1">{errors.link.message}</p>
              )}
            </div>

            {/* Дополнительные поля для видео креативов */}
            {isBigCreative && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-black mb-3">
                  Где лучше "усадки"?...
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Конкретные детали просто чи к чему...
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Введите заголовок креатива
                    </label>
                    <input
                      {...register('title')}
                      type="text"
                      maxLength={16}
                      placeholder="Максимум 16 символов"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Введите текст креатива
                    </label>
                    <textarea
                      {...register('text')}
                      maxLength={32}
                      rows={2}
                      placeholder="Максимум 32 символа"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black resize-none"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-black mb-2">
                    Введите ссылку
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="https://runaweblube.com"
                  />
                </div>
              </div>
            )}

            {/* CPM */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                CPM *
              </label>
              <input
                {...register('cpm')}
                type="text"
                maxLength={4}
                placeholder="Только цифры"
                className="w-32 px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
              {errors.cpm && (
                <p className="text-red-500 text-sm mt-1">{errors.cpm.message}</p>
              )}
            </div>

            {/* Предпросмотр */}
            <div>
              <button
                type="button"
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors duration-300"
              >
                Предпросмотр
              </button>
            </div>

            {/* Запуск после сохранения */}
            <div className="flex items-center">
              <input
                {...register('launchAfterSave')}
                type="checkbox"
                id="launchAfterSave"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              />
              <label htmlFor="launchAfterSave" className="text-sm text-black">
                Запуск после сохранения
              </label>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
            >
              Отменить
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors duration-300"
            >
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </GlassCard>
      </form>
    </div>
  )
}

export default CreateCreativePage