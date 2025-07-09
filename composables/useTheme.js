"use client"

import { ref, watch } from "vue"

const theme = ref("light")

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light"
  }

  const setTheme = (newTheme) => {
    theme.value = newTheme
  }

  // Apply theme to document
  watch(
    theme,
    (newTheme) => {
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    },
    { immediate: true },
  )

  return {
    theme,
    toggleTheme,
    setTheme,
  }
}
