import React from 'react'
import clsx from 'clsx'
import { ChevronDown, Check } from 'lucide-react'
interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectProps {
  label?: string
  error?: string
  helpText?: string
  placeholder?: string
  options: SelectOption[]
  value?: string | string[]
  onChange: (value: string | string[]) => void
  multiple?: boolean
  disabled?: boolean
  required?: boolean
  fullWidth?: boolean
  className?: string
  id?: string
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({
    label,
    error,
    helpText,
    placeholder = 'Выберите...',
    options,
    value,
    onChange,
    multiple = false,
    disabled = false,
    required = false,
    fullWidth = true,
    className,
    id,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`

    const handleOptionClick = (optionValue: string) => {
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : []
        const newValues = currentValues.includes(optionValue)
          ? currentValues.filter(v => v !== optionValue)
          : [...currentValues, optionValue]
        onChange(newValues)
      } else {
        onChange(optionValue)
        setIsOpen(false)
      }
    }

    const selectedOptions = React.useMemo(() => {
      if (!value) return []
      const values = Array.isArray(value) ? value : [value]
      return options.filter(option => values.includes(option.value.toString()))
    }, [value, options])

    const displayText = React.useMemo(() => {
      if (selectedOptions.length === 0) return placeholder
      if (selectedOptions.length === 1) return selectedOptions[0].label
      return `Выбрано: ${selectedOptions.length}`
    }, [selectedOptions, placeholder])

      return (
    <div 
      className={clsx('space-y-1', fullWidth ? 'w-full' : 'w-auto')} 
      ref={ref}
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-normal text-gray-700"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          id={selectId}
          className={clsx(
            'relative w-full pl-3 pr-8 py-2.5 text-left cursor-default focus:outline-none transition-all duration-200 text-sm font-normal rounded-2xl',
            'bg-white/15 backdrop-blur-lg border border-white/25 hover:bg-white/20 hover:border-white/30',
            error
              ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 focus:border-rose-400'
              : 'focus:ring-2 focus:ring-gray-400 focus:border-white/40',
            disabled && 'opacity-60 cursor-not-allowed',
            className
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          {...props}
        >
          <span className={clsx(
            'block truncate',
            selectedOptions.length === 0 && 'text-gray-500'
          )}>
            {displayText}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown
              className={clsx(
                'h-4 w-4 text-gray-500 transition-transform duration-200',
                isOpen && 'transform rotate-180'
              )}
            />
          </span>
        </button>

        {isOpen && !disabled && (
          <>
            {/* Overlay для закрытия по клику вне */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div 
              className="absolute z-20 mt-2 w-full max-h-60 rounded-2xl py-2 text-sm overflow-auto focus:outline-none shadow-2xl border border-white/25"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.2) 0%, 
                    rgba(255, 255, 255, 0.1) 100%
                  )
                `,
                backdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: `
                  0 20px 40px rgba(0,0,0,0.1),
                  0 1px 0 rgba(255,255,255,0.2) inset
                `,
              }}
            >
              {options.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 font-normal">
                  Нет доступных вариантов
                </div>
              ) : (
                options.map((option) => {
                  const isSelected = Array.isArray(value) 
                    ? value.includes(option.value.toString())
                    : value === option.value.toString()

                  return (
                    <div
                      key={option.value.toString()}
                      className={clsx(
                        'cursor-pointer select-none relative py-2.5 pl-4 pr-10 font-normal transition-all duration-200 mx-1 rounded-lg',
                        option.disabled && 'opacity-50 cursor-not-allowed',
                        isSelected 
                          ? 'bg-gray-900 text-white' 
                          : 'text-gray-700 hover:bg-white/30 hover:text-gray-900'
                      )}
                      onClick={() => !option.disabled && handleOptionClick(option.value.toString())}
                    >
                      <span className="block truncate">
                        {option.label}
                      </span>
                      
                      {isSelected && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <Check className="h-4 w-4 text-white" />
                        </span>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="text-sm text-rose-600 font-normal">
          {error}
        </p>
      )}

      {helpText && !error && (
        <p className="text-sm text-gray-500 font-normal">
          {helpText}
        </p>
      )}
    </div>
  )
  }
)

Select.displayName = 'Select'

export { Select }
export type { SelectOption }
export default Select
