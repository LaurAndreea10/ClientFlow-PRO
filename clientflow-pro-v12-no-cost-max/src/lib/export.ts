export function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function exportReportAsPrintableHtml(title: string, htmlBody: string) {
  const popup = window.open('', '_blank', 'width=900,height=700')
  if (!popup) return false
  popup.document.write(`<!doctype html><html><head><title>${title}</title><style>
    body{font-family:Inter,system-ui,sans-serif;padding:32px;color:#0f172a}
    h1,h2{margin:0 0 12px}
    .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin:16px 0}
    .card{border:1px solid #cbd5e1;border-radius:16px;padding:16px}
    @media print{button{display:none} body{padding:0}}
  </style></head><body>${htmlBody}<script>window.onload=()=>window.print()<\/script></body></html>`)
  popup.document.close()
  return true
}
