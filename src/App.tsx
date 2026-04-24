import { Navigate, Route, Routes } from 'react-router-dom'
import { AcceptAccessPage } from './pages/AcceptAccessPage'
import { AppLayout } from './components/layout/AppLayout'
import { ActivityPage } from './pages/ActivityPage'
import { AutomationsPage } from './pages/AutomationsPage'
import { BeautyStudioPage } from './pages/BeautyStudioPage'
import { CalendarPage } from './pages/CalendarPage'
import { CaseStudyPage } from './pages/CaseStudyPage'
import { ClientDetailsPage } from './pages/ClientDetailsPage'
import { ClientPortalPage } from './pages/ClientPortalPage'
import { ClientsPage } from './pages/ClientsPage'
import { CommandCenterPage } from './pages/CommandCenterPage'
import { DashboardPage } from './pages/DashboardPage'
import { DemoPlannerPage } from './pages/DemoPlannerPage'
import { ImpactGoalsPage } from './pages/ImpactGoalsPage'
import { InvoicingPage } from './pages/InvoicingPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { PortalPreviewPage } from './pages/PortalPreviewPage'
import { PortfolioScorePage } from './pages/PortfolioScorePage'
import { RegisterPage } from './pages/RegisterPage'
import { ReportsPage } from './pages/ReportsPage'
import { SearchPage } from './pages/SearchPage'
import { ServicesPage } from './pages/ServicesPage'
import { SettingsPage } from './pages/SettingsPage'
import { SuitePage } from './pages/SuitePage'
import { TasksPage } from './pages/TasksPage'
import { TimeTrackingPage } from './pages/TimeTrackingPage'
import { WorkspaceSetupPage } from './pages/WorkspaceSetupPage'
import { ProtectedRoute } from './routes/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/portal-preview/:code" element={<PortalPreviewPage />} />
      <Route path="/accept-access/:accessId" element={<AcceptAccessPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/workspace-setup" element={<WorkspaceSetupPage />} />
          <Route path="/command-center" element={<CommandCenterPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/automations" element={<AutomationsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/portfolio-score" element={<PortfolioScorePage />} />
          <Route path="/suite" element={<SuitePage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/clients/:id" element={<ClientDetailsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/invoices" element={<InvoicingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/time" element={<TimeTrackingPage />} />
          <Route path="/portal" element={<ClientPortalPage />} />
          <Route path="/beauty" element={<BeautyStudioPage />} />
          <Route path="/demo-planner" element={<DemoPlannerPage />} />
          <Route path="/impact" element={<ImpactGoalsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/case-study" element={<CaseStudyPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
