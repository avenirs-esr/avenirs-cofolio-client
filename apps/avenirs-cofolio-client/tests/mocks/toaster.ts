export const mockAddErrorMessage = vi.fn()
export const mockAddSuccessMessage = vi.fn()

vi.mock('@avenirs-esr/shared', async importOriginal => ({
  ...await importOriginal<typeof import('@avenirs-esr/shared')>(),
  useToasterStore: () => ({
    addErrorMessage: mockAddErrorMessage,
    addSuccessMessage: mockAddSuccessMessage,
  }),
}))
