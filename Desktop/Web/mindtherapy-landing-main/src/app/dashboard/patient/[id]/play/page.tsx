import { PatientPlayClient } from "@/components/dashboard/patient/patient-play-client"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function PatientPlayPage({ params }: PageProps) {
  const { id } = await params

  return <PatientPlayClient patientId={id} />
}
