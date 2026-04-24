import type { Client, Task } from '../types'
import { useLanguage } from '../lib/i18n'

type Recommendation = {
  title: string
  detail: string
  action: string
  tone: 'success' | 'warning' | 'info'
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
}

export function AiCopilotPanel({ clients, tasks }: { clients: Client[]; tasks: Task[] }) {
  const { language } = useLanguage()
  const activeClients = clients.filter((client) => !client.archived)
  const openTasks = tasks.filter((task) => !task.archived && task.status !== 'done')
  const overdueTasks = openTasks.filter((task) => task.dueDate && task.dueDate < new Date().toISOString().slice(0, 10))
  const highValueLeads = activeClients.filter((client) => client.status === 'lead' && client.monthlyValue >= 1500)
  const lowHealthClients = activeClients.filter((client) => (client.healthScore ?? 100) < 70)
  const monthlyRevenue = activeClients.reduce((sum, client) => sum + client.monthlyValue, 0)
  const forecast = Math.round(monthlyRevenue * 1.18)

  const recommendations: Recommendation[] = language === 'RO'
    ? [
        overdueTasks.length
          ? { title: `${overdueTasks.length} task-uri au depășit termenul`, detail: 'Mută-le în topul priorităților ca să protejezi livrarea.', action: 'Deschide Tasks și filtrează după deadline', tone: 'warning' }
          : { title: 'Livrarea este sub control', detail: 'Nu există task-uri întârziate în workspace-ul activ.', action: 'Continuă cu task-urile high-priority', tone: 'success' },
        highValueLeads.length
          ? { title: `${highValueLeads.length} lead-uri cu valoare mare`, detail: `Valoare potențială: ${formatCurrency(highValueLeads.reduce((sum, client) => sum + client.monthlyValue, 0))} / lună.`, action: 'Trimite follow-up și ofertă personalizată', tone: 'info' }
          : { title: 'Pipeline curat', detail: 'Nu există lead-uri high-value neatinse în acest moment.', action: 'Adaugă lead-uri noi sau actualizează pipeline-ul', tone: 'info' },
        lowHealthClients.length
          ? { title: `${lowHealthClients.length} clienți cu risc`, detail: 'Scorul de sănătate indică risc de churn sau lipsă de follow-up.', action: 'Programează check-in săptămânal', tone: 'warning' }
          : { title: 'Health score stabil', detail: 'Conturile active au scoruri sănătoase pentru un demo portfolio.', action: 'Menține ritmul de contact', tone: 'success' },
      ]
    : [
        overdueTasks.length
          ? { title: `${overdueTasks.length} tasks are overdue`, detail: 'Move them to the top of the queue to protect delivery quality.', action: 'Open Tasks and review deadlines', tone: 'warning' }
          : { title: 'Delivery is under control', detail: 'There are no overdue tasks in the active workspace.', action: 'Continue with high-priority work', tone: 'success' },
        highValueLeads.length
          ? { title: `${highValueLeads.length} high-value leads`, detail: `Potential value: ${formatCurrency(highValueLeads.reduce((sum, client) => sum + client.monthlyValue, 0))} / month.`, action: 'Send a follow-up and tailored quote', tone: 'info' }
          : { title: 'Pipeline is clean', detail: 'No untouched high-value leads are waiting right now.', action: 'Add new leads or update pipeline stages', tone: 'info' },
        lowHealthClients.length
          ? { title: `${lowHealthClients.length} clients at risk`, detail: 'Health score suggests churn risk or missing follow-up.', action: 'Schedule a weekly check-in', tone: 'warning' }
          : { title: 'Health score is stable', detail: 'Active accounts are healthy for a portfolio-ready demo.', action: 'Keep contact cadence consistent', tone: 'success' },
      ]

  return (
    <section className="card card-pad ai-panel">
      <div className="card-title-row">
        <div>
          <p className="eyebrow">{language === 'RO' ? 'Asistent AI' : 'AI Copilot'}</p>
          <h2 style={{ margin: 0 }}>{language === 'RO' ? 'Recomandări operaționale' : 'Operational recommendations'}</h2>
          <div className="small muted">
            {language === 'RO'
              ? 'Analiză locală pe baza clienților, task-urilor, scorurilor și valorii pipeline-ului.'
              : 'Local analysis based on clients, tasks, health scores and pipeline value.'}
          </div>
        </div>
        <div className="pill">{language === 'RO' ? 'Forecast' : 'Forecast'} · {formatCurrency(forecast)}</div>
      </div>

      <div className="ai-grid">
        {recommendations.map((item) => (
          <article className={`ai-card ${item.tone}`} key={item.title}>
            <strong>{item.title}</strong>
            <p className="small muted">{item.detail}</p>
            <div className="small ai-action">{item.action}</div>
          </article>
        ))}
      </div>
    </section>
  )
}
