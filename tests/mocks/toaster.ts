export const mockAddErrorMessage = vi.fn()

vi.mock('@/store/toaster/toaster', () => ({
  useToasterStore: () => ({
    addErrorMessage: mockAddErrorMessage,
  }),
}))
