import { type DeclaredExperienceViewDTO, EExperienceType } from '@/api/avenir-esr'
import { isProfessional } from '@/features/student/personalCareer/utils/experiences-utils/experiences-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'

BddTest().given('an isProfessional utility function', () => {
  let result: ReturnType<typeof isProfessional>

  const partialProfessionalExperience: Partial<DeclaredExperienceViewDTO> = {
    experienceType: EExperienceType.PROFESSIONAL
  }
  const partialPersonalExperience: Partial<DeclaredExperienceViewDTO> = {
    experienceType: EExperienceType.PERSONAL
  }

  BddTest().when('the experience is professional and professionalExperience is true', () => {
    beforeEach(() => {
      result = isProfessional(partialProfessionalExperience as DeclaredExperienceViewDTO, true)
    })

    BddTest().then('it should return true', () => {
      expect(result).toBe(true)
    })
  })

  BddTest().when('the experience is professional and professionalExperience is false', () => {
    beforeEach(() => {
      result = isProfessional(partialProfessionalExperience as DeclaredExperienceViewDTO, false)
    })

    BddTest().then('it should return false', () => {
      expect(result).toBe(false)
    })
  })

  BddTest().when('the experience is not professional and professionalExperience is true', () => {
    beforeEach(() => {
      result = isProfessional(partialPersonalExperience as DeclaredExperienceViewDTO, true)
    })

    BddTest().then('it should return false', () => {
      expect(result).toBe(false)
    })
  })

  BddTest().when('the experience is not professional and professionalExperience is false', () => {
    beforeEach(() => {
      result = isProfessional(partialPersonalExperience as DeclaredExperienceViewDTO, false)
    })

    BddTest().then('it should return true', () => {
      expect(result).toBe(true)
    })
  })
})
