import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, CalendarDays } from 'lucide-react'

interface TimeSchedulerProps {
  startTime?: string
  endTime?: string
  selectedDays?: number[]
  allDay?: boolean
  onTimeChange?: (startTime: string, endTime: string) => void
  onDaysChange?: (days: number[]) => void
  onAllDayChange?: (allDay: boolean) => void
  className?: string
}

const TimeScheduler: React.FC<TimeSchedulerProps> = ({
  startTime = '00:00',
  endTime = '23:59',
  selectedDays = [0, 1, 2, 3, 4, 5, 6],
  allDay = true,
  onTimeChange,
  onDaysChange,
  onAllDayChange,
  className = ''
}) => {
  const [localStartTime, setLocalStartTime] = useState(startTime)
  const [localEndTime, setLocalEndTime] = useState(endTime)
  const [localSelectedDays, setLocalSelectedDays] = useState(selectedDays)
  const [localAllDay, setLocalAllDay] = useState(allDay)

  const daysOfWeek = [
    { value: 1, label: 'Пн', full: 'Понедельник' },
    { value: 2, label: 'Вт', full: 'Вторник' },
    { value: 3, label: 'Ср', full: 'Среда' },
    { value: 4, label: 'Чт', full: 'Четверг' },
    { value: 5, label: 'Пт', full: 'Пятница' },
    { value: 6, label: 'Сб', full: 'Суббота' },
    { value: 0, label: 'Вс', full: 'Воскресенье' }
  ]

  useEffect(() => {
    if (localAllDay) {
      setLocalStartTime('00:00')
      setLocalEndTime('23:59')
      onTimeChange?.('00:00', '23:59')
    }
  }, [localAllDay, onTimeChange])

  const handleStartTimeChange = (time: string) => {
    setLocalStartTime(time)
    onTimeChange?.(time, localEndTime)
  }

  const handleEndTimeChange = (time: string) => {
    setLocalEndTime(time)
    onTimeChange?.(localStartTime, time)
  }

  const handleDayToggle = (dayValue: number) => {
    const newSelectedDays = localSelectedDays.includes(dayValue)
      ? localSelectedDays.filter(d => d !== dayValue)
      : [...localSelectedDays, dayValue]
    
    setLocalSelectedDays(newSelectedDays)
    onDaysChange?.(newSelectedDays)
  }

  const handleAllDayToggle = (checked: boolean) => {
    setLocalAllDay(checked)
    onAllDayChange?.(checked)
  }

  const selectAllDays = () => {
    const allDays = [0, 1, 2, 3, 4, 5, 6]
    setLocalSelectedDays(allDays)
    onDaysChange?.(allDays)
  }

  const selectWeekdays = () => {
    const weekdays = [1, 2, 3, 4, 5]
    setLocalSelectedDays(weekdays)
    onDaysChange?.(weekdays)
  }

  const selectWeekends = () => {
    const weekends = [0, 6]
    setLocalSelectedDays(weekends)
    onDaysChange?.(weekends)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* All day toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Круглосуточно</span>
        </div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={localAllDay}
            onChange={(e) => handleAllDayToggle(e.target.checked)}
            className="w-5 h-5 text-slate-600 rounded border-gray-300 focus:ring-slate-500"
          />
        </label>
      </div>

      {/* Time range */}
      {!localAllDay && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Время начала
            </label>
            <input
              type="time"
              value={localStartTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Время окончания
            </label>
            <input
              type="time"
              value={localEndTime}
              onChange={(e) => handleEndTimeChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
        </motion.div>
      )}

      {/* Days of week */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">Дни недели</span>
          </div>
          <div className="flex gap-2 text-sm">
            <button
              type="button"
              onClick={selectAllDays}
              className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            >
              Все
            </button>
            <button
              type="button"
              onClick={selectWeekdays}
              className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            >
              Будни
            </button>
            <button
              type="button"
              onClick={selectWeekends}
              className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            >
              Выходные
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => (
            <button
              key={day.value}
              type="button"
              onClick={() => handleDayToggle(day.value)}
              className={`
                p-3 text-sm font-medium rounded-lg border-2 transition-all
                ${localSelectedDays.includes(day.value)
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }
              `}
              title={day.full}
            >
              {day.label}
            </button>
          ))}
        </div>

        {localSelectedDays.length === 0 && (
          <p className="text-sm text-red-500">Выберите хотя бы один день</p>
        )}
      </div>

      {/* Summary */}
      <div className="p-4 bg-gray-50/50 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">Сводка расписания:</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div>
            <strong>Время:</strong> {localAllDay ? 'Круглосуточно' : `${localStartTime} - ${localEndTime}`}
          </div>
          <div>
            <strong>Дни:</strong> {
              localSelectedDays.length === 7 
                ? 'Ежедневно'
                : localSelectedDays.length === 5 && !localSelectedDays.includes(0) && !localSelectedDays.includes(6)
                ? 'Будни'
                : localSelectedDays.length === 2 && localSelectedDays.includes(0) && localSelectedDays.includes(6)
                ? 'Выходные'
                : localSelectedDays
                    .sort()
                    .map(day => daysOfWeek.find(d => d.value === day)?.label)
                    .join(', ')
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimeScheduler
