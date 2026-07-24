import {
  type AssociationsCreationRequest,
  type DeclaredSkillAssociationDTO,
  type DeclaredSkillAssociationsDTO,
  EActivityThematic,
  EDeclaredActivityStatus,
  EDeclaredSkillLevel,
  EExternalSkillType
} from '@/api/avenir-esr'

export function createMockedDeclaredActivityAssociations (count: number): DeclaredSkillAssociationDTO[] {
  return Array.from({ length: count }, (_, index) => ({
    associationId: `association-id-${index}`,
    declaredSkill: {
      id: `declared-activity-id-${index}`,
      title: `Declared skill ${index + 1}`,
      pathSegments: ['first', 'second', 'third'],
      type: EExternalSkillType.ROME4,
      level: EDeclaredSkillLevel.BEGINNER,
      description: `Description for declared skill ${index + 1}`,
      valorized: false
    }
  })) as DeclaredSkillAssociationDTO[]
}

export function createDeclaredSkillAssociationResponseFixture (associations: AssociationsCreationRequest): DeclaredSkillAssociationsDTO {
  return {
    traceAssociations: [],
    declaredActivityAssociations: associations.idsToAssociate.map((activityId, index) => ({
      associationId: `declared-activity-association-${index + 1}`,
      declaredActivity: {
        id: activityId,
        activityId: `activity-${index + 1}`,
        title: `Mocked activity ${activityId}`,
        thematic: EActivityThematic.TRANSVERSAL,
        summary: `Mocked summary for ${activityId}`,
        description: `<h3>Description for ${activityId}</h3><p>This is a mocked description for the declared activity with id ${activityId}.</p>`,
        executionPeriodInfoSummary: `Mocked execution period for ${activityId}`,
        status: EDeclaredActivityStatus.IN_PROGRESS,
        startDate: '2026-01-01',
        endDate: '2026-01-31',
        updatedAt: '2026-01-01T00:00:00Z'
      }
    }))
  }
}
