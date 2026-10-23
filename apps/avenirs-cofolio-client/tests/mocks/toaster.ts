export const mockAddErrorMessage = vi.fn()
export const mockAddSuccessMessage = vi.fn()

vi.mock('@/store/toaster/toaster', () => ({
  useToasterStore: () => ({
    addErrorMessage: mockAddErrorMessage,
    addSuccessMessage: mockAddSuccessMessage,
  }),
}))
