import { describe, expect, it } from 'vitest'
import { clientsToCsv, parseCsv } from '../csv'

describe('csv roundtrip', () => {
  it('keeps commas and quotes in client fields', () => {
    const csv = clientsToCsv([{
      id: '1',
      userId: 'u1',
      name: 'Ana "A"',
      company: 'Studio, North',
      email: 'ana@example.com',
      phone: '123',
      status: 'active',
      monthlyValue: 250,
      createdAt: new Date().toISOString(),
    }])

    const rows = parseCsv(csv)
    expect(rows[0].name).toBe('Ana "A"')
    expect(rows[0].company).toBe('Studio, North')
  })
})
