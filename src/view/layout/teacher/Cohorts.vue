<template>
  <div class="competences-page">
    <h1>Formation Competences</h1>
    <div class="competences-content">
      <!-- Competences content here -->
      <p>This page displays the student's competences and progress in the formation.</p>
    </div>

    <router-link to="/" class="back-link">
      <font-awesome-icon icon="home" />
      Back to Dashboard
    </router-link>x
  </div>
</template>

<script>
export default {
  name: 'TeacherCohortes'
}
</script>

<style scoped>
.competences-page {
  padding: 1rem;
}

.competences-content {
  margin: 2rem 0;
}

.competence-list {
  margin-top: 2rem;
}

.competence-item {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.progress-bar {
  height: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  margin: 0.5rem 0;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #4caf50;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
  margin-top: 1rem;
}

.back-link:hover {
  background-color: #e0e0e0;
}
</style>