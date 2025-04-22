<template>
  <header class="header">
    <!-- Logo and title section -->
    <div class="header__left">
      <div class="header__logo-container">
        <img src="@/assets/cofolio-logo.png" alt="Cofolio" class="header__logo" />
        <div class="header__logo-text">
          <h1 class="header__title">Cofolio <span class="header__title--highlight">{{ userRoleDisplay }}</span></h1>
          <button class="header__change-universe-btn">
            <font-awesome-icon icon="arrow-right-arrow-left" class="header__change-universe-btn--icon" />
            CHANGER D'UNIVERS
          </button>
        </div>
      </div>
    </div>

    <!-- User controls section -->
    <div class="header__right">
      <div class="header__user-controls">
        <button class="header__control-btn header__control-btn--messagerie">
          <font-awesome-icon :icon="['far', 'message']" />
          <span class="header__control-btn-text">MESSAGERIE</span>
        </button>
        <div class="header__control-separator"></div>
        <button class="header__control-btn header__control-btn--notifications">
          <font-awesome-icon icon="bell" />
          <span class="header__control-btn-text">NOTIFICATIONS (2)</span>
        </button>
        <div class="header__control-separator"></div>
        <button class="header__control-btn header__control-btn--user">
          <font-awesome-icon :icon="['far', 'circle-user']" />
          <span class="header__control-btn-text">J. MOULIN</span>
        </button>
      </div>
      <div class="header__search">
        <input
            type="text"
            placeholder="Chercher une compétence, une preuve, etc..."
            class="header__search-input"
        />
        <button class="header__search-btn">
          <font-awesome-icon icon="magnifying-glass" />
        </button>
      </div>
    </div>
  </header>

  <!-- Navigation menu -->
  <nav class="nav">
    <ul class="nav__list">
      <li class="nav__item" :class="{ 'nav__item--active': isRouteActive('/', true) }">
        <router-link to="/" class="nav__link">
          <font-awesome-icon icon="home" />
          ACCUEIL
        </router-link>
      </li>

      <!-- TODO Define navigation items into different files. -->
      <!-- Student-specific navigation items -->
      <template v-if="authStore.getters.isStudent">
        <li class="nav__item nav__item--dropdown"
            :class="{ 'nav__item--active': isRouteActive('/formation'), 'nav__item--open': isFormationMenuOpen }"
            @click="toggleFormationMenu">
          <button class="nav__dropdown-btn">
            <font-awesome-icon icon="graduation-cap" />
            RÉUSSIR MA FORMATION
            <font-awesome-icon icon="chevron-down" class="nav__dropdown-icon" :class="{ 'nav__dropdown-icon--open': isFormationMenuOpen }" />
          </button>

          <!-- Dropdown submenu -->
          <transition name="dropdown">
            <ul v-if="isFormationMenuOpen" class="nav__dropdown-menu">
              <li class="nav__dropdown-item" :class="{ 'nav__dropdown-item--active': isRouteActive('/formation/competences') }" >
                <router-link to="/formation/competences" class="nav__dropdown-link" @click.stop>
                  <font-awesome-icon icon="seedling" class="nav__dropdown-icon nav__dropdown-icon--small" />
                  Mes compétences
                </router-link>
              </li>
              <li class="nav__dropdown-item" :class="{ 'nav__dropdown-item--active': isRouteActive('/formation/projets') }">
                <router-link to="/formation/projets" class="nav__dropdown-link" @click.stop>
                  <font-awesome-icon icon="screwdriver-wrench" class="nav__dropdown-icon nav__dropdown-icon--small" />
                  Mes projets
                </router-link>
              </li>
              <!-- Add more dropdown items as needed -->
            </ul>
          </transition>
        </li>
        <li class="nav__item nav__item--dropdown" :class="{ 'nav__item--active': isRouteActive('/projet-de-vie') }">
          <router-link to="/projet-de-vie" class="nav__link">
            <font-awesome-icon icon="seedling" />
            CONSTRUIRE MON PROJET DE VIE
          </router-link>
          <font-awesome-icon icon="chevron-down" class="nav__dropdown-icon" />
        </li>
        <li class="nav__item nav__item--dropdown" :class="{ 'nav__item--active': isRouteActive('/outils') }">
          <router-link to="/outils" class="nav__link">
            <font-awesome-icon icon="screwdriver-wrench" />
            MES OUTILS
          </router-link>
          <font-awesome-icon icon="chevron-down" class="nav__dropdown-icon" />
        </li>
      </template>

      <!-- Teacher-specific navigation items -->
      <template v-if="authStore.getters.isTeacher">
        <li class="nav__item nav__item--dropdown" :class="{ 'nav__item--active': isRouteActive('/cohorts') }">
          <router-link to="/cohorts" class="nav__link">
            <font-awesome-icon icon="graduation-cap" />
            COHORTES
          </router-link>
          <font-awesome-icon icon="chevron-down" class="nav__dropdown-icon" />
        </li>
        <li class="nav__item nav__item--dropdown" :class="{ 'nav__item--active': isRouteActive('/evaluations') }">
          <router-link to="/evaluations" class="nav__link">
            <font-awesome-icon icon="seedling" />
            ÉVALUATIONS
          </router-link>
          <font-awesome-icon icon="chevron-down" class="nav__dropdown-icon" />
        </li>
        <li class="nav__item nav__item--dropdown" :class="{ 'nav__item--active': isRouteActive('/outils') }">
          <router-link to="/outils" class="nav__link">
            <font-awesome-icon icon="screwdriver-wrench" />
            MES OUTILS
          </router-link>
          <font-awesome-icon icon="chevron-down" class="nav__dropdown-icon" />
        </li>
      </template>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      isFormationMenuOpen: false
    }
  },
  methods: {
    toggleFormationMenu(event) {
      // Prevent the event from propagating to parent elements
      event.stopPropagation();
      this.isFormationMenuOpen = !this.isFormationMenuOpen;
    },
    closeFormationMenu() {
      this.isFormationMenuOpen = false;
    }
  },
  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', this.closeFormationMenu);
  },
  beforeUnmount() {
    // Remove event listener when component is destroyed
    document.removeEventListener('click', this.closeFormationMenu);
  }
}
</script>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { authStore } from '@/controller/services/auth';

