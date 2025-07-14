"use client"

import { ref, onMounted } from "vue"

export function useTheme() {
  const theme = ref("light")

  const applyTheme = (themeValue) => {
    if (themeValue === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("theme", themeValue)
    theme.value = themeValue
  }

  const toggleTheme = () => {
    applyTheme(theme.value === "light" ? "dark" : "light")
  }

  onMounted(() => {
    const savedTheme = localStorage.getItem("theme")
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
