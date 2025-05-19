import type { BaseApiException } from '@/common/exceptions/base-api.exception'
import type { CourseDTO, SkillDTO, StudentSummaryDTO } from '@/types'
import profile_picture_banner from '@/assets/profile_banner_placeholder.png'
import profile_picture_placeholder from '@/assets/profile_picture_placeholder.png'
import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'

function useStudentProfileSummaryQuery (): UseQueryReturnType<StudentSummaryDTO, BaseApiException> {
  const queryKey = computed(() => ['user', 'student', 'summary'])
  return useQuery<StudentSummaryDTO, BaseApiException>({
    queryKey,
    // TODO: call /user/{profile}/overview when the endpoint and client are ready
    queryFn: async (): Promise<StudentSummaryDTO> => {
      return {
        id: '123456789',
        firstname: 'Jeanne',
        lastname: 'Moulin',
        profilePicture: profile_picture_placeholder,
        coverPicture: profile_picture_banner,
        bio: 'Je suis étudiante en chimie et écologie. Passionnée par l’innovation durable, je souhaite utiliser la science pour protéger l’environnement et bâtir un avenir plus respectueux de la planète.'
      }
    }
  })
}

function useStudentCoursesSummaryQuery (): UseQueryReturnType<CourseDTO[], BaseApiException> {
  const queryKey = computed(() => ['user', 'student', 'skills'])
  return useQuery<CourseDTO[], BaseApiException>({
    queryKey,
    // TODO: call /me/formations/skills/overview when the endpoint and client are ready
    queryFn: async (): Promise<CourseDTO[]> => {
      const mockedSkills: Array<SkillDTO> = [
        {
          id: 'skill1',
          name: 'Prévenir la pollution à la source',
          trackCount: 1,
          activityCount: 8,
          levels: [{ id: 'Niv1', name: 'Niv.1', status: 'VALIDATED' }, { id: 'Niv2', name: 'Niv.2', status: 'TO_EVALUATE' }]
        },
        {
          id: 'skill2',
          name: 'Mettre en place des filières d’économies circulaires',
          trackCount: 2,
          activityCount: 7,
          levels: [{ id: 'Niv1', name: 'Niv.1', status: 'VALIDATED' }, { id: 'Niv2', name: 'Niv.2', status: 'TO_EVALUATE' }]
        },
        {
          id: 'skill3',
          name: 'Évaluer l’impact environnemental et économique',
          trackCount: 3,
          activityCount: 6,
          levels: [{ id: 'Niv1', name: 'Niv.1', status: 'NOT_VALIDATED' }, { id: 'Niv2', name: 'Niv.2', status: 'UNDER_REVIEW' }]
        },
        {
          id: 'skill4',
          name: 'Concevoir des synthèses chimiques durables',
          trackCount: 4,
          activityCount: 5,
          levels: [{ id: 'Niv2', name: 'Niv.2', status: 'VALIDATED' }]
        },
        {
          id: 'skill5',
          name: 'BIS Prévenir la pollution à la source',
          trackCount: 5,
          activityCount: 4,
          levels: [{ id: 'Niv1', name: 'Niv.1', status: 'VALIDATED' }, { id: 'Niv2', name: 'Niv.2', status: 'TO_EVALUATE' }]
        },
        {
          id: 'skill6',
          name: 'BIS Mettre en place des filières d’économies circulaires',
          trackCount: 6,
          activityCount: 3,
          levels: [{ id: 'Niv1', name: 'Niv.1', status: 'VALIDATED' }, { id: 'Niv2', name: 'Niv.2', status: 'TO_EVALUATE' }]
        },
        {
          id: 'skill7',
          name: 'BIS Évaluer l’impact environnemental et économique',
          trackCount: 7,
          activityCount: 2,
          levels: [{ id: 'Niv1', name: 'Niv.1', status: 'NOT_VALIDATED' }, { id: 'Niv2', name: 'Niv.2', status: 'UNDER_REVIEW' }]
        },
        {
          id: 'skill8',
          name: 'BIS Concevoir des synthèses chimiques durables',
          trackCount: 8,
          activityCount: 1,
          levels: [{ id: 'Niv2', name: 'Niv.2', status: 'VALIDATED' }]
        },
      ]

      return [
        { id: 'course1', name: 'Master Chimie Verte et Éco-innovations', skills: mockedSkills },
      ]
    }
  })
}

export { useStudentCoursesSummaryQuery, useStudentProfileSummaryQuery }
