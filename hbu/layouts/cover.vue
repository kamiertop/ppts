<script setup lang="ts">
import TypewriterTitle from '../components/TypewriterTitle.vue'
import { useSlideContext } from '@slidev/client/context.ts'
import { handleBackground } from '@slidev/client/layoutHelper.ts'
import { computed } from 'vue'

const props = defineProps({
  background: {
    type: String,
    default: undefined,
  },
})

const { $frontmatter } = useSlideContext()
const style = computed(() => handleBackground(props.background))
const title = computed(() => String($frontmatter.title ?? '').trim())
</script>

<template>
  <main class="slidev-layout hbu-cover" :style="style">
    <div class="hbu-cover-mark">Hebei University</div>
    <div class="hbu-cover-content">
      <TypewriterTitle v-if="title" :text="title" :speed="60"/>
      <slot />
    </div>
  </main>
</template>
