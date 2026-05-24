<script setup lang="ts">
import type { TocItem } from '@slidev/types'
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client/context.ts'

const props = withDefaults(defineProps<{
  maxDepth?: number
  columns?: number
}>(), {
  maxDepth: 1,
  columns: 1,
})

const { $slidev } = useSlideContext()

function flatten(items: TocItem[], depth: number): TocItem[] {
  if (depth > props.maxDepth) return []
  const result: TocItem[] = []
  for (const item of items) {
    result.push(item)
    result.push(...flatten(item.children, depth + 1))
  }
  return result
}

const flatItems = computed(() => flatten($slidev.nav.tocTree ?? [], 1))
</script>

<template>
  <div class="hbu-toc" :style="{ columnCount: columns }">
    <div
      v-for="(item, index) in flatItems"
      :key="item.no"
      class="hbu-toc-item"
      :class="{ 'hbu-toc-active': item.active }"
      @click="$slidev.nav.go(item.no)"
    >
      <span class="hbu-toc-no">{{ index + 1 }}.</span>
      <span class="hbu-toc-title">{{ item.title }}</span>
    </div>
  </div>
</template>

<style scoped>
.hbu-toc {
  column-gap: 48px;
  margin-top: 34px;
}

.hbu-toc-item {
  display: flex;
  align-items: baseline;
  gap: 0.08em;
  width: fit-content;
  max-width: 100%;
  padding: 5px 0;
  font-size: var(--hbu-font-size-body);
  line-height: 1.4;
  color: var(--hbu-text);
  cursor: pointer;
  break-inside: avoid;
  transition: color 0.15s;
}

.hbu-toc-no {
  flex: 0 0 auto;
  color: var(--hbu-blue-dark);
  font-weight: 700;
}

.hbu-toc-title {
  min-width: 0;
  border-bottom: 1px solid var(--hbu-blue);
}

.hbu-toc-item:hover {
  color: var(--hbu-blue);
}

.hbu-toc-active {
  font-weight: 700;
}
</style>
