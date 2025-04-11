<template>
  <div class="player-hand d-flex flex-row flex-wrap justify-content-center">
    <CentralCard
      v-for="(card, index) in handCards"
      :key="index"
      :cardData="card"
      class="mx-1"
      @click="selectCard(card)"
    />
  </div>
</template>

<script setup>
import CentralCard from './CentralCard.vue'; // Asegúrate de que la ruta sea correcta

const props = defineProps({
  handCards: {
    type: Array,
    required: true, // Array con las cartas del jugador
    default: () => [],
  },
});

// Función para emitir el evento al padre
const emit = defineEmits(['select-card']); // Define el evento que se emitirá al padre

function selectCard(card) {
  emit('select-card', card); // Emite la carta seleccionada
}
</script>

<style scoped>
.player-hand {
  padding: 1rem;
  gap: 0.5rem;
  /* Permitir scroll horizontal si hay muchas cartas */
  overflow-x: auto;
  white-space: nowrap;
}
.central-card {
  cursor: pointer; /* Cambiar el cursor al pasar sobre la carta */
  transition: transform 0.2s ease-in-out;
}
.central-card:hover {
  transform: scale(1.1); /* Efecto visual al pasar el mouse sobre la carta */
}
</style>
