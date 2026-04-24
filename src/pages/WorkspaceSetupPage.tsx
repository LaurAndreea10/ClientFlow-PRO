import { FormEvent, useState } from 'react'
import {
  createTeamAccess,
  getCurrentAccess,
  getTeamAccess,
  getWorkspaceProfile,
  industryTemplates,
  permissionLabels,
  rolePresets,
  saveWorkspaceProfile,
  type AccessRole,
  type IndustryKey,
  type PermissionKey,
  type TeamAccess,
  type WorkspaceProfile,
} from '../lib/workspaceAccess'

const industryOptions: { key: IndustryKey; label: string }[] = [
  { key: 'beauty', label: 'Beauty / Salon' },
  { key: 'auto', label: 'Mecanic auto' },
  { key: 'kineto', label: 'Kinetoterapeut' },
  { key: 'psychology', label: 'Psiholog' },
  { key: 'custom', label: 'Personalizat' },
]

const allPermissions = Object.keys(permissionLabels) as PermissionKey[]

export function WorkspaceSetupPage() {
  const currentAccess = getCurrentAccess()
  const [profile, setProfile] = useState<WorkspaceProfile | null>(() => getWorkspaceProfile())
  const [team, setTeam] = useState<TeamAccess[]>(() => getTeamAccess())
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<AccessRole>('employee')
  const [selectedPermissions, setSelectedPermissions] = useState<PermissionKey[]>(rolePresets.employee.permissions)
  const [copied, setCopied] = useState('')
  const isAdmin = !currentAccess || currentAccess.permissions.includes('fullAccess') || currentAccess.permissions.includes('managePermissions')

  function updateProfile(next: Partial<WorkspaceProfile>) {
    if (!profile) return
    const updated = { ...profile, ...next }
    setProfile(updated)
    saveWorkspaceProfile(updated)
  }

  function updateIndustry(next: IndustryKey) {
    if (!profile) return
    const template = industryTemplates[next]
    updateProfile({
      industry: next,
      clientLabel: template.clientLabel,
      serviceLabel: template.serviceLabel,
      statusLabels: template.statusLabels,
      customFields: template.customFields,
    })
  }

  function handleRoleChange(next: AccessRole) {
    setRole(next)
    setSelectedPermissions(rolePresets[next].permissions)
  }

  function togglePermission(permission: PermissionKey) {
    setSelectedPermissions((current) => current.includes(permission) ? current.filter((item) => item !== permission) : [...current, permission])
  }

  function handleInvite(event: FormEvent) {
    event.preventDefault()
    if (!isAdmin) return
    const access = createTeamAccess({ name, email, role, permissions: selectedPermissions })
    setTeam(getTeamAccess())
    setName('')
    setEmail('')
    setRole('employee')
    setSelectedPermissions(rolePresets.employee.permissions)
    navigator.clipboard?.writeText(access.inviteLink)
    setCopied(access.inviteLink)
  }

  function copy(link: string) {
    navigator.clipboard?.writeText(link)
    setCopied(link)
  }

  if (!profile) {
    return (
      <div className="grid">
        <section className="card card-pad">
          <h1>Workspace not configured</h1>
          <p className="muted">Create an account from Register to configure your domain-specific CRM.</p>
        </section>
      </div>
    )
  }

  return (
    <div className="grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">Workspace admin</p>
          <h1 className="page-title">CRM personalizat pe domeniu</h1>
          <p className="muted">Configurează domeniul, câmpurile CRM și accesele echipei. Adminul poate crea linkuri ClientFlow PRO pentru angajați.</p>
        </div>
        <span className="pill">{currentAccess?.role ?? 'admin'} · {currentAccess?.name ?? profile.ownerName}</span>
      </div>

      <section className="two-col">
        <div className="card card-pad">
          <div className="card-title-row"><h2 style={{ margin: 0 }}>Profil CRM</h2><span className="pill">{profile.industry}</span></div>
          <div className="form-grid">
            <input className="input" value={profile.name} onChange={(event) => updateProfile({ name: event.target.value })} disabled={!isAdmin} />
            <select className="select" value={profile.industry} onChange={(event) => updateIndustry(event.target.value as IndustryKey)} disabled={!isAdmin}>
              {industryOptions.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
            </select>
            {profile.industry === 'custom' ? <input className="input" value={profile.customIndustry ?? ''} onChange={(event) => updateProfile({ customIndustry: event.target.value })} placeholder="Domeniu personalizat" disabled={!isAdmin} /> : null}
            <div className="split-stats">
              <input className="input" value={profile.clientLabel} onChange={(event) => updateProfile({ clientLabel: event.target.value })} disabled={!isAdmin} />
              <input className="input" value={profile.serviceLabel} onChange={(event) => updateProfile({ serviceLabel: event.target.value })} disabled={!isAdmin} />
            </div>
            <textarea className="textarea" value={profile.customFields.join(', ')} onChange={(event) => updateProfile({ customFields: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} rows={3} disabled={!isAdmin} />
            <textarea className="textarea" value={profile.statusLabels.join(', ')} onChange={(event) => updateProfile({ statusLabels: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} rows={3} disabled={!isAdmin} />
          </div>
        </div>

        <aside className="card card-pad">
          <div className="card-title-row"><h2 style={{ margin: 0 }}>Creează acces</h2><span className="pill">Admin only</span></div>
          <form className="form-grid" onSubmit={handleInvite}>
            <input className="input" placeholder="Nume angajat" value={name} onChange={(event) => setName(event.target.value)} disabled={!isAdmin} required />
            <input className="input" placeholder="Email angajat" value={email} onChange={(event) => setEmail(event.target.value)} disabled={!isAdmin} required />
            <select className="select" value={role} onChange={(event) => handleRoleChange(event.target.value as AccessRole)} disabled={!isAdmin}>
              <option value="admin">Admin</option>
              <option value="employee">Angajat</option>
              <option value="new_employee">Angajat nou</option>
            </select>
            <div className="list">
              {allPermissions.map((permission) => (
                <label className="setting-toggle" key={permission}>
                  <span><strong>{permissionLabels[permission]}</strong></span>
                  <input type="checkbox" checked={selectedPermissions.includes(permission)} onChange={() => togglePermission(permission)} disabled={!isAdmin} />
                </label>
              ))}
            </div>
            <button className="button" disabled={!isAdmin}>Creează acces și copiază link</button>
          </form>
          {copied ? <p className="small muted">Link copiat: {copied}</p> : null}
        </aside>
      </section>

      <section className="card card-pad">
        <div className="card-title-row"><h2 style={{ margin: 0 }}>Echipă și permisiuni</h2><span className="pill">{team.length} access profiles</span></div>
        <div className="list">
          {team.map((member) => (
            <article className="note" key={member.id}>
              <div className="card-title-row">
                <div>
                  <strong>{member.name}</strong>
                  <div className="small muted">{member.email} · {rolePresets[member.role].label} · {member.status}</div>
                </div>
                <button className="button secondary" onClick={() => copy(member.inviteLink)}>Copiază link</button>
              </div>
              <div className="stack">
                {member.permissions.map((permission) => <span className="stack-chip" key={permission}>{permissionLabels[permission]}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
