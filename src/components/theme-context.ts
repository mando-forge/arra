import { createContext, useContext } from "react"

export type Theme = "dark" | "light" | "system"

export type ThemeProviderState = {
  theme: Theme
  resolvedTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
}

export const initialThemeProviderState: ThemeProviderState = {
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => null,
}

export const ThemeProviderContext = createContext<ThemeProviderState>(
  initialThemeProviderState
)

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
