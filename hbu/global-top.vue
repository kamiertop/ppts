<script setup lang="ts">
import logoUrl from "./hbu.png";
</script>

<template>
    <div class="hbu-slide-logo-frame">
        <img class="hbu-slide-logo" :src="logoUrl" alt="HBU" />
    </div>
</template>

<style scoped>
.hbu-slide-logo-frame {
    position: fixed;
    top: 14px;
    right: 14px;
    width: 74px;
    height: 74px;
    display: grid;
    place-items: center;
    padding: 0;
    background: #ffffff;
    border: 0;
    border-radius: 50%;
    box-shadow: inset 0 0 0 2px var(--hbu-blue);
    overflow: hidden;
    pointer-events: none;
    user-select: none;
    z-index: 50;
}

.hbu-slide-logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
</style>
