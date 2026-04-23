import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useToast } from '../features/toast/ToastContext'
import { bulkDeleteClients, bulkUpdateClientsStatus, createClient, deleteClient, getClients, importClientsCsv, restoreDeletedClient, updateClient } from '../lib/mockApi'
import type { Client, ClientStatus } from '../types'
import { LoadingBlock } from '../components/ui/LoadingBlock'
import { clearDraft, readDraft, writeDraft } from '../lib/uiState'

const defaultForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  status: 'lead' as ClientStatus,
  monthlyValue: '0',
}

const CLIENT_FORM_DRAFT = 'clientflow_draft_client_form'

export function ClientsPage() {
  const queryClient = useQueryClient()
  const { pushToast } = useToast()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | ClientStatus>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'value'>('newest')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [form, setForm] = useState(() => readDraft(CLIENT_FORM_DRAFT, defaultForm))
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data: clients = [], isLoading, isError } = useQuery({ queryKey: ['clients'], queryFn: getClients })

  useEffect(() => {
    if (!editingId) writeDraft(CLIENT_FORM_DRAFT, form)
  }, [form, editingId])

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['clients'] })
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    queryClient.invalidateQueries({ queryKey: ['reports'] })
    queryClient.invalidateQueries({ queryKey: ['activity'] })
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }

  const createMutation = useMutation({ mutationFn: createClient, onSuccess: () => { refresh(); setForm(defaultForm); clearDraft(CLIENT_FORM_DRAFT); pushToast('Client added', 'success') } })
  const updateMutation = useMutation({ mutationFn: ({ id, payload }: { id: string; payload: Partial<Client> }) => updateClient(id, payload), onSuccess: () => { refresh(); setEditingId(null); setForm(defaultForm); clearDraft(CLIENT_FORM_DRAFT); pushToast('Client updated', 'success') } })
  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: (payload) => {
      refresh()
      pushToast({
        title: 'Client deleted',
        type: 'warning',
        action: {
          label: 'Undo',
          onClick: async () => {
            await restoreDeletedClient(payload)
            refresh()
          },
        },
      })
    },
  })
  const bulkDeleteMutation = useMutation({ mutationFn: bulkDeleteClients, onSuccess: () => { refresh(); setSelectedIds([]); pushToast('Selected clients deleted', 'warning') } })
  const bulkStatusMutation = useMutation({ mutationFn: ({ ids, status }: { ids: string[]; status: ClientStatus }) => bulkUpdateClientsStatus(ids, status), onSuccess: () => { refresh(); setSelectedIds([]); pushToast('Bulk status updated', 'success') } })
  const importMutation = useMutation({ mutationFn: importClientsCsv, onSuccess: (count) => { refresh(); pushToast(`${count} clients imported`, 'success') } })

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim()
    const base = clients.filter((client) => {
      const matchesSearch = `${client.name} ${client.company} ${client.email}`.toLowerCase().includes(term)
      const matchesStatus = filterStatus === 'all' || client.status === filterStatus
      return matchesSearch && matchesStatus
    })
    if (sortBy === 'name') return [...base].sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'value') return [...base].sort((a, b) => b.monthlyValue - a.monthlyValue)
    return [...base].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  }, [clients, search, filterStatus, sortBy])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const payload = { name: form.name, company: form.company, email: form.email, phone: form.phone, status: form.status, monthlyValue: Number(form.monthlyValue) || 0 }
    if (editingId) return updateMutation.mutate({ id: editingId, payload })
    createMutation.mutate(payload)
  }

  function startEdit(client: Client) {
    setEditingId(client.id)
    setForm({ name: client.name, company: client.company, email: client.email, phone: client.phone, status: client.status, monthlyValue: String(client.monthlyValue) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() { setEditingId(null); setForm(defaultForm); clearDraft(CLIENT_FORM_DRAFT) }
  function toggleSelected(id: string) { setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]) }

  async function handleImportFile(file: File) {
    const text = await file.text()
    importMutation.mutate(text)
  }

  function confirmDeleteClient(id: string) {
    if (!window.confirm('Delete this client and all related tasks/notes?')) return
    deleteMutation.mutate(id)
  }

  function confirmBulkDelete() {
    if (!selectedIds.length || !window.confirm(`Delete ${selectedIds.length} selected clients?`)) return
    bulkDeleteMutation.mutate(selectedIds)
  }

  return (
    <div className="grid page-gap-lg">
      <div className="page-header stack-on-mobile">
        <div>
          <p className="eyebrow">Client management</p>
          <h1 className="page-title">Clients</h1>
          <p className="muted">Search, sort, bulk edit, import CSV, and keep a saved draft while you work.</p>
        </div>
        <div className="page-header-actions mobile-full">
          <div className="pill">👥 {clients.length} total</div>
          <div className="pill">💸 €{clients.reduce((sum, item) => sum + item.monthlyValue, 0)}</div>
        </div>
      </div>

      <div className="two-col two-col-equal mobile-reverse">
        <div className="card card-pad sticky-card-mobile">
          <div className="card-title-row stack-on-mobile">
            <div>
              <h2 style={{ margin: 0 }}>{editingId ? 'Edit client' : 'Add client'}</h2>
              <div className="small muted">{editingId ? 'Update an existing client card.' : 'Create a new contact card in seconds.'}</div>
            </div>
            <div className="toolbar compact-toolbar wrap-row">
              {!editingId && form.name ? <span className="pill small-pill">Draft saved</span> : null}
              {editingId ? <button className="button secondary" type="button" onClick={resetForm}>Cancel</button> : null}
            </div>
          </div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="client-name">Full name</label>
            <input id="client-name" className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
            <label className="sr-only" htmlFor="client-company">Company</label>
            <input id="client-company" className="input" placeholder="Company" value={form.company} onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))} required />
            <label className="sr-only" htmlFor="client-email">Email</label>
            <input id="client-email" className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
            <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
            <select className="select" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as ClientStatus }))}>
              <option value="lead">lead</option><option value="active">active</option><option value="inactive">inactive</option>
            </select>
            <input className="input" type="number" min="0" placeholder="Monthly value" value={form.monthlyValue} onChange={(e) => setForm((prev) => ({ ...prev, monthlyValue: e.target.value }))} />
            <button className="button" disabled={createMutation.isPending || updateMutation.isPending}>{editingId ? 'Save changes' : 'Add client'}</button>
          </form>
        </div>

        <div className="card card-pad">
          <div className="card-title-row stack-on-mobile">
            <div>
              <h2 style={{ margin: 0 }}>Client list</h2>
              <div className="small muted">Search, sort, select multiple items, then run bulk actions.</div>
            </div>
            <label className="button secondary" style={{ cursor: 'pointer' }}>
              Import CSV
              <input type="file" accept=".csv" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && handleImportFile(e.target.files[0])} />
            </label>
          </div>

          <div className="toolbar toolbar-stack-mobile wrap-row" style={{ marginBottom: 16 }}>
            <input className="input" placeholder="Search clients, companies or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="select compact-control" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as 'all' | ClientStatus)}>
              <option value="all">All statuses</option><option value="lead">Lead</option><option value="active">Active</option><option value="inactive">Inactive</option>
            </select>
            <select className="select compact-control" value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}>
              <option value="newest">Newest</option><option value="name">Name</option><option value="value">Monthly value</option>
            </select>
          </div>

          {selectedIds.length ? (
            <div className="toolbar wrap-row bulk-bar">
              <span className="pill">{selectedIds.length} selected</span>
              <button className="button secondary" type="button" onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: 'active' })}>Mark active</button>
              <button className="button secondary" type="button" onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: 'inactive' })}>Mark inactive</button>
              <button className="button danger" type="button" onClick={confirmBulkDelete}>Delete selected</button>
            </div>
          ) : null}

          {isLoading ? <LoadingBlock lines={5} /> : null}
          {isError ? <div className="empty-state premium-empty-state"><strong>Could not load clients.</strong><div className="small muted">Try refreshing the page.</div></div> : null}

          <div className="mobile-card-list">
            {filtered.map((client) => (
              <article key={client.id} className="mobile-list-card">
                <div className="mobile-list-row">
                  <label className="checkbox-row"><input type="checkbox" checked={selectedIds.includes(client.id)} onChange={() => toggleSelected(client.id)} aria-label={`Select ${client.name}`} /> <span /></label>
                  <div style={{ flex: 1 }}>
                    <strong>{client.name}</strong>
                    <div className="small muted">{client.company}</div>
                  </div>
                  <span className={`badge ${client.status}`}>{client.status}</span>
                </div>
                <div className="small muted" style={{ marginTop: 8 }}>{client.email} • {client.phone || 'No phone'}</div>
                <div className="mobile-list-row wrap-row" style={{ marginTop: 12 }}>
                  <div className="toolbar compact-toolbar wrap-row">
                    <span className="pill small-pill">€{client.monthlyValue}/mo</span>
                    <span className="pill small-pill">Created {new Date(client.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="toolbar compact-toolbar wrap-row">
                    <Link className="button secondary" to={`/clients/${client.id}`}>Open</Link>
                    <button className="button secondary" onClick={() => startEdit(client)} type="button">Edit</button>
                    <button className="button danger" onClick={() => confirmDeleteClient(client.id)} type="button">Delete</button>
                  </div>
                </div>
              </article>
            ))}
            {!isLoading && filtered.length === 0 ? <div className="empty-state premium-empty-state"><div className="empty-icon">🗂️</div><strong>No clients match this view.</strong><div className="small muted">Add a new contact, import CSV or change the filters above.</div></div> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
