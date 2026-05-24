<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import logoUrl from './hbu.png'

const { currentLayout, currentPage, total } = useNav()

const showLogo = computed(() => true)

const progress = computed(() => {
  if (total.value <= 1) return 0
  return ((currentPage.value - 1) / (total.value - 1)) * 100
})

const showBar = computed(() => total.value > 1)
</script>

<template>
  <div v-if="showBar" class="hbu-progress-bar">
    <div class="hbu-progress-fill" :style="{ width: progress + '%' }" />
  </div>
  <div v-if="showLogo" class="hbu-slide-logo-frame">
    <img class="hbu-slide-logo" :src="logoUrl" alt="HBU" />
  </div>
</template>

<style scoped>
.hbu-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--hbu-line);
  z-index: 60;
  pointer-events: none;
}

.hbu-progress-fill {
  height: 100%;
  background: var(--hbu-blue);
  transition: width 0.3s ease;
}

.hbu-slide-logo-frame {
  position: fixed;
  top: 14px;
  right: 14px;
  width: 74px;
  height: 74px;
  display: grid;
  place-items: center;
  padding: 0;
  background: #ffffff;
  border: 0;
  border-radius: 50%;
  box-shadow: inset 0 0 0 2px var(--hbu-blue);
  overflow: hidden;
  pointer-events: none;
  user-select: none;
  z-index: 50;
}

.hbu-slide-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
