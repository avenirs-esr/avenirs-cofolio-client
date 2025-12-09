#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const [feature, subFeatureName] = process.argv.slice(2)

if (!feature || !subFeatureName) {
  console.error('❌ Error: Missing required arguments')
  console.log('Usage: npm run generate:feature <feature> <subFeatureName>')
  console.log('  feature: student or teacher')
  console.log('  subFeatureName: name of the sub-feature (camelCase)')
  process.exit(1)
}

if (!['student', 'teacher'].includes(feature)) {
  console.error('❌ Error: feature must be either "student" or "teacher"')
  process.exit(1)
}

const featurePath = join(__dirname, '..', 'src', 'features', feature, subFeatureName)

if (existsSync(featurePath)) {
  console.error(`❌ Error: Feature "${subFeatureName}" already exists at ${featurePath}`)
  process.exit(1)
}

console.log(`📦 Generating feature structure for: ${feature}/${subFeatureName}`)

const folders = [
  'components',
  'composables',
  'queries',
  'routes',
  'stores',
  'types',
  'views',
  'locales'
]

folders.forEach((folder) => {
  const folderPath = join(featurePath, folder)
  mkdirSync(folderPath, { recursive: true })
  console.log(`  ✓ Created ${folder}/`)
})

const routesIndexContent = `export default []
`

writeFileSync(join(featurePath, 'routes', 'index.ts'), routesIndexContent)
console.log('  ✓ Created routes/index.ts')

const localeContent = {
  [feature]: {
    [subFeatureName]: {}
  }
}

writeFileSync(
  join(featurePath, 'locales', 'en.json'),
  `${JSON.stringify(localeContent, null, 2)}\n`
)
console.log('  ✓ Created locales/en.json')

writeFileSync(
  join(featurePath, 'locales', 'fr.json'),
  `${JSON.stringify(localeContent, null, 2)}\n`
)
console.log('  ✓ Created locales/fr.json')

const barrelContent = `export default {}
`

writeFileSync(join(featurePath, 'index.ts'), barrelContent)
console.log('  ✓ Created index.ts (barrel file)')

console.log(`\n✅ Feature "${subFeatureName}" generated successfully!`)
console.log(`📍 Location: src/features/${feature}/${subFeatureName}`)
console.log('\n📝 Next steps:')
console.log(`  1. Add your components to src/features/${feature}/${subFeatureName}/components/`)
console.log(`  2. Define routes in src/features/${feature}/${subFeatureName}/routes/index.ts`)
console.log(`  3. Add translations to locales/en.json and locales/fr.json`)
console.log(`  4. Export public API in index.ts`)
