import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Edit, Check, X, AlertTriangle } from 'lucide-react'

interface BudgetControlProps {
  budget: number
  spent: number
  currency?: string
  onBudgetChange: (newBudget: number) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  showSpent?: boolean
  showProgress?: boolean
  className?: string
  warningThreshold?: number // процент от бюджета для предупреждения
  maxBudget?: number // максимальный доступный бюджет
}

const BudgetControl: React.FC<BudgetControlProps> = ({
  budget,
  spent = 0,
  currency = '$',
  onBudgetChange,
  disabled = false,
  size = 'md',
  showSpent = true,
  showProgress = true,
  className = '',
  warningThreshold = 80,
  maxBudget
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(budget.toString())
  const [isValid, setIsValid] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          text: 'text-sm',
          input: 'text-sm px-2 py-1',
          button: 'p-1',
          icon: 'h-3 w-3'
        }
      case 'md':
        return {
          text: 'text-base',
          input: 'text-base px-3 py-2',
          button: 'p-2',
          icon: 'h-4 w-4'
        }
      case 'lg':
        return {
          text: 'text-lg',
          input: 'text-lg px-4 py-3',
          button: 'p-3',
          icon: 'h-5 w-5'
        }
    }
  }

  const sizeClasses = getSizeClasses()
  const spentPercentage = budget > 0 ? (spent / budget) * 100 : 0
  const isOverBudget = spent > budget
  const isNearLimit = spentPercentage >= warningThreshold

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const validateBudget = (value: string): boolean => {
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue < 0) return false
    if (maxBudget && numValue > maxBudget) return false
    if (numValue < spent) return false
    return true
  }

  const handleDoubleClick = () => {
    if (!disabled) {
      setIsEditing(true)
      setEditValue(budget.toString())
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEditValue(value)
    setIsValid(validateBudget(value))
  }

  const handleSave = () => {
    if (isValid) {
      const newBudget = parseFloat(editValue)
      onBudgetChange(newBudget)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditValue(budget.toString())
    setIsValid(true)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const formatCurrency = (amount: number) => {
    return `${currency}${amount.toLocaleString()}`
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Budget Display/Edit */}
      <div className="flex items-center gap-2">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <div className="relative">
              <input
                ref={inputRef}
                type="number"
                value={editValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                className={`
                  ${sizeClasses.input} border rounded-lg focus:outline-none focus:ring-2
                  ${isValid 
                    ? 'border-gray-300 focus:ring-blue-500' 
                    : 'border-red-300 focus:ring-red-500 bg-red-50'
                  }
                `}
                placeholder="Введите бюджет"
                min="0"
                max={maxBudget}
              />
              {!isValid && (
                <div className="absolute -bottom-6 left-0 text-xs text-red-600">
                  {maxBudget && parseFloat(editValue) > maxBudget
                    ? `Максимум ${formatCurrency(maxBudget)}`
                    : parseFloat(editValue) < spent
                    ? `Минимум ${formatCurrency(spent)}`
                    : 'Некорректное значение'
                  }
                </div>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={!isValid}
              className={`
                ${sizeClasses.button} bg-green-600 text-white rounded-lg 
                hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors focus:outline-none focus:ring-2 focus:ring-green-500
              `}
            >
              <Check className={sizeClasses.icon} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className={`
                ${sizeClasses.button} bg-gray-600 text-white rounded-lg 
                hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500
              `}
            >
              <X className={sizeClasses.icon} />
            </motion.button>
          </div>
        ) : (
          <div
            onDoubleClick={handleDoubleClick}
            className={`
              flex items-center gap-2 ${sizeClasses.text} font-medium cursor-pointer
              ${disabled ? 'text-gray-500 cursor-not-allowed' : 'text-gray-900 hover:text-blue-600'}
              ${!disabled ? 'hover:bg-blue-50 px-2 py-1 rounded transition-colors' : ''}
            `}
            title={disabled ? '' : 'Двойной клик для редактирования'}
          >
            <span>{formatCurrency(budget)}</span>
            {!disabled && <Edit className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
          </div>
        )}

        {/* Warning indicators */}
        {(isOverBudget || isNearLimit) && (
          <div className="flex items-center gap-1">
            <AlertTriangle 
              className={`h-4 w-4 ${isOverBudget ? 'text-red-500' : 'text-yellow-500'}`} 
            />
            {isOverBudget && (
              <span className="text-xs text-red-600">Превышен</span>
            )}
          </div>
        )}
      </div>

      {/* Spent Amount */}
      {showSpent && (
        <div className={`${sizeClasses.text} text-gray-600`}>
          Потрачено: <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
            {formatCurrency(spent)}
          </span>
        </div>
      )}

      {/* Progress Bar */}
      {showProgress && budget > 0 && (
        <div className="w-full">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{spentPercentage.toFixed(1)}% использовано</span>
            <span>Остаток: {formatCurrency(Math.max(0, budget - spent))}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, spentPercentage)}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`
                h-2 rounded-full transition-colors
                ${isOverBudget 
                  ? 'bg-red-500' 
                  : isNearLimit 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'
                }
              `}
            />
          </div>
        </div>
      )}

      {/* Additional Information */}
      {maxBudget && (
        <div className="text-xs text-gray-500">
          Доступно: {formatCurrency(maxBudget - budget)}
        </div>
      )}
    </div>
  )
}

export default BudgetControl
