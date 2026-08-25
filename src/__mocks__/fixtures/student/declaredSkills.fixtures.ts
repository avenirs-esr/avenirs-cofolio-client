import {
  type AssociationsCreationRequest,
  type DeclaredSkillAssociationDTO,
  type DeclaredSkillAssociationsDTO,
  EActivityThematic,
  EDeclaredActivityStatus,
  EDeclaredSkillLevel,
  EExperienceType,
  EExternalSkillType
} from '@/api/avenir-esr'

export function createMockedDeclaredSkillAssociations (count: number): DeclaredSkillAssociationDTO[] {
  return Array.from({ length: count }, (_, index) => ({
    associationId: `association-id-${index}`,
    declaredSkill: {
      id: `declared-skill-id-${index}`,
      title: `Declared skill ${index + 1}`,
      pathSegments: ['first', 'second', 'third'],
      type: EExternalSkillType.ROME4,
      level: EDeclaredSkillLevel.BEGINNER,
      reflection: `Description for declared skill ${index + 1}`,
      valorized: false,
      associationsCount: { traceAssociationsCount: 0, declaredActivityAssociationsCount: 0 }
    }
  }))
}

export function createDeclaredSkillAssociationResponseFixture (associations: AssociationsCreationRequest): DeclaredSkillAssociationsDTO {
  const declaredExperienceAssociations = associations.idsToAssociate
    .filter(id => id.startsWith('experience-'))
    .map((experienceId, index) => ({
      associationId: `declared-experience-association-${index + 1}`,
      declaredExperience: {
        id: experienceId,
        title: `Mocked experience ${experienceId}`,
        experienceType: index % 2 === 0 ? EExperienceType.PERSONAL : EExperienceType.PROFESSIONAL,
        organization: `Organization ${index + 1}`,
        location: `Location ${index + 1}`,
        description: `Mocked description for ${experienceId}`,
        startDate: '2026-01',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        declaredExperienceAssociationCountDTO: {
          traceAssociationsCount: 0,
          declaredSkillAssociationsCount: 0
        }
      }
    }))

  const declaredActivityAssociations = associations.idsToAssociate
    .filter(id => id.startsWith('activity-'))
    .map((activityId, index) => ({
      associationId: `declared-activity-association-${index + 1}`,
      declaredActivity: {
        id: activityId,
        activityId: `activity-${index + 1}`,
        title: `Mocked activity ${activityId}`,
        thematic: EActivityThematic.TRANSVERSAL,
        summary: `Mocked summary for ${activityId}`,
        description: `<h3>Description for ${activityId}</h3><p>This is a mocked description for the declared activity with id ${activityId}.</p>`,
        status: EDeclaredActivityStatus.IN_PROGRESS,
        startDate: '2026-01-01',
        endDate: '2026-01-31',
        updatedAt: '2026-01-01T00:00:00Z'
      }
    }))

  return {
    traceAssociations: [],
    declaredActivityAssociations,
    declaredExperienceAssociations
  }
}
