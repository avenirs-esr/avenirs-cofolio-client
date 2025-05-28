<script setup lang="ts">
</script>

<template>
  <div class="fr-container fr-mt-3w fr-mt-md-5w fr-mb-5w">
    <h1>Teacher feature home page</h1>

    <!-- A11y violation: Missing alt text for image -->
    <img
      class="fr-mt-2w"
    >

    <!-- A11y violation: Form input without proper label association -->
    <form class="fr-mt-4w">
      <label>Search courses</label>
      <input
        type="text"
        placeholder="Enter course name please..."
      >
      <button
        type="submit"
        style="background-color: #0066cc; color: white; border: none; padding: 8px;"
      >
        Search
      </button>
    </form>

    <!-- A11y violation: Low contrast text -->
    <p style="color: #999999; background-color: #ffffff;">
      Welcome to your teaching dashboard where you can manage all your courses.
    </p>
  </div>
</template>