const route = useRoute();

// Compute the display text based on user role
const userRoleDisplay = computed(() => {
  //TODO The userRole needs to be loaded from the back.
  return authStore.state.userRole === 'teacher' ? 'Enseignant' : 'Étudiant';
});

// Check if the current route path starts with the given route
// If exact is true, it will only match the exact path
const isRouteActive = (routePath, exact = false) => {
  if (exact) {
    return route.path === routePath;
  }
  return route.path.startsWith(routePath);
};
</script>

<style lang="scss" scoped>
// Header block
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  color: #1e3a8a;

  button {
    color: inherit;
  }

  // Header elements
  &__left {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  &__logo-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__logo {
    // Logo styles
  }

  &__logo-text {
    margin-left: 1rem;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 400;
    color: #333;
    margin: 0;
    padding: 0.5rem;

    // Title modifier
    &--highlight {
      font-weight: 600;
    }
  }

  &__change-universe-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.8rem;
    padding: 0.5rem;

    // Button icon modifier
    &--icon {
      padding: 0 0.5rem;
    }
  }

  &__right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }

  &__user-controls {
    display: flex;
    align-items: center;
    gap: 0; // Remove the gap and use separators instead
  }

  &__control-separator {
    width: 1px;
    height: 24px;
    background-color: #e5e7eb;
  }

  &__control-btn {
    background: none;
    border: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;

    // Control button modifiers
    &--messagerie {
      // Messagerie specific styles
    }

    &--notifications {
      // Notifications specific styles
    }

    &--user {
      // User specific styles
    }
  }

  &__control-btn-text {
    font-weight: 600;
  }

  &__search {
    position: relative;
    width: 100%;
  }

  &__search-input {
    width: 100%;
    padding: 0.5rem 2.5rem 0.5rem 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 9999px;
    font-size: 0.9rem;
  }

  &__search-btn {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
  }
}

// Navigation block
.nav {
  background-color: white;
  border-bottom: 2px solid #e5e7eb;
  color: #1e3a8a;

  // Navigation elements
  &__list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0 0 0 2rem;
  }

  &__item {
    position: relative;
    margin: 0 0.1rem;
    cursor: pointer;

    // Item modifiers
    &--active {
      border-bottom: 3px solid #1e3a8a;
    }

    &--dropdown {
      position: relative;
      display: flex;
      align-items: center;
      padding-right: 1rem;
    }

    &--open {
      background-color: #1e3a8a;
      border-radius: 0.5rem 0.5rem 0 0;
      color: white;
    }

    &:hover {
      background-color: #1e3a8a;
      border-radius: 0.5rem 0.5rem 0 0;
      color: white;
    }
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;
    color: inherit; /* Inherit color from parent to maintain styling */
    border-bottom: 3px solid transparent;
    transition: border-color 0.2s ease;
  }

  &__dropdown-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    font-weight: 600;
    font-size: 0.9rem;
    color: inherit;
    cursor: pointer;
    font-family: inherit;
  }

  &__dropdown-icon {
    margin-left: 0.25rem;
    font-size: 0.8rem;
    transition: transform 0.3s ease;

    // Icon modifiers
    &--open {
      transform: rotate(180deg);
    }

    &--small {
      margin-right: 0.75rem;
      font-size: 0.9rem;
      width: 1rem;
      color: #1e3a8a;
      transition: color 0.2s;
    }
  }

  &__dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 220px;
    background-color: white;
    border-radius: 0 0.5rem 0.5rem 0.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 100;
    padding: 0.5rem 0;
    margin-top: 0;
    border: 1px solid #e5e7eb;
    border-top: none;
  }

  &__dropdown-link {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    color: #1e3a8a;
    text-decoration: none;
    font-size: 0.9rem;
    transition: background-color 0.2s, color 0.2s;
    width: 100%;

    &:hover {
      background-color: #1e3a8a;
      color: white;

      .nav__dropdown-icon--small {
        color: white;
      }
    }
  }

  &__dropdown-item {
    display: block;
    padding: 0;

    // Item modifier
    &--active {
      color: #ee5fad;

      .nav__dropdown-icon--small {
        color: inherit;
      }
    }

    &:hover {
      background-color: #1e3a8a;
      color: white;
    }
  }
}

/* Animation for dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-0.625rem);
}

/* Override router-link default styling to keep our custom colors */
:deep(a) {
  color: inherit;
  text-decoration: none;
}

:deep(.router-link-active) {
  color: inherit;
}
</style>