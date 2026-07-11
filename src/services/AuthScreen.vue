<template>
  <div class="screen">
    <div class="logo-wrap" style="margin-top:10px;">
      <div class="logo-circle" v-html="ICONS.logo"></div>
      <div class="brand">GYMFIT NOTES</div>
      <div class="tagline">TRACK IT, LIFT IT, AND JUST DO IT.</div>
    </div>

    <div class="auth-body">
      <div class="tabs">
        <div class="tab" :class="{ active: mode === 'login' }" @click="mode = 'login'">Log In</div>
        <div class="tab" :class="{ active: mode === 'register' }" @click="mode = 'register'">Register</div>
      </div>

      <div class="field" v-if="mode === 'register'">
        <span v-html="ICONS.person"></span>
        <input v-model="name" type="text" placeholder="Full name" />
      </div>
      <div class="field">
        <span v-html="ICONS.email"></span>
        <input v-model="email" type="email" placeholder="Email" />
      </div>
      <div class="field">
        <span v-html="ICONS.password"></span>
        <input v-model="password" type="password" placeholder="Password" />
      </div>

      <button class="btn btn-red" @click="submit" :disabled="loading">
        {{ loading ? 'PLEASE WAIT...' : mode === 'register' ? 'REGISTER' : 'LOG IN' }}
      </button>
      <div class="auth-error" v-if="error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ICONS } from '../icons.js'
import { auth } from '../firebase.js'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const emit = defineEmits(['authenticated'])

const mode = ref('login')
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

// Firebase's own error codes are technical (e.g. "auth/wrong-password") —
// translate the common ones into something a user can actually read.
function friendlyError(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with that email already exists.'
    case 'auth/invalid-email':
      return 'That email address looks invalid.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again in a bit.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

async function submit() {
  if (!email.value.trim() || !password.value.trim()) {
    error.value = 'Please fill in email and password.'
    return
  }
  if (mode.value === 'register' && !name.value.trim()) {
    error.value = 'Please enter your name.'
    return
  }

  error.value = ''
  loading.value = true
  try {
    if (mode.value === 'register') {
      const cred = await createUserWithEmailAndPassword(auth, email.value.trim(), password.value)
      emit('authenticated', { uid: cred.user.uid, name: name.value.trim(), email: cred.user.email })
    } else {
      const cred = await signInWithEmailAndPassword(auth, email.value.trim(), password.value)
      emit('authenticated', { uid: cred.user.uid, name: cred.user.email.split('@')[0], email: cred.user.email })
    }
  } catch (e) {
    error.value = friendlyError(e.code)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-body {
  margin-top: 28px;
}
.auth-error {
  color: var(--red);
  font-size: 11px;
  margin-top: 8px;
  text-align: center;
}
</style>
