import React from 'react'
import clsx from 'clsx'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    label,
    error,
    helpText,
    leftIcon,
    rightIcon,
    fullWidth = true,
    id,
    ...props
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={clsx('space-y-1', fullWidth ? 'w-full' : 'w-auto')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-secondary-700"
          >
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-secondary-400">
                {leftIcon}
              </div>
            </div>
          )}
          
          <input
            type={type}
            id={inputId}
            ref={ref}
            className={clsx(
              'block w-full px-3 py-2 border rounded-md text-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error 
                ? 'border-error-300 focus:ring-error-500 focus:border-error-500' 
                : 'border-secondary-300 focus:ring-primary-500 focus:border-primary-500',
              props.disabled && 'bg-secondary-50 text-secondary-500 cursor-not-allowed',
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-secondary-400">
                {rightIcon}
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-error-600">
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p className="text-sm text-secondary-500">
            {helpText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
export default Input
