<template>
    <main class="slidev-layout hbu-two-cols-layout">
        <div class="hbu-two-cols-grid">
            <section class="hbu-two-cols-left">
                <slot />
            </section>
            <section class="hbu-two-cols-right">
                <slot name="right" />
            </section>
        </div>
    </main>
</template>
