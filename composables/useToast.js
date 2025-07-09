"use client"

import { ref } from "vue"

const toasts = ref([])

export function useToast() {
  const toast = ({ title, description, duration = 5000 }) => {
    const id = Date.now()
    const newToast = {
      id,
      title,
      description,
      duration,
    }

    toasts.value.push(newToast)

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id)
    }, duration)

    return id
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toast,
    toasts,
    removeToast,
  }
}
