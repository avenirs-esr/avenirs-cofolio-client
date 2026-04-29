#!/usr/bin/env node

import { Buffer } from 'node:buffer'
import { readFileSync } from 'node:fs'
import https from 'node:https'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const { diffSpecs } = require('openapi-diff')

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const REMOTE_SPEC_URL = 'https://dev.avenirs-esr.fr/apim/api-specs/openapi-merged.json'
const LOCAL_SPEC_PATH = join(__dirname, '../api-specs/avenir-esr.swagger.json')

async function fetchRemoteSpec () {
  console.log(`⬇️  Fetching remote spec from ${REMOTE_SPEC_URL}...`)
  return new Promise((resolve, reject) => {
    https.get(REMOTE_SPEC_URL, { rejectUnauthorized: false }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch remote spec: ${res.statusCode} ${res.statusMessage}`))
        res.resume()
        return
      }
      const chunks = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
      res.on('error', reject)
    }).on('error', reject)
  })
}

async function compareSpecs (localSpecContent, remoteSpecContent) {
  console.log('🔍 Comparing local spec with remote spec...\n')
  try {
    return await diffSpecs({
      sourceSpec: { content: localSpecContent, location: 'local', format: 'openapi3' },
      destinationSpec: { content: remoteSpecContent, location: 'remote', format: 'openapi3' },
    })
  }
  catch (err) {
    console.error(`❌ Diff failed: ${err.message}`)
    process.exit(1)
  }
}

function printBreakingChanges (breaking) {
  console.log(`🚨 Breaking changes (${breaking.length}):`)
  for (const diff of breaking) {
    console.log(`  ⛔ [${diff.action.toUpperCase()}] ${diff.entity} — ${diff.code}`)
    if (diff.sourceSpecEntityDetails?.length) {
      for (const d of diff.sourceSpecEntityDetails) {
        console.log(`       source: ${d.location}`)
      }
    }
    if (diff.destinationSpecEntityDetails?.length) {
      for (const d of diff.destinationSpecEntityDetails) {
        console.log(`       dest:   ${d.location}`)
      }
    }
  }
  console.log()
}

function printNonBreakingChanges (nonBreaking) {
  console.log(`ℹ️  Non-breaking changes (${nonBreaking.length}):`)
  for (const diff of nonBreaking) {
    console.log(`  ✅ [${diff.action.toUpperCase()}] ${diff.entity} — ${diff.code}`)
  }
  console.log()
}

function printUnclassifiedChanges (unclassified) {
  console.log(`⚠️  Unclassified changes (${unclassified.length}):`)
  for (const diff of unclassified) {
    console.log(`  ❓ [${diff.action.toUpperCase()}] ${diff.entity} — ${diff.code}`)
  }
  console.log()
}

function printResults (result) {
  const breaking = result.breakingDifferences ?? []
  const nonBreaking = result.nonBreakingDifferences ?? []
  const unclassified = result.unclassifiedDifferences ?? []

  if (breaking.length === 0 && nonBreaking.length === 0 && unclassified.length === 0) {
    console.log('✅ No differences found between local and remote specs.')
    return
  }

  if (nonBreaking.length > 0) {
    printNonBreakingChanges(nonBreaking)
  }
  if (unclassified.length > 0) {
    printUnclassifiedChanges(unclassified)
  }

  if (breaking.length > 0) {
    printBreakingChanges(breaking)
  }

  if (breaking.length > 0) {
    process.exit(1)
  }
}

async function run () {
  if (process.env.CI || process.env.IS_DOCKER) {
    console.log('⏭️  Skipping API diff check in CI environment')
    return
  }

  let remoteSpecContent

  try {
    remoteSpecContent = await fetchRemoteSpec()
  }
  catch (err) {
    console.error(`❌ ${err.message}`)
    process.exit(1)
  }

  console.log('✅ Remote spec fetched\n')

  const localSpecContent = readFileSync(LOCAL_SPEC_PATH, 'utf-8')
  const result = await compareSpecs(localSpecContent, remoteSpecContent)
  printResults(result)
}

run()
