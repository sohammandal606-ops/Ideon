import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { ProjectModalProvider } from "@/context/project-modal-context";
import { SidebarProvider } from "@/context/sidebar-context";
import { NewProjectModal } from "@/components/dashboard/new-project-modal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <ProjectModalProvider>
        <div className="flex h-screen overflow-hidden bg-[#0c0e12] font-sans text-zinc-100">
          {/* Foldable Sidebar */}
          <DashboardSidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Top Header */}
            <DashboardHeader />

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto bg-[#0c0e12] p-4 sm:p-6 lg:p-8">
              <div className="max-w-[1400px] mx-auto space-y-6">{children}</div>
            </main>
          </div>

          {/* Global New Project / AI Analysis Modal */}
          <NewProjectModal />
        </div>
      </ProjectModalProvider>
    </SidebarProvider>
  );
}
