<template>
  <div class="container-fluid vh-100 d-flex flex-column justify-content-between py-3">
    <!-- Jugador superior (Jugador 3) -->
    <div class="row justify-content-center mb-3">
      <div class="col-auto text-center">
        <p><strong>{{ jugadores[2].nombre }}</strong></p>
        <p class="mb-1">Cartas: {{ jugadores[2].cartas }}</p>
        <div class="d-flex justify-content-center">
          <div
            v-for="(card, i) in mostrarCartas(jugadores[2].cartas)"
            :key="'top-' + i"
            class="bg-primary text-white border border-dark rounded-3 mx-1 position-relative shadow"
            style="width: 60px; height: 90px;"
          >
            <span
              v-if="i === 0 && jugadores[2].cartas > 3"
              class="position-absolute top-0 start-50 translate-middle badge bg-dark"
              >{{ jugadores[2].cartas }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Centro: jugador izquierda (4), carta central, jugador derecha (2) -->
    <div class="row justify-content-center align-items-center flex-grow-1 text-center">
      <!-- Jugador 4 (izquierda) -->
      <div class="col-3 text-center">
        <p><strong>{{ jugadores[3].nombre }}</strong></p>
        <p class="mb-1">Cartas: {{ jugadores[3].cartas }}</p>
        <div
          v-if="jugadores[3].cartas === 1"
          class="d-flex justify-content-center align-items-center"
          style="height: 100px;"
        >
          <div
            class="bg-danger text-white border border-dark rounded-3 shadow"
            style="width: 60px; height: 90px;"
          ></div>
        </div>
        <div
          v-else
          class="position-relative mx-auto"
          style="width: 80px; height: 120px;"
        >
          <div
            v-for="(card, i) in mostrarCartas(jugadores[3].cartas)"
            :key="'left-' + i"
            class="bg-danger text-white border border-dark rounded-3 position-absolute shadow"
            :style="{
              top: `${i * 15}px`,
              left: `${i * 8}px`,
              width: '60px',
              height: '90px',
              zIndex: i,
            }"
          >
            <span
              v-if="i === 0 && jugadores[3].cartas > 3"
              class="position-absolute top-0 start-50 translate-middle badge bg-dark"
              >{{ jugadores[3].cartas }}</span
            >
          </div>
        </div>
      </div>

      <!-- Carta central -->
      <div class="col-6">
        <div class="bg-warning rounded-4 d-inline-block px-4 py-2 mb-1 border border-dark shadow" style="font-size: 3rem;">
          {{ cartaActual.numero }}
        </div>
        <p><strong>{{ cartaActual.jugador }}</strong></p>
      </div>

      <!-- Jugador 2 (derecha) -->
      <div class="col-3 text-center">
        <p><strong>{{ jugadores[1].nombre }}</strong></p>
        <p class="mb-1">Cartas: {{ jugadores[1].cartas }}</p>
        <div class="position-relative mx-auto" style="width: 80px; height: 120px;">
          <div
            v-for="(card, i) in mostrarCartas(jugadores[1].cartas)"
            :key="'right-' + i"
            class="bg-success text-white border border-dark rounded-3 position-absolute shadow"
            :style="{
              top: `${i * 15}px`,
              left: `${i * 8}px`,
              width: '60px',
              height: '90px',
              zIndex: i,
            }"
          >
            <span
              v-if="i === 0 && jugadores[1].cartas > 3"
              class="position-absolute top-0 start-50 translate-middle badge bg-dark"
              >{{ jugadores[1].cartas }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Parte inferior: jugador 1 y botones -->
    <div class="row align-items-center text-center">
      <div class="col-4">
        <button class="btn btn-outline-dark btn-lg w-100">¡UNO!</button>
      </div>

      <div class="col-4">
        <p><strong>{{ jugadores[0].nombre }}</strong></p>
        <p class="mb-1">Cartas: {{ jugadores[0].cartas }}</p>
        <div class="d-flex justify-content-center">
          <div
            v-for="(card, i) in mostrarCartas(jugadores[0].cartas)"
            :key="'bottom-' + i"
            class="bg-info text-white border border-dark rounded-3 mx-1 position-relative shadow"
            style="width: 60px; height: 90px;"
          >
            <span
              v-if="jugadores[0].cartas > 3 && i === 0"
              class="position-absolute top-0 start-50 translate-middle badge bg-dark"
            >
              {{ jugadores[0].cartas }}
            </span>
          </div>
        </div>
      </div>

      <div class="col-4">
        <button class="btn btn-outline-dark btn-lg w-100">Tomar del mazo</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted} from "vue";
