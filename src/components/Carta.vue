<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: String,
  icon: String,
  color: String,
  gradient: Boolean,
  gradient2: Boolean
})

const clase = computed(() => {
  if (props.gradient) {
    return 'btn carta-gradient'
  }
  if (props.gradient2) {
    return 'btn carta-gradient2'
  }
  return `btn btn-${props.color} carta-base`
})
</script>

<template>
  <button :class="clase">
    <span class="star">☆</span>
    <span class="mx-2">
      <span v-if="icon">{{ icon }}</span>
      <span v-else>{{ text }}</span>
    </span>
    <span class="star">☆</span>
  </button>
</template>

<style scoped>
.carta-base {
  border-radius: 10px;
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.star {
  font-size: 1.1rem;
  opacity: 0.7;
}

.carta-gradient {
  background: linear-gradient(to right, #add8e6, #ffffff, #90ee90);
  color: #000;
  border: none;
}

.carta-gradient2 {
  background: linear-gradient(to right, #f8d7da, #d1ecf1, #fff3cd);
  color: #000;
  border: none;
}
</style>
