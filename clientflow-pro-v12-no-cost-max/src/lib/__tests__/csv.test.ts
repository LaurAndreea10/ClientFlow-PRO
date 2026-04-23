import { clientsToCsv, parseCsv } from '../csv'

describe('csv helpers', () => {
  it('exports clients and parses rows', () => {
    const csv = clientsToCsv([{ id: '1', userId: 'u1', name: 'Ana', company: 'Bloom', email: 'ana@example.com', phone: '1', status: 'active', monthlyValue: 400, createdAt: '2026-01-01' }])
    expect(csv).toContain('Ana')
    const parsed = parseCsv('name,company,email\nAna,Bloom,ana@example.com')
    expect(parsed[0].company).toBe('Bloom')
  })
})