import { useRouter, useRoute } from "vue-router";
import { AuthService } from '../firebase/auth.js';
import { createDocument, readDocumentById, updateDocument, createSubCollection, onSnapshotDocument, onSnapshotSubcollectionWithFullData, readCollection } from "../firebase/servicesFirebase.js";
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();
 console.log(route.params.codigo)
const infoJugadores = ref([]);
const infoCartas = ref([]);
const partidaActual = ref([]);
const cartasJugadores = ref([]);
const codigoPartida = ref(route.params.codigo);

const jugadores = [
  { nombre: "Jugador 1", cartas: 10 },
  { nombre: "Jugador 2", cartas: 4 },
  { nombre: "Jugador 3", cartas: 2 },
  { nombre: "Jugador 4", cartas: 1 },
];

const cartaActual = {
  numero: 6,
  jugador: "Jugador 1",
};

function mostrarCartas(cantidad) {
  return Array(Math.min(cantidad, 3)).fill(null);
}

//Funcion para tomar una carta aleatoria que no se encuentre en "cartas_partida"
async function tomarCartaAleatoria() {
  const cartasDisponibles = infoCartas.value.filter((carta) => !cartasJugadores.value.some((jugador) => jugador.idCarta === carta.id));
  if (cartasDisponibles.length > 0) {
    const cartaAleatoria = cartasDisponibles[Math.floor(Math.random() * cartasDisponibles.length)];
    return cartaAleatoria;
  } else {
    console.log("No hay cartas disponibles en el mazo.");
    return null;
  }
}

//Funcion para cambiar carta actual en partida
const cambiarCartaActual = async (carta) =>{
  await updateDocument("partidas", codigoPartida.value,{
    cartaActual: carta.id
  })
}

// Funcion para determinar el numero de cartas de cada jugador
const obtenerCartas = (idJugador) => {
      // Filtra las cartas por idJugador
      cartasMano = this.cartasJugadores
        .filter(carta => carta.idJugador === idJugador)
        .map(carta => carta.carta);

        return cartaMano
    }




// Montaje de la infomacion de la partida en tiempo real
onMounted(async () => {
  // Escuchar cambios en la subcolección "jugadores_partida"
  const jugadoresSnap = await onSnapshotSubcollectionWithFullData("partidas", codigoPartida.value, "jugadores_partida", (querySnapshot) => {
    console.log("jugadoresSnap", querySnapshot)
    infoJugadores.value = querySnapshot
  });


  // Escuchar cambios en la subcolección "partida"
  const partidaSnap = await onSnapshotDocument("partidas", codigoPartida.value, (querySnapshot) => {
    console.log("partidaSnap", querySnapshot)
    partidaActual.value = querySnapshot
  });

  // Escuchar cambios en la subcolección "cartas_jugadores" --- Cambiar para solo filtrar las del jugador actual
  const cartasJugadasSnap = await onSnapshotSubcollectionWithFullData("partidas", codigoPartida.value, "cartas_partida", (querySnapshot) => {
    console.log("cartasJugadas", querySnapshot)
    cartasJugadores.value = querySnapshot
  });

  infoCartas.value = await readCollection ("cartas")
  console.log("infoCartas", infoCartas.value)
})

onUnmounted(() => {
    // Cancela la suscripción cuando el componente se desmonta
    if (unsubscribe) {
        unsubscribe();
    }

});
</script>
