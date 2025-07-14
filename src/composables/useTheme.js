"use client"

import { ref, onMounted, watch } from "vue"

export function useTheme() {
  const theme = ref("light")

  const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light"
  }

  onMounted(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      theme.value = savedTheme
    }
    document.documentElement.classList.toggle("dark", theme.value === "dark")
  })

  watch(theme, (newTheme) => {
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  })

  return {
    theme,
    toggleTheme,
  }
}
