"use client"

import { ref, onMounted } from "vue"

export function useTheme() {
  const theme = ref("light")

  const applyTheme = (newTheme) => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    try {
      localStorage.setItem("theme", newTheme)
    } catch (e) {
      console.warn("Could not save theme to localStorage.", e)
    }
    theme.value = newTheme
  }

  const toggleTheme = () => {
    applyTheme(theme.value === "light" ? "dark" : "light")
  }

  onMounted(() => {
    let savedTheme = "light"
    try {
      savedTheme = localStorage.getItem("theme")
    } catch (e) {
      console.warn("Could not read theme from localStorage.", e)
    }

    if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
      applyTheme(savedTheme)
    } else {
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      applyTheme(prefersDark ? "dark" : "light")
    }
  })

  return {
    theme,
    toggleTheme,
    setTheme: applyTheme,
  }
}
