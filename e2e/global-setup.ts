import process from 'node:process'
import * as dotenv from 'dotenv'

export default async function globalSetup () {
  dotenv.config({
    path: '.env',
    override: true
  })

  console.warn('Global setup: Environment loaded')
  console.warn(`Target URL: ${process.env.VITE_API_URL}`)
}
