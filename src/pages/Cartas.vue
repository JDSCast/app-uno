<script setup>

import Carta from './Carta.vue'
</script>

<template>
  <div class="container mt-4">
    <h5>Mis cartas:</h5>

    <div class="d-grid gap-2 mt-3">
      <Carta text="6" color="primary" />
      <Carta icon="♻️" color="danger" />
      <Carta icon="🚫" color="success" />
      <Carta text="+2" color="warning" />
      <Carta text="comodín" gradient />
      <Carta text="+4 Comodín" gradient2 />
    </div>

    <div class="mt-4 text-center">
      <button class="btn btn-outline-dark">Lanzar</button>
    </div>
  </div>
</template>
