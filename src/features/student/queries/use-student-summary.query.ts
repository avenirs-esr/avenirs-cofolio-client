import type { BaseApiException } from '@/common/exceptions/base-api.exception'
import type { StudentSummaryDTO } from '@/types'
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

export { useStudentProfileSummaryQuery }
