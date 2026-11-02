export function setupWarningHandler (ignoredWarnings: readonly string[] = []) {
  const failedWarnings = ['[Vue warn]', '[intlify]']
  const originalWarn = console.warn

  console.warn = (...args: unknown[]) => {
    const message = args.map(String).join(' ')

    if (failedWarnings.some(warningPrefix => message.includes(warningPrefix))) {
      if (ignoredWarnings.some(text => message.includes(text))) {
        originalWarn(...args)
        return
      }

      throw new Error(`❌ Vue warning detected during test:\n${message}`)
    }

    originalWarn(...args)
  }
}
