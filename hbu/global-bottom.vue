<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { useRemark } from './composables/useRemark'

const { currentLayout, currentPage, currentSlideRoute, total } = useNav()
const { remarks } = useRemark()

const hiddenLayouts = new Set(['cover', 'end'])

const footerShown = computed(() => !hiddenLayouts.has(currentLayout.value))

const remark = computed(() => {
  const no = currentPage.value
  if (remarks[no])
    return remarks[no]

  const raw = currentSlideRoute.value?.meta?.slide?.frontmatter?.remark ?? ''
  return String(raw).trim()
})
</script>

<template>
  <footer v-if="footerShown" class="hbu-footer">
    <span class="hbu-spacer" />
    <span class="hbu-remark">{{ remark }}</span>
    <span class="hbu-pageno">{{ currentPage }} / {{ total }}</span>
  </footer>
</template>

<style scoped>
.hbu-footer {
  position: fixed;
  left: 50px;
  right: 26px;
  bottom: 14px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  color: var(--hbu-muted);
  font-size: 12px;
  line-height: 1;
  pointer-events: none;
  user-select: none;
  z-index: 40;
}

.hbu-spacer {
  flex: 0 0 60px;
}

.hbu-remark {
  flex: 1;
  text-align: center;
}

.hbu-pageno {
  flex: 0 0 60px;
  text-align: right;
}
</style>
