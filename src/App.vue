<template>
  <div class="phone">
    <GetStarted v-if="store.screen === 'start'" @get-started="goTo('auth')" />
    <AuthScreen v-else-if="store.screen === 'auth'" @authenticated="handleAuthenticated" />
    <HomeScreen v-else-if="store.screen === 'home'" />
    <PlansScreen v-else-if="store.screen === 'plans'" />
    <PlanDetailScreen v-else-if="store.screen === 'planDetail'" />
    <MealsScreen v-else-if="store.screen === 'meals'" />
    <MealDetailScreen v-else-if="store.screen === 'mealDetail'" />
    <ProfileScreen v-else-if="store.screen === 'profile'" />
    <ChangePass v-else-if="store.screen === 'changePass'" />
    <ModalHost />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase.js'
import GetStarted from './components/GetStarted.vue'
import AuthScreen from './services/AuthScreen.vue'
import HomeScreen from './views/HomeScreen.vue'
import PlansScreen from './views/PlansScreen.vue'
import PlanDetailScreen from './views/PlanDetailScreen.vue'
import MealsScreen from './views/MealsScreen.vue'
import MealDetailScreen from './views/MealDetailScreen.vue'
import ProfileScreen from './views/ProfileScreen.vue'
import ChangePass from './views/changePass.vue'
import ModalHost from './views/ModalHost.vue'
import { store, goTo, loadData } from './store.js'

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
