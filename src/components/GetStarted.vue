<template>
  <div class="screen start-screen">
    <div class="logo-wrap">
      <div class="logo-circle" v-html="ICONS.logo"></div>
      <div class="brand">GYMFIT NOTES</div>
      <div class="tagline">TRACK IT, LIFT IT, AND JUST DO IT.</div>
    </div>

    <div class="start-cta">
      <button class="btn btn-red" @click="$emit('get-started')">Get Started</button>
    </div>
  </div>
</template>

<script setup>
import { ICONS } from '../icons.js'

defineEmits(['get-started'])
</script>

<style scoped>
.start-screen {
  justify-content: center;
}
.start-cta {
  margin-top: 40px;
}
</style>
