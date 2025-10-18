import { PatientDetailsClient } from "@/components/dashboard/patient/patient-details-client"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function PatientDetailsPage({ params }: PageProps) {
  const { id } = await params

  return <PatientDetailsClient patientId={id} />
}
