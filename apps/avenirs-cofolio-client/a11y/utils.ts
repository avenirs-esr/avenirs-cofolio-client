export async function waitMswToStart (page) {
  await page.waitForLoadState('networkidle')
}
