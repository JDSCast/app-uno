<template>
    <div class="container d-flex flex-column justify-content-between vh-100 py-3">
      <!-- Turno actual -->
      <div class="border rounded p-2 mb-2 text-center">
        <p class="mb-0"><strong>Turno:</strong> {{ turnoActual }}</p>
      </div>
  
      <!-- Lista de jugadores -->
      <div class="border rounded p-2 mb-2">
        <div
          v-for="(jugador, index) in jugadores"
          :key="index"
          class="d-flex justify-content-between align-items-center mb-2"
        >
          <span>{{ jugador.nombre }}</span>
          <div class="d-flex align-items-center">
            <span class="me-2">Cartas: {{ jugador.cartas }}</span>
            <button
              v-if="jugador.cartas === 1"
              class="btn btn-outline-secondary btn-sm py-0 px-2"
              style="font-size: 0.8rem"
            >
              ¡UNO!
            </button>
          </div>
        </div>
      </div>
  
      <!-- Carta en juego -->
      <div class="border rounded text-center py-3 mb-2 flex-grow-1 d-flex flex-column justify-content-center">
        <p><strong>Carta en juego:</strong></p>
        <div
          class="mx-auto my-2 bg-warning text-dark rounded-3 d-inline-block px-4 py-2"
          style="font-size: 3rem;"
        >
          {{ cartaActual.numero }}
        </div>
        <p class="mb-0">{{ cartaActual.jugador }}</p>
      </div>
  
      <!-- Controles del jugador -->
      <div class="d-flex justify-content-between text-center gap-2">
        <div class="border rounded flex-fill py-2">
          <div class="fw-bold" style="font-size: 1.2rem">{{ cartasJugador }}</div>
          <small>Cartas</small>
        </div>
  
        <div class="border rounded flex-fill p-0">
          <button class="btn btn-warning w-100 h-100 fw-bold">¡UNO!</button>
        </div>
  
        <div class="border rounded flex-fill p-0">
          <button class="btn btn-secondary w-100 h-100">Tomar del mazo</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const jugadores = [
    { nombre: 'Jugador 2', cartas: 5 },
    { nombre: 'Jugador 3', cartas: 4 },
    { nombre: 'Jugador 4', cartas: 1 },
  ]
  
  const turnoActual = 'Jugador 1'
  
  const cartaActual = {
    numero: 6,
    jugador: 'Jugador 1',
  }
  
  const cartasJugador = 15
  </script>
  