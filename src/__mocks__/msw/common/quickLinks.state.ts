import { mockedStaffQuickLinks } from '@/__mocks__/fixtures/staffs/user.fixtures'
import { mockedStudentQuickLinks } from '@/__mocks__/fixtures/student/user.fixtures'
import { EUserCategory, type QuickLinksDTO } from '@/api/avenir-esr'

export const quickLinksState: Record<EUserCategory, QuickLinksDTO> = {
  [EUserCategory.STAFF]: structuredClone(mockedStaffQuickLinks),
  [EUserCategory.STUDENT]: structuredClone(mockedStudentQuickLinks),
}
