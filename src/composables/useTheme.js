"use client"

import { ref, onMounted } from "vue"

export function useTheme() {
  const theme = ref("light")

  const applyTheme = (newTheme) => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(newTheme)
    localStorage.setItem("theme", newTheme)
    theme.value = newTheme
  }

  const toggleTheme = () => {
    const newTheme = theme.value === "light" ? "dark" : "light"
    applyTheme(newTheme)
  }

  onMounted(() => {
    const savedTheme = localStorage.getItem("theme") || "light"
    applyTheme(savedTheme)
  })

  return {
    theme,
    toggleTheme,
  }
}
