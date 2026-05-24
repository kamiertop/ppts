<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";

const props = withDefaults(
  defineProps<{
    text: string;
    speed?: number;
    startDelay?: number;
  }>(),
  {
    speed: 75,
    startDelay: 350,
  },
);

const visibleChars = ref(0);
const complete = ref(false);
const mounted = ref(false);

let stepTimer: ReturnType<typeof window.setTimeout> | undefined;
let caretTimer: ReturnType<typeof window.setInterval> | undefined;

const trimmedText = computed(() => (props.text ?? '').replace(/\n+$/, ''));
const characters = computed(() => Array.from(trimmedText.value));
const displayText = computed(() =>
  characters.value.slice(0, visibleChars.value).join(""),
);

function clearTimers() {
  if (stepTimer !== undefined) {
    window.clearTimeout(stepTimer);
    stepTimer = undefined;
  }

  if (caretTimer !== undefined) {
    window.clearInterval(caretTimer);
    caretTimer = undefined;
  }
}

function isReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function start() {
  clearTimers();

  const total = characters.value.length;

  if (total === 0) {
    visibleChars.value = 0;
    complete.value = true;
    return;
  }

  if (isReducedMotion()) {
    visibleChars.value = total;
    complete.value = true;
    return;
  }

  visibleChars.value = 0;
  complete.value = false;

  caretTimer = window.setInterval(() => {
    complete.value = visibleChars.value >= total;
  }, 40);

  const step = () => {
    visibleChars.value += 1;
    complete.value = visibleChars.value >= total;

    if (visibleChars.value < total)
      stepTimer = window.setTimeout(step, props.speed);
  };

  stepTimer = window.setTimeout(step, props.startDelay);
}

watch(
  () => props.text,
  async () => {
    if (!mounted.value) return;
    await nextTick();
    start();
  },
);

onMounted(() => {
  mounted.value = true;
  start();
});

onBeforeUnmount(() => {
  clearTimers();
});
</script>

<template>
  <div class="hbu-cover-title-stack" :class="{ 'is-complete': complete }">
    <h1 class="hbu-cover-title-static" aria-hidden="true">
      {{ trimmedText }}
    </h1>
    <h1 class="hbu-cover-title-typed">
      <span class="hbu-cover-title-text">{{ displayText }}</span>
      <span class="hbu-cover-title-caret" aria-hidden="true" />
    </h1>
  </div>
</template>
