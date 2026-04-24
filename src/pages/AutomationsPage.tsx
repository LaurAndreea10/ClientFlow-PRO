import { useState } from 'react'
import { runAllEnabledAutomations, runAutomationRule } from '../lib/automationEngine'
import { readSuiteCollection, updateSuiteItem, type AutomationRule } from '../lib/suiteStorage'
import { useLanguage } from '../lib/i18n'
import { can } from '../lib/workspaceAccess'

export function AutomationsPage() {
  const { language } = useLanguage()
  const ro = language === 'RO'
  const canRun = can('edit') || can('validateClientStatus')
  const canManage = can('managePermissions') || can('fullAccess')
  const [rules, setRules] = useState<AutomationRule[]>(() => readSuiteCollection('automations'))
  const [message, setMessage] = useState('')

  function refresh() {
    setRules(readSuiteCollection('automations'))
  }

  async function runOne(rule: AutomationRule) {
    if (!canRun) return
    const created = await runAutomationRule(rule)
    setMessage(ro ? `${created} notificări generate.` : `${created} notifications generated.`)
    refresh()
  }

  async function runAll() {
    if (!canRun) return
    const created = await runAllEnabledAutomations()
    setMessage(ro ? `${created} notificări generate din toate regulile active.` : `${created} notifications generated from all enabled rules.`)
    refresh()
  }

  function toggle(rule: AutomationRule) {
    if (!canManage) return
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
        <button className="button" disabled={!canRun} onClick={runAll}>{ro ? 'Rulează toate' : 'Run all'}</button>
      </div>

      {!canRun || !canManage ? <section className="card card-pad"><strong>Access mode</strong><p className="small muted" style={{ marginBottom: 0 }}>Run: {canRun ? 'enabled' : 'disabled'} · Manage rules: {canManage ? 'enabled' : 'disabled'}</p></section> : null}
      {message ? <div className="card card-pad"><strong>{message}</strong></div> : null}

      <section className="suite-grid">
        {rules.map((rule) => (
          <article className="card card-pad suite-card" key={rule.id}>
            <div className="suite-icon">⚙️</div>
            <div className="small muted">{rule.trigger}</div>
            <h2>{rule.name}</h2>
            <p className="muted">{rule.action}</p>
            <div className="toolbar">
              <button className="button secondary" disabled={!canManage} onClick={() => toggle(rule)}>{rule.enabled ? (ro ? 'Activă' : 'Enabled') : (ro ? 'Inactivă' : 'Disabled')}</button>
              <button className="button" disabled={!canRun} onClick={() => runOne(rule)}>{ro ? 'Rulează' : 'Run'}</button>
            </div>
            {rule.lastRunAt ? <div className="small muted" style={{ marginTop: 12 }}>Last run: {rule.lastRunAt}</div> : null}
          </article>
        ))}
      </section>
    </div>
  )
}
