import type { AdditionalSkillConfigurationDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { getAdditionalSkillConfig } from '@/api/avenir-esr/generated/additional-skill-config-controller'
import { useQuery } from '@tanstack/vue-query'

export function useAdditionalSkillConfig () {
  return useQuery<AdditionalSkillConfigurationDTO, BaseApiException>({
    queryKey: ['additional-skill-config'],
    queryFn: async () => {
      return await getAdditionalSkillConfig()
    }
  })
}
