import type { Client, Task } from '../types'

function escapeCsvCell(value: string | number) {
  const stringValue = String(value ?? '')
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

export function clientsToCsv(clients: Client[]) {
  const headers = ['name', 'company', 'email', 'phone', 'status', 'monthlyValue']
  const rows = clients.map((client) => [client.name, client.company, client.email, client.phone, client.status, client.monthlyValue])
  return [headers, ...rows].map((row) => row.map(escapeCsvCell).join(',')).join('\n')
}

export function tasksToCsv(tasks: Task[]) {
  const headers = ['title', 'description', 'clientId', 'status', 'priority', 'dueDate']
  const rows = tasks.map((task) => [task.title, task.description, task.clientId ?? '', task.status, task.priority, task.dueDate])
  return [headers, ...rows].map((row) => row.map(escapeCsvCell).join(',')).join('\n')
}

export function parseCsv(text: string) {
  const lines = text.trim().split(/\r?\n/)
  if (!lines.length) return [] as Record<string, string>[]
  const headers = lines[0].split(',').map((item) => item.trim())
  return lines.slice(1).filter(Boolean).map((line) => {
    const values = line.match(/("(?:[^"]|"")*"|[^,]+)/g) ?? []
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      const raw = values[index] ?? ''
      acc[header] = raw.replace(/^"|"$/g, '').replace(/""/g, '"')
      return acc
    }, {})
  })
}
