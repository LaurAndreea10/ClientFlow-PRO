import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ActivityPage } from './pages/ActivityPage'
import { CalendarPage } from './pages/CalendarPage'
import { CaseStudyPage } from './pages/CaseStudyPage'
import { ClientDetailsPage } from './pages/ClientDetailsPage'
import { ClientPortalPage } from './pages/ClientPortalPage'
import { ClientsPage } from './pages/ClientsPage'
import { DashboardPage } from './pages/DashboardPage'
import { DemoPlannerPage } from './pages/DemoPlannerPage'
import { ImpactGoalsPage } from './pages/ImpactGoalsPage'
import { InvoicingPage } from './pages/InvoicingPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RegisterPage } from './pages/RegisterPage'
import { ReportsPage } from './pages/ReportsPage'
import { ServicesPage } from './pages/ServicesPage'
import { SettingsPage } from './pages/SettingsPage'
import { SuitePage } from './pages/SuitePage'
import { TasksPage } from './pages/TasksPage'
import { TimeTrackingPage } from './pages/TimeTrackingPage'
import { ProtectedRoute } from './routes/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/suite" element={<SuitePage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/clients/:id" element={<ClientDetailsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/invoices" element={<InvoicingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/time" element={<TimeTrackingPage />} />
          <Route path="/portal" element={<ClientPortalPage />} />
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
