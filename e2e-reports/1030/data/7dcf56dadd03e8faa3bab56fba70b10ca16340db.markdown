# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/student/tools/kit/kit.feature.spec.js >> Student Tools Kit View >> Page Load and Basic Display >> Student can see their profile card
- Location: .features-gen/tests/student/tools/kit/kit.feature.spec.js:24:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('profile-card')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByTestId('profile-card')

```

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('profile-card').getByTestId('profile-banner')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByTestId('profile-card').getByTestId('profile-banner')

```

# Test source

```ts
  1  | import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
  2  | import { verifyTextLocator } from '@e2e/framework/shared/utils/text'
  3  | import { expect, type Locator } from '@playwright/test'
  4  | 
  5  | export class ProfileCard extends BaseObject {
  6  |   constructor (root: Locator) {
  7  |     super(root)
  8  |   }
  9  | 
  10 |   getProfileBanner () {
  11 |     return this.root.getByTestId('profile-banner')
  12 |   }
  13 | 
  14 |   getProfilePicture () {
  15 |     return this.root.getByTestId('profile-picture')
  16 |   }
  17 | 
  18 |   getFullName () {
  19 |     return this.root.getByTestId('profile-full-name')
  20 |   }
  21 | 
  22 |   getBio () {
  23 |     return this.root.getByTestId('profile-bio')
  24 |   }
  25 | 
  26 |   async verifyProfileBanner () {
> 27 |     await expect(this.getProfileBanner()).toBeVisible()
     |                                           ^ Error: expect(locator).toBeVisible() failed
  28 |   }
  29 | 
  30 |   async verifyProfilePicture () {
  31 |     await expect(this.getProfilePicture()).toBeVisible()
  32 |   }
  33 | 
  34 |   async verifyFullName () {
  35 |     await verifyTextLocator(this.getFullName())
  36 |   }
  37 | 
  38 |   async verifyBio () {
  39 |     await verifyTextLocator(this.getBio())
  40 |   }
  41 | 
  42 |   async verifyBioHidden () {
  43 |     await expect(this.getBio()).toBeHidden()
  44 |   }
  45 | 
  46 |   async verifyCardContent () {
  47 |     await this.verifyProfileBanner()
  48 |     await this.verifyProfilePicture()
  49 |     await this.verifyFullName()
  50 |     await this.verifyBio()
  51 |   }
  52 | }
  53 | 
```