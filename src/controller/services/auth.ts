import { createStore } from 'vuex'

//TODO Transform this into an association array with the display name. Retrieve this infos from the back. They are dynamics.
export type UserRole = 'student' | 'teacher' | null

interface AuthState {
    isAuthenticated: boolean
    userRole: UserRole
    userId: string | null
}

export const authStore = createStore<AuthState>({
    state: {
        isAuthenticated: false,
        userRole: null,
        userId: null
    },

    mutations: {
        setAuthenticated(state, isAuthenticated: boolean) {
            state.isAuthenticated = isAuthenticated
        },
        setUserRole(state, role: UserRole) {
            state.userRole = role
        },
        setUserId(state, userId: string | null) {
            state.userId = userId
        }
    },

    actions: {
        login({ commit }, { userId, role }: { userId: string, role: UserRole }) {
            commit('setAuthenticated', true)
            commit('setUserRole', role)
            commit('setUserId', userId)
        },
        logout({ commit }) {
            commit('setAuthenticated', false)
            commit('setUserRole', null)
            commit('setUserId', null)
        },
        setRole({ commit }, role: UserRole) {
            commit('setUserRole', role)
        }
    },

    getters: {
        isStudent: (state) => state.userRole === 'student',
        isTeacher: (state) => state.userRole === 'teacher'
    }
})

// Helper function to access the store easily
export function useAuthStore() {
    return authStore
}