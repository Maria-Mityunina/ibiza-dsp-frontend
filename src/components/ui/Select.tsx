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
      <div className={clsx('space-y-1', fullWidth ? 'w-full' : 'w-auto')} ref={ref}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-normal text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <button
            type="button"
            id={selectId}
            className={clsx(
              'relative w-full bg-white border rounded-md pl-3 pr-8 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-offset-0 transition-colors text-sm font-normal',
              error
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500',
              disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed',
              className
            )}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            {...props}
          >
            <span className={clsx(
              'block truncate',
              selectedOptions.length === 0 && 'text-gray-400'
            )}>
              {displayText}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown
                className={clsx(
                  'h-4 w-4 text-gray-400 transition-transform',
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
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 shadow-lg max-h-60 rounded-md py-1 text-sm overflow-auto focus:outline-none">
                {options.length === 0 ? (
                  <div className="px-3 py-2 text-gray-500 font-normal">
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
                          'cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 font-normal transition-colors',
                          option.disabled && 'opacity-50 cursor-not-allowed',
                          isSelected && 'bg-black text-white'
                        )}
                        onClick={() => !option.disabled && handleOptionClick(option.value.toString())}
                      >
                        <span className={clsx('block truncate', isSelected && 'font-normal')}>
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
          <p className="text-sm text-red-600 font-normal">
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
