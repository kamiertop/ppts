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
const presenter = computed(() => String($frontmatter.presenter ?? '').trim())
const date = computed(() => String($frontmatter.date ?? '').trim())
const affiliation = computed(() => String($frontmatter.affiliation ?? '').trim())
</script>

<template>
  <main class="slidev-layout hbu-cover" :style="style">
    <div class="hbu-cover-mark">Hebei University</div>
    <div v-if="date" class="hbu-cover-date">{{ date }}</div>
    <div class="hbu-cover-content">
      <TypewriterTitle v-if="title" :text="title" :speed="60" />
      <div v-if="presenter || affiliation" class="hbu-cover-meta">
        <p v-if="presenter" class="hbu-cover-presenter">{{ presenter }}</p>
        <p v-if="affiliation" class="hbu-cover-affiliation">{{ affiliation }}</p>
      </div>
      <slot />
    </div>
  </main>
</template>
