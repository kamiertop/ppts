<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { VNodeChild } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'

const props = withDefaults(defineProps<{
  formula?: string
  display?: boolean
}>(), {
  display: true,
})

const slots = useSlots()

function readText(children: VNodeChild): string {
  if (typeof children === 'string')
    return children
  if (typeof children === 'number')
    return String(children)
  if (Array.isArray(children))
    return children.map(readText).join('')
  if (children && typeof children === 'object' && 'children' in children)
    return readText(children.children as VNodeChild)
  return ''
}

const formulaText = computed(() => {
  if (props.formula)
    return props.formula
  return readText(slots.default?.() ?? []).trim()
})

const html = computed(() =>
  katex.renderToString(formulaText.value, {
    displayMode: props.display,
    throwOnError: false,
  }),
)
</script>

<template>
  <div class="hbu-math-block" v-html="html" />
</template>

<style scoped>
.hbu-math-block {
  color: var(--hbu-text);
}
</style>
