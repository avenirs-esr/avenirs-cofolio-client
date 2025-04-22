<template>
  <div class="student-dashboard">
    <div class="student-dashboard__content-left">
      <div class="student-dashboard__upcoming-events">
        <h3>Événements à venir</h3>
        <!-- Upcoming events content -->
      </div>
    </div>
    <div class="student-dashboard__content-right">
      <div class="student-dashboard__competences">
        <h3>Mes compétences</h3>
      </div>
      <div class="student-dashboard__recent-traces">
        <h3>Traces récentes</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentDashboard'
}
</script>

<style lang="scss" scoped>
.student-dashboard {
  display: flex;
  flex-grow: 1;
  padding: 20px;
  background-color: #f4f4f4;

  &__content-left {
    flex: 1;
    margin-right: 20px;
  }

  &__content-right {
    flex: 2;
  }

  &__competences,
  &__recent-traces,
  &__upcoming-events {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
}
</style>