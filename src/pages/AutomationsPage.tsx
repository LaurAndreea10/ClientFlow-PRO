import { useState } from 'react'
import { runAllEnabledAutomations, runAutomationRule } from '../lib/automationEngine'
import { readSuiteCollection, updateSuiteItem, type AutomationRule } from '../lib/suiteStorage'
import { useLanguage } from '../lib/i18n'

export function AutomationsPage() {
  const { language } = useLanguage()
  const ro = language === 'RO'
  const [rules, setRules] = useState<AutomationRule[]>(() => readSuiteCollection('automations'))
  const [message, setMessage] = useState('')

  function refresh() {
    setRules(readSuiteCollection('automations'))
  }

  async function runOne(rule: AutomationRule) {
    const created = await runAutomationRule(rule)
    setMessage(ro ? `${created} notificări generate.` : `${created} notifications generated.`)
    refresh()
  }

  async function runAll() {
    const created = await runAllEnabledAutomations()
    setMessage(ro ? `${created} notificări generate din toate regulile active.` : `${created} notifications generated from all enabled rules.`)
    refresh()
  }

  function toggle(rule: AutomationRule) {
    updateSuiteItem('automations', rule.id, { enabled: !rule.enabled })
    refresh()
  }

  return (
    <div className="grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">{ro ? 'Automatizări' : 'Automations'}</p>
          <h1 className="page-title">{ro ? 'Reguli operaționale locale' : 'Local operational rules'}</h1>
          <p className="muted">{ro ? 'Rulează scenarii reale pe datele demo: task-uri, facturi, bookings și lead-uri.' : 'Run real scenarios against demo data: tasks, invoices, bookings and leads.'}</p>
        </div>
        <button className="button" onClick={runAll}>{ro ? 'Rulează toate' : 'Run all'}</button>
      </div>

      {message ? <div className="card card-pad"><strong>{message}</strong></div> : null}

      <section className="suite-grid">
        {rules.map((rule) => (
          <article className="card card-pad suite-card" key={rule.id}>
            <div className="suite-icon">⚙️</div>
            <div className="small muted">{rule.trigger}</div>
            <h2>{rule.name}</h2>
            <p className="muted">{rule.action}</p>
            <div className="toolbar">
              <button className="button secondary" onClick={() => toggle(rule)}>{rule.enabled ? (ro ? 'Activă' : 'Enabled') : (ro ? 'Inactivă' : 'Disabled')}</button>
              <button className="button" onClick={() => runOne(rule)}>{ro ? 'Rulează' : 'Run'}</button>
            </div>
            {rule.lastRunAt ? <div className="small muted" style={{ marginTop: 12 }}>Last run: {rule.lastRunAt}</div> : null}
          </article>
        ))}
      </section>
    </div>
  )
}
