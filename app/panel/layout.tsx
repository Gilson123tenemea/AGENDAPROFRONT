import { Sidebar } from "@/components/panel/sidebar"

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Demo user data - in production this would come from auth context
  const user = {
    name: "Dra. Maria Garcia",
    subtitle: "Dermatologia",
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="professional" user={user} />
      <div className="lg:pl-64">
        <main className="min-h-screen p-4 pt-4 lg:p-6 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  )
}
