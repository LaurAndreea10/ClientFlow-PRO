import { describe, expect, it } from 'vitest'
import { clearDraft, readDraft, writeDraft } from '../uiState'

describe('uiState draft helpers', () => {
  it('writes and reads a draft', () => {
    writeDraft('draft-key', { title: 'Saved' })
    expect(readDraft('draft-key', { title: '' })).toEqual({ title: 'Saved' })
  })

  it('clears a draft', () => {
    writeDraft('draft-key-clear', { title: 'Temp' })
    clearDraft('draft-key-clear')
    expect(readDraft('draft-key-clear', { title: '' })).toEqual({ title: '' })
  })
})
