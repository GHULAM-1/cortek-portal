"use client"

import * as React from "react"
import { Attribute, ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode
  attribute?: Attribute | Attribute[]
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}) {
  return <NextThemesProvider attribute={props.attribute} defaultTheme={props.defaultTheme} enableSystem={props.enableSystem} disableTransitionOnChange={props.disableTransitionOnChange}>{children}</NextThemesProvider>
}
