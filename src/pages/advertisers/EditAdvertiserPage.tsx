import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save, X } from 'lucide-react'
import { Button, Input, GlassCard } from '@components/ui'
import { notify } from '@stores/notificationStore'
import { FIELD_LIMITS, VALIDATION_PATTERNS } from '@constants/formats'

// Схема валидации для редактирования рекламодателя
const editAdvertiserSchema = z.object({
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

type EditAdvertiserFormData = z.infer<typeof editAdvertiserSchema>

// Мок данные рекламодателя для редактирования
const getMockAdvertiserData = (id: string): EditAdvertiserFormData => ({
  name: 'ООО "Технологии будущего"',
  legalName: 'Общество с ограниченной ответственностью "Технологии будущего"',
  inn: '771234567890',
  kpp: '123456789',
  ogrn: '123456789012345',
  legalAddress: 'г. Москва, ул. Тверская, д. 1, оф. 100',
  bik: '044525225',
  accountNumber: '40702810123456789012',
  contractNumber: 'IBIZA-2024-001',
  contractDate: '2024-01-15',
  useAutoMarketing: true,
})

const EditAdvertiserPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<EditAdvertiserFormData>({
    resolver: zodResolver(editAdvertiserSchema),
  })

  // Загружаем данные рекламодателя при монтировании компонента
  useEffect(() => {
    if (id) {
      // TODO: Заменить на реальный API вызов
      const advertiserData = getMockAdvertiserData(id)
      reset(advertiserData)
    }
  }, [id, reset])

  const onSubmit = async (data: EditAdvertiserFormData) => {
    try {
      setIsLoading(true)
      
      // TODO: Заменить на реальный API вызов
      console.log('Updating advertiser:', id, data)
      
      // Имитация API вызова
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      notify.success('Изменения сохранены', 'Данные рекламодателя успешно обновлены')
      navigate('/advertisers')
    } catch (error) {
      notify.error('Ошибка сохранения', 'Не удалось обновить данные рекламодателя')
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

  if (!id) {
    return <div>Рекламодатель не найден</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <GlassCard className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100/50 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-normal text-black">Редактировать рекламодателя</h1>
            </div>
          </div>

          <div className="space-y-6">
            {/* Основная информация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-normal text-gray-700 mb-2">
                  Наименование рекламодателя *
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Введите наименование"
                  error={errors.name?.message}
                  {...register('name')}
                />
              </div>

              <div>
                <label htmlFor="legalName" className="block text-sm font-normal text-gray-700 mb-2">
                  Наименование юр лица *
                </label>
                <Input
                  id="legalName"
                  type="text"
                  placeholder="Введите полное наименование"
                  error={errors.legalName?.message}
                  {...register('legalName')}
                />
              </div>
            </div>

            {/* Реквизиты */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="inn" className="block text-sm font-normal text-gray-700 mb-2">
                  ИНН *
                </label>
                <Input
                  id="inn"
                  type="text"
                  placeholder="12 цифр"
                  maxLength={FIELD_LIMITS.INN}
                  error={errors.inn?.message}
                  {...register('inn')}
                />
              </div>

              <div>
                <label htmlFor="kpp" className="block text-sm font-normal text-gray-700 mb-2">
                  КПП *
                </label>
                <Input
                  id="kpp"
                  type="text"
                  placeholder="9 цифр"
                  maxLength={FIELD_LIMITS.KPP}
                  error={errors.kpp?.message}
                  {...register('kpp')}
                />
              </div>

              <div>
                <label htmlFor="ogrn" className="block text-sm font-normal text-gray-700 mb-2">
                  ОГРН/ОГРНИП *
                </label>
                <Input
                  id="ogrn"
                  type="text"
                  placeholder="15 цифр"
                  maxLength={FIELD_LIMITS.OGRN}
                  error={errors.ogrn?.message}
                  {...register('ogrn')}
                />
              </div>
            </div>

            {/* Адрес */}
            <div>
              <label htmlFor="legalAddress" className="block text-sm font-normal text-gray-700 mb-2">
                Юридический адрес *
              </label>
              <textarea
                id="legalAddress"
                rows={3}
                className="w-full px-4 py-3 bg-white/30 border border-gray-300 rounded-lg placeholder:text-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all font-normal backdrop-blur-sm resize-none"
                placeholder="Введите полный юридический адрес"
                maxLength={FIELD_LIMITS.LEGAL_ADDRESS}
                {...register('legalAddress')}
              />
              {errors.legalAddress && (
                <p className="mt-1 text-sm text-red-600 font-normal">{errors.legalAddress.message}</p>
              )}
            </div>

            {/* Банковские реквизиты */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="bik" className="block text-sm font-normal text-gray-700 mb-2">
                  БИК *
                </label>
                <Input
                  id="bik"
                  type="text"
                  placeholder="9 цифр"
                  maxLength={FIELD_LIMITS.BIK}
                  error={errors.bik?.message}
                  {...register('bik')}
                />
              </div>

              <div>
                <label htmlFor="accountNumber" className="block text-sm font-normal text-gray-700 mb-2">
                  р/с *
                </label>
                <Input
                  id="accountNumber"
                  type="text"
                  placeholder="20 цифр"
                  maxLength={FIELD_LIMITS.ACCOUNT_NUMBER}
                  error={errors.accountNumber?.message}
                  {...register('accountNumber')}
                />
              </div>
            </div>

            {/* Договор */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contractNumber" className="block text-sm font-normal text-gray-700 mb-2">
                  Номер договора *
                </label>
                <Input
                  id="contractNumber"
                  type="text"
                  placeholder="Введите номер договора"
                  maxLength={FIELD_LIMITS.CONTRACT_NUMBER}
                  error={errors.contractNumber?.message}
                  {...register('contractNumber')}
                />
              </div>

              <div>
                <label htmlFor="contractDate" className="block text-sm font-normal text-gray-700 mb-2">
                  Дата заключения договора *
                </label>
                <Input
                  id="contractDate"
                  type="date"
                  error={errors.contractDate?.message}
                  {...register('contractDate')}
                />
              </div>
            </div>

            {/* Настройки */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="useAutoMarketing"
                className="h-4 w-4 text-black focus:ring-black/20 border-gray-300 rounded"
                {...register('useAutoMarketing')}
              />
              <label htmlFor="useAutoMarketing" className="text-sm font-normal text-gray-700">
                Использовать автомаркировку в ОРД
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200/50">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
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

export default EditAdvertiserPage