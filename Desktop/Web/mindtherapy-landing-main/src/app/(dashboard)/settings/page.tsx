import type { Metadata } from "next"
import { SettingsForm } from "@/components/settings/settings-form"

export const metadata: Metadata = {
  title: "Definições | MindTherapy",
  description: "Gerir as definições da sua conta MindTherapy",
}

export default function SettingsPage() {
  return <SettingsForm />
}
