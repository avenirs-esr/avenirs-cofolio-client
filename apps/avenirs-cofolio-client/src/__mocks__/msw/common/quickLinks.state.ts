import type { QuickLinksDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { EUserCategory } from '@avenirs-esr/shared/api/avenir-esr'
import { mockedStaffQuickLinks } from '@/__mocks__/fixtures/staffs/user.fixtures'
import { mockedStudentQuickLinks } from '@/__mocks__/fixtures/student/user.fixtures'

export const quickLinksState: Record<EUserCategory, QuickLinksDTO> = {
  [EUserCategory.STAFF]: structuredClone(mockedStaffQuickLinks),
  [EUserCategory.STUDENT]: structuredClone(mockedStudentQuickLinks),
}
