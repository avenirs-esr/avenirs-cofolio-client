import type { ExternalUserDetailDTO, GroupReferenceDTO } from '@/api/avenir-esr'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { EGroupType } from '@/api/avenir-esr'
import { getUserGroupsByType, getUserGroupsByTypeExcluding } from '@/features/staff/admin/utils/groups.utils'

const programGroup: GroupReferenceDTO = {
  id: 'program-1',
  name: 'Programme',
  type: EGroupType.PROGRAM,
}

const programOptionGroup: GroupReferenceDTO = {
  id: 'program-option-1',
  name: 'Option de formation',
  type: EGroupType.PROGRAM_OPTION,
}

const studentGroup: GroupReferenceDTO = {
  id: 'student-group-1',
  name: 'Groupe d’apprenants',
  type: EGroupType.STUDENT_GROUP,
}

const user: ExternalUserDetailDTO = {
  id: 'user-1',
  firstName: 'Alice',
  lastName: 'Dupont',
  email: 'alice.dupont@example.com',
  institution: {
    id: 'institution-1',
    name: 'Institution',
  },
  groups: [programGroup, programOptionGroup, studentGroup],
}

BddTest().given('getUserGroupsByType', () => {
  BddTest().when('a single group type is provided', () => {
    BddTest().then('it returns only groups matching that type', () => {
      expect(getUserGroupsByType(user, EGroupType.PROGRAM)).toEqual([programGroup])
    })
  })

  BddTest().when('multiple group types are provided', () => {
    BddTest().then('it returns groups matching any of those types', () => {
      expect(getUserGroupsByType(user, [
        EGroupType.PROGRAM,
        EGroupType.STUDENT_GROUP,
      ])).toEqual([programGroup, studentGroup])
    })
  })

  BddTest().when('no group matches the requested types', () => {
    BddTest().then('it returns an empty array', () => {
      expect(getUserGroupsByType(user, [])).toEqual([])
    })
  })

  BddTest().when('the user has no groups', () => {
    BddTest().then('it returns an empty array', () => {
      expect(getUserGroupsByType({ ...user, groups: [] }, EGroupType.PROGRAM)).toEqual([])
    })
  })
})

BddTest().given('getUserGroupsByTypeExcluding', () => {
  BddTest().when('a single group type is excluded', () => {
    BddTest().then('it returns all groups except those matching that type', () => {
      expect(getUserGroupsByTypeExcluding(user, EGroupType.PROGRAM)).toEqual([programOptionGroup, studentGroup])
    })
  })

  BddTest().when('multiple group types are excluded', () => {
    BddTest().then('it returns groups that match none of the excluded types', () => {
      expect(getUserGroupsByTypeExcluding(user, [
        EGroupType.PROGRAM,
        EGroupType.STUDENT_GROUP,
      ])).toEqual([programOptionGroup])
    })
  })

  BddTest().when('all group types are excluded', () => {
    BddTest().then('it returns an empty array', () => {
      expect(getUserGroupsByTypeExcluding(user, [
        EGroupType.PROGRAM,
        EGroupType.PROGRAM_OPTION,
        EGroupType.STUDENT_GROUP,
      ])).toEqual([])
    })
  })

  BddTest().when('the user has no groups', () => {
    BddTest().then('it returns an empty array', () => {
      expect(getUserGroupsByTypeExcluding({ ...user, groups: [] }, EGroupType.PROGRAM)).toEqual([])
    })
  })
})
