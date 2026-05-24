import { reactive } from 'vue'

const remarks = reactive<Record<number, string>>({})

export function useRemark() {
  return { remarks }
}
