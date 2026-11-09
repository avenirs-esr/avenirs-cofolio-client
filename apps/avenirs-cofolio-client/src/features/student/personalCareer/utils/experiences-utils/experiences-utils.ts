import type { DeclaredExperienceViewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { EExperienceType } from '@avenirs-esr/shared/api/avenir-esr'

export function isProfessional (experience: DeclaredExperienceViewDTO, professionalExperience: boolean) {
  return (experience.experienceType === EExperienceType.PROFESSIONAL) === professionalExperience
}
