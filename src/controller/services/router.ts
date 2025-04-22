import { createRouter, createWebHistory } from 'vue-router'
import { authStore } from './auth' // Import the Vuex store

// Import your dashboard components - check if these paths are correct
import StudentDashboard from '@/view/layout/student/Dashboard.vue'
import StudentCompetences from '@/view/layout/student/Competences.vue'
import TeacherDashboard from '@/view/layout/teacher/Dashboard.vue'
import TeacherCohortes from '@/view/layout/teacher/Cohorts.vue'
import NotFound from '@/view/layout/NotFound.vue'

// Define route types using the correct type from vue-router
const studentRoutes = [
    {
        path: '/',
        name: 'StudentDashboard',
        component: StudentDashboard,
        meta: { requiresAuth: true, role: 'student' }
    },
    {
        path: '/formation/competences',
        name: 'StudentCompetences',
        component: StudentCompetences,
        meta: { requiresAuth: true, role: 'student' }
    }
]

const teacherRoutes = [
    {
        path: '/',
        name: 'TeacherDashboard',
        component: TeacherDashboard,
        meta: { requiresAuth: true, role: 'teacher' }
    },
    {
        path: '/cohorts',
        name: 'TeacherCohortes',
        component: TeacherCohortes,
        meta: { requiresAuth: true, role: 'teacher' }
    }
]

// Common routes accessible to all authenticated users
const commonRoutes = [
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }
]

// Create the router instance
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [...studentRoutes, ...teacherRoutes, ...commonRoutes]
})

// Navigation guard for route authorization
router.beforeEach((to, from, next) => {
    const userRole = authStore.state.userRole
    const isAuthenticated = authStore.state.isAuthenticated

    console.log(isAuthenticated)

    // Check if route requires authentication
    if (to.meta.requiresAuth && !isAuthenticated) {
        // Check if Login route exists, otherwise go to NotFound
        const loginRoute = router.hasRoute('Login')
        if (loginRoute) {
            next({ name: 'Login' })
        } else {
            console.warn('Login route not found, redirecting to NotFound')
            next({ name: 'NotFound' })
        }
        return
    }

    // Check if route requires specific role
    if (to.meta.role && to.meta.role !== userRole) {
        // Redirect to appropriate dashboard based on role
        if (userRole === 'student') {
            next({ name: 'StudentDashboard' })
        } else if (userRole === 'teacher') {
            next({ name: 'TeacherDashboard' })
        } else {
            // Check if Login route exists, otherwise go to NotFound
            const loginRoute = router.hasRoute('Login')
            if (loginRoute) {
                next({ name: 'Login' })
            } else {
                console.warn('Login route not found, redirecting to NotFound')
                next({ name: 'NotFound' })
            }
        }
        return
    }

    next()
})

export default router