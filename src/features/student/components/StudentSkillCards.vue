<script setup lang="ts">
import { AvCard, AvSkillCard, palette } from '@/ui'
import { AvSkillAcademicIcon } from '@/ui/icons'
</script>

<template>
  <div class="fr-container fr-mt-3w fr-mt-md-5w fr-mb-5w">
    <AvCard>
      <div class="student-skill-cards__title">
        <AvSkillAcademicIcon :color="palette.foreground.icon" />
        <h5 :style="{ color: palette.foreground.text1 }">
          Mes compétences visées par ma formation
        </h5>
      </div>
      <div class="av-container__skillcards">
        <AvSkillCard
          title="Prévenir la pollution à la source"
          :attachments="3"
          :practices="1"
          skill="academic"
          :last-validated-level="1"
          current-level-status="toEvaluate"
          :max-level="3"
          skill-color="#7216D4"
        />

        <AvSkillCard
          title="Mettre en place des filières d’économies circulaires"
          :attachments="2"
          :practices="0"
          skill="academic"
          :last-validated-level="1"
          current-level-status="toEvaluate"
          :max-level="3"
          skill-color="#9E0592"
        />

        <AvSkillCard
          title="Évaluer l’impact environnemental et économique"
          :attachments="4"
          :practices="3"
          skill="academic"
          :last-validated-level="0"
          current-level-status="evaluating"
          :max-level="3"
          skill-color="#2338D1"
        />

        <AvSkillCard
          title="Concevoir des synthèses chimiques durables"
          :attachments="0"
          :practices="0"
          skill="academic"
          :last-validated-level="0"
          current-level-status="toEvaluate"
          :max-level="3"
          skill-color="#AF0E36"
        />
      </div>
    </AvCard>
  </div>
</template>

<style lang="scss" scoped>
.av-container {
  &__skillcards {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1.25rem;
  }
}

.student-skill-cards__title {
  &__title {
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
    align-items: flex-start;
  }
}
</style>
