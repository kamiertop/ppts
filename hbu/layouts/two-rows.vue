<template>
  <main class="slidev-layout hbu-two-rows-layout">
    <section class="hbu-two-rows-top">
      <slot />
    </section>
    <section class="hbu-two-rows-bottom">
      <slot name="bottom" />
    </section>
  </main>
</template>

