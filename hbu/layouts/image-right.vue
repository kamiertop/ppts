<script setup lang="ts">
import { handleBackground } from '@slidev/client/layoutHelper.ts'
import { computed } from 'vue'

const props = defineProps({
  image: {
    type: String,
    default: undefined,
  },
  backgroundSize: {
    type: String,
    default: 'contain',
  },
})

const style = computed(() => handleBackground(props.image, false, props.backgroundSize))
</script>

<template>
  <main class="hbu-image-layout hbu-image-right">
    <section class="slidev-layout hbu-image-content">
      <slot />
    </section>
    <section class="hbu-image-panel">
      <div class="hbu-image-frame" :style="style" />
    </section>
  </main>
</template>

