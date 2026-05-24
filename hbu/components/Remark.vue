<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useSlideContext } from '@slidev/client/context.ts'
import { useRemark } from '../composables/useRemark'

const props = defineProps<{ text: string }>()
const { remarks } = useRemark()
const { $page } = useSlideContext()

const pageNo = $page.value

onMounted(() => {
  remarks[pageNo] = props.text
})

onBeforeUnmount(() => {
  delete remarks[pageNo]
})
</script>

<template>
  <span />
</template>
