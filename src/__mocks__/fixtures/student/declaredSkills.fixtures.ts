import { type DeclaredSkillAssociationDTO, EDeclaredSkillLevel, EExternalSkillType } from '@/api/avenir-esr'

export function createMockedDeclaredActivityAssociations (count: number): DeclaredSkillAssociationDTO[] {
  return Array.from({ length: count }, (_, index) => ({
    associationId: `association-id-${index}`,
    declaredSkill: {
      id: `declared-activity-id-${index}`,
      title: `Declared skill ${index + 1}`,
      pathSegments: ['first', 'second', 'third'],
      type: EExternalSkillType.ROME4,
      level: EDeclaredSkillLevel.BEGINNER,
      description: `Description for declared skill ${index + 1}`
    }
  })) as DeclaredSkillAssociationDTO[]
}
