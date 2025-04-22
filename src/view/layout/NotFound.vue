<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you are looking for doesn't exist or has been moved.</p>
    <router-link to="/" class="home-link">
      <font-awesome-icon icon="home" />
      Go to Dashboard
    </router-link>
  </div>
</template>

<script>
// No additional logic needed
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 3rem 1rem;
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: #e0e0e0;
}

h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

p {
  margin-bottom: 2rem;
  color: #666;
}

.home-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

.home-link:hover {
  background-color: #e0e0e0;
}
</style>