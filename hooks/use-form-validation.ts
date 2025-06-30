"use client"

import type React from "react"

import { useState, useCallback } from "react"

type ValidationRules<T> = {
  [K in keyof T]?: {
    required?: boolean
    pattern?: RegExp
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    custom?: (value: T[K]) => boolean
    message?: string
  }
}

type ValidationErrors<T> = {
  [K in keyof T]?: string
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T>,
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<ValidationErrors<T>>({})
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setValues((prev) => ({ ...prev, [name]: value }))

      // Clear error when field is edited
      if (errors[name as keyof T]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[name as keyof T]
          return newErrors
        })
      }
    },
    [errors],
  )

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }, [])

  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]): string | undefined => {
      const rules = validationRules[name]
      if (!rules) return undefined

      if (rules.required && (!value || (typeof value === "string" && value.trim() === ""))) {
        return rules.message || `${String(name)} is required`
      }

      if (rules.pattern && typeof value === "string" && !rules.pattern.test(value)) {
        return rules.message || `${String(name)} is invalid`
      }

      if (rules.minLength && typeof value === "string" && value.length < rules.minLength) {
        return rules.message || `${String(name)} must be at least ${rules.minLength} characters`
      }

      if (rules.maxLength && typeof value === "string" && value.length > rules.maxLength) {
        return rules.message || `${String(name)} must be at most ${rules.maxLength} characters`
      }

      if (rules.min && typeof value === "number" && value < rules.min) {
        return rules.message || `${String(name)} must be at least ${rules.min}`
      }

      if (rules.max && typeof value === "number" && value > rules.max) {
        return rules.message || `${String(name)} must be at most ${rules.max}`
      }

      if (rules.custom && !rules.custom(value)) {
        return rules.message || `${String(name)} is invalid`
      }

      return undefined
    },
    [validationRules],
  )

  const validate = useCallback(() => {
    const newErrors: ValidationErrors<T> = {}
    let isValid = true

    Object.keys(validationRules).forEach((key) => {
      const fieldName = key as keyof T
      const error = validateField(fieldName, values[fieldName])

      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [validateField, validationRules, values])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({} as Record<keyof T, boolean>)
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setValues,
  }
}
