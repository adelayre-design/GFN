<template>
  <div class="phone">
    <div class="backend-pill" :class="backendStatus">
      {{ backendLabel }}
    </div>
    <GetStarted v-if="store.screen === 'start'" @get-started="goTo('auth')" />
    <AuthScreen v-else-if="store.screen === 'auth'" @authenticated="handleAuthenticated" />
    <HomeScreen v-else-if="store.screen === 'home'" />
    <PlansScreen v-else-if="store.screen === 'plans'" />
    <PlanDetailScreen v-else-if="store.screen === 'planDetail'" />
    <MealsScreen v-else-if="store.screen === 'meals'" />
    <MealDetailScreen v-else-if="store.screen === 'mealDetail'" />
    <ProfileScreen v-else-if="store.screen === 'profile'" />
    <ModalHost />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase.js'
import { checkBackendHealth } from './services/api.js'
import GetStarted from './components/GetStarted.vue'
import AuthScreen from './services/AuthScreen.vue'
import HomeScreen from './views/HomeScreen.vue'
import PlansScreen from './views/PlansScreen.vue'
import PlanDetailScreen from './views/PlanDetailScreen.vue'
import MealsScreen from './views/MealsScreen.vue'
import MealDetailScreen from './views/MealDetailScreen.vue'
import ProfileScreen from './views/ProfileScreen.vue'
import ModalHost from './views/ModalHost.vue'
import { store, goTo, loadData } from './store.js'

const backendStatus = ref('checking')
const backendLabel = computed(() => {
  if (backendStatus.value === 'connected') return 'API connected'
  if (backendStatus.value === 'error') return 'API offline'
  return 'API checking'
})

async function handleAuthenticated(user) {
  store.user.name = user.name
  store.user.email = user.email
  try {
    await loadData(user.uid)
  } catch (e) {
    console.error('Could not load saved data from Firestore:', e)
  }
  goTo('home')
}

onMounted(() => {
  checkBackendHealth()
    .then(() => {
      backendStatus.value = 'connected'
    })
    .catch((e) => {
      backendStatus.value = 'error'
      console.error('Could not reach backend API:', e)
    })

  onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser && store.screen === 'start') {
      store.user.email = fbUser.email
      try {
        await loadData(fbUser.uid)
      } catch (e) {
        console.error('Could not load saved data from Firestore:', e)
      }
      goTo('home')
    }
  })
})
</script>
