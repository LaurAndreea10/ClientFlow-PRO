import { render, screen } from '@testing-library/react'
import { LoadingBlock } from '../LoadingBlock'

describe('LoadingBlock', () => {
  it('renders a busy loading placeholder', () => {
    render(<LoadingBlock lines={2} />)
    expect(screen.getByRole('generic', { busy: true })).toBeInTheDocument()
  })
})
