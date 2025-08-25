import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save, X } from 'lucide-react'
import { Button, Input, GlassCard } from '@components/ui'
import { notify } from '@stores/notificationStore'
import { FIELD_LIMITS, VALIDATION_PATTERNS } from '@constants/formats'

// Схема валидации для создания рекламодателя
const createAdvertiserSchema = z.object({
  name: z.string()
    .min(1, 'Поле обязательно для заполнения')
    .max(FIELD_LIMITS.ADVERTISER_NAME, `Максимум ${FIELD_LIMITS.ADVERTISER_NAME} символов`),
  legalName: z.string()
    .min(1, 'Поле обязательно для заполнения')
    .max(FIELD_LIMITS.LEGAL_NAME, `Максимум ${FIELD_LIMITS.LEGAL_NAME} символов`),
  inn: z.string()
    .min(1, 'Поле обязательно для заполнения')
    .length(FIELD_LIMITS.INN, `Должно быть ${FIELD_LIMITS.INN} цифр`)
    .regex(VALIDATION_PATTERNS.INN, 'Только цифры'),
  kpp: z.string()
    .min(1, 'Поле обязательно для заполнения')
    .length(FIELD_LIMITS.KPP, `Должно быть ${FIELD_LIMITS.KPP} цифр`)
    .regex(VALIDATION_PATTERNS.KPP, 'Только цифры'),
  ogrn: z.string()
    .min(1, 'Поле обязательно для заполнения')
    .max(FIELD_LIMITS.OGRN, `Максимум ${FIELD_LIMITS.OGRN} цифр`)
    .regex(VALIDATION_PATTERNS.OGRN, 'Только цифры'),
  legalAddress: z.string()
    .min(1, 'Поле обязательно для заполнения')
    .max(FIELD_LIMITS.LEGAL_ADDRESS, `Максимум ${FIELD_LIMITS.LEGAL_ADDRESS} символов`),
  bik: z.string()
    .min(1, 'Поле обязательно для заполнения')
    .length(FIELD_LIMITS.BIK, `Должно быть ${FIELD_LIMITS.BIK} цифр`)
    .regex(VALIDATION_PATTERNS.BIK, 'Только цифры'),
  accountNumber: z.string()
    .min(1, 'Поле обязательно для заполнения')
    .length(FIELD_LIMITS.ACCOUNT_NUMBER, `Должно быть ${FIELD_LIMITS.ACCOUNT_NUMBER} цифр`)
    .regex(VALIDATION_PATTERNS.ACCOUNT_NUMBER, 'Только цифры'),
  contractNumber: z.string()
    .min(1, 'Поле обязательно для заполнения')
    .max(FIELD_LIMITS.CONTRACT_NUMBER, `Максимум ${FIELD_LIMITS.CONTRACT_NUMBER} символов`),
  contractDate: z.string()
    .min(1, 'Поле обязательно для заполнения'),
  useAutoMarketing: z.boolean(),
})

type CreateAdvertiserFormData = z.infer<typeof createAdvertiserSchema>

const CreateAdvertiserPage: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
  } = useForm<CreateAdvertiserFormData>({
    resolver: zodResolver(createAdvertiserSchema),
    defaultValues: {
      useAutoMarketing: false,
    },
  })

  const useAutoMarketing = watch('useAutoMarketing')

  const onSubmit = async (data: CreateAdvertiserFormData) => {
    try {
      setIsLoading(true)
      
      // TODO: Заменить на реальный API вызов
      console.log('Creating advertiser:', data)
      
      // Имитация API вызова
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      notify.success('Рекламодатель создан', 'Рекламодатель успешно добавлен в систему')
      navigate('/advertisers')
    } catch (error) {
      notify.error('Ошибка создания', 'Не удалось создать рекламодателя')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (isDirty) {
      if (confirm('Есть несохраненные изменения. Вы уверены, что хотите покинуть страницу?')) {
        navigate('/advertisers')
      }
    } else {
      navigate('/advertisers')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <GlassCard className="p-8">
          <div className="space-y-8">
            {/* Form fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  Наименование рекламодателя
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-100/50 border border-gray-200 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all font-normal"
                  maxLength={FIELD_LIMITS.ADVERTISER_NAME}
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1 font-normal">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  Наименование юр лица
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-100/50 border border-gray-200 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all font-normal"
                  maxLength={FIELD_LIMITS.LEGAL_NAME}
                  {...register('legalName')}
                />
                {errors.legalName && (
                  <p className="text-xs text-red-600 mt-1 font-normal">{errors.legalName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  ИНН
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-100/50 border border-gray-200 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all font-normal"
                  maxLength={FIELD_LIMITS.INN}
                  {...register('inn')}
                />
                {errors.inn && (
                  <p className="text-xs text-red-600 mt-1 font-normal">{errors.inn.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  КПП
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-100/50 border border-gray-200 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all font-normal"
                  maxLength={FIELD_LIMITS.KPP}
                  {...register('kpp')}
                />
                {errors.kpp && (
                  <p className="text-xs text-red-600 mt-1 font-normal">{errors.kpp.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  ОГРН/ОГРНИП
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-100/50 border border-gray-200 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all font-normal"
                  maxLength={FIELD_LIMITS.OGRN}
                  {...register('ogrn')}
                />
                {errors.ogrn && (
                  <p className="text-xs text-red-600 mt-1 font-normal">{errors.ogrn.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  Юридический адрес
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-100/50 border border-gray-200 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all font-normal resize-none h-24"
                  maxLength={FIELD_LIMITS.LEGAL_ADDRESS}
                  {...register('legalAddress')}
                />
                {errors.legalAddress && (
                  <p className="text-xs text-red-600 mt-1 font-normal">{errors.legalAddress.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  БИК
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-100/50 border border-gray-200 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all font-normal"
                  maxLength={FIELD_LIMITS.BIK}
                  {...register('bik')}
                />
                {errors.bik && (
                  <p className="text-xs text-red-600 mt-1 font-normal">{errors.bik.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  р/с
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-100/50 border border-gray-200 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all font-normal"
                  maxLength={FIELD_LIMITS.ACCOUNT_NUMBER}
                  {...register('accountNumber')}
                />
                {errors.accountNumber && (
                  <p className="text-xs text-red-600 mt-1 font-normal">{errors.accountNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  Номер договора
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-100/50 border border-gray-200 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all font-normal"
                  maxLength={FIELD_LIMITS.CONTRACT_NUMBER}
                  {...register('contractNumber')}
                />
                {errors.contractNumber && (
                  <p className="text-xs text-red-600 mt-1 font-normal">{errors.contractNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  Дата заключения договора
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-gray-100/50 border border-gray-200 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all font-normal"
                  {...register('contractDate')}
                />
                {errors.contractDate && (
                  <p className="text-xs text-red-600 mt-1 font-normal">{errors.contractDate.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useAutoMarketing"
                  className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                  checked={useAutoMarketing}
                  onChange={(e) => setValue('useAutoMarketing', e.target.checked)}
                />
                <label htmlFor="useAutoMarketing" className="ml-2 text-sm text-gray-700 font-normal">
                  Использовать автомаркировку в ОРД
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-normal text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Отменить
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-black text-white rounded-lg text-sm font-normal hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </GlassCard>
      </form>
    </div>
  )
}

export default CreateAdvertiserPage
