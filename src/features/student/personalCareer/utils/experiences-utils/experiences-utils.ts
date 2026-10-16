import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'
import { EExperienceType } from '@/api/avenir-esr'

export function isProfessional (experience: DeclaredExperienceViewDTO, professionalExperience: boolean) {
  return (experience.experienceType === EExperienceType.PROFESSIONAL) === professionalExperience
}
