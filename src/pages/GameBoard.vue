<template>
  <div class="container-fluid vh-100 d-flex flex-column justify-content-between py-3 bg-light-subtle">
    <!-- Mostrar un spinner o mensaje mientras se cargan los datos -->
    <div v-if="loading" class="text-center">
      <p>Cargando datos...</p>
    </div>

    <!-- Mostrar el contenido solo cuando los datos estén listos -->
    <div v-else>
      <!-- Jugador superior (Jugador 3) -->
      <div class="row justify-content-center mb-3">
        <div v-if="infoJugadores[2]" class="col-auto text-center">
          <Cuadrados :nombre="infoJugadores[2].nombre" :number="cartasJugador(infoJugadores[2].idJugador).length" :player="'J4'"/>
        </div>
        <div v-else class="col-auto text-center">
          <p>Jugador no disponible</p>
        </div>
      </div>

      <!-- Centro: jugador izquierda (4), carta central, jugador derecha (2) -->
      <div class="row justify-content-center align-items-center flex-grow-1 text-center">
        <!-- Jugador 4 (izquierda) -->
        <div v-if="infoJugadores[3]" class="col-3 text-center">
          <Cuadrados :nombre="infoJugadores[3].nombre" :number="cartasJugador(infoJugadores[3].idJugador).length" :player="'J3'" />
        </div>
        <div v-else class="col-3 text-center">
          <p>Jugador no disponible</p>
        </div>
        <!-- Carta central -->
        <div class="col-6 d-flex justify-content-center">
          <CentralCard :cardData="cartaActual" />
        </div>
        

        <!-- Jugador 2 (derecha) -->
        <div v-if="infoJugadores[1]" class="col-3 text-center">
          <Cuadrados :nombre="infoJugadores[1].nombre" :number="cartasJugador(infoJugadores[1].idJugador).length" :player="'J2'" />
        </div>
        <div v-else class="col-3 text-center">
          <p>Jugador no disponible</p>
        </div>
      </div>

      <!-- Parte inferior: jugador 1 y botones -->
      <div class="row align-items-center text-center">
        <div  class="col-4">
          <button class="btn btn-outline-dark btn-lg w-100">¡UNO!</button>
        </div>

        <div v-if="infoJugadores[0]" class="col-4">
          <Cuadrados :nombre="infoJugadores[0].nombre" :number="cartasJugador(infoJugadores[0].idJugador).length" :player="'J1'" />
        </div>
        <div v-else class="col-4 text-center">
          <p>Jugador no disponible</p>
        </div>

        <div class="col-4">
          <button @click="tomarCartaNueva" class="btn btn-outline-dark btn-lg w-100">Tomar del mazo</button>
        </div>
      </div>
      <PlayerHand :handCards="cartasJugador(jugadorActual.value)" @select-card="cartaJugada" />
    </div>
  </div>
</template>

<script setup>
import Cuadrados from "../components/Cuadrados.vue";
import CentralCard from "../components/CentralCard.vue";
import PlayerHand from '../components/PlayerHand.vue';
import { ref, onMounted, onUnmounted,computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { AuthService } from '../firebase/auth.js';
import { createSubCollection, readDocumentById, updateDocument, updateSubcollectionDocument, onSnapshotDocument, onSnapshotSubcollectionWithFullData, readCollection } from "../firebase/servicesFirebase.js";
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();
const jugadorActual = ref();
const infoJugadores = ref([]);
const infoCartas = ref([]);
const partidaActual = ref([]);
const cartasJugadores = ref([]);
const codigoPartida = ref(route.params.codigo);
const jugadoresGame = ref([]); // Jugadores de la partida
const loading = ref(true); // Estado de carga

//Funcion para tomar una carta aleatoria que no se encuentre en "cartas_partida"
const cartasDisponibles = computed(() => {
  if (infoCartas.value.length > 0 && cartasJugadores.value.length > 0) {
    // Filtrar IDs de cartas ya en juego
    const cartasEnJuego = cartasJugadores.value.map(carta => carta.idCarta);

    // Retornar las cartas de infoCartas que no están en juego
    return infoCartas.value.filter(carta => !cartasEnJuego.includes(carta.id));
  }
  return []; // Retorna un array vacío si no hay datos
});

const tomarCartaNueva = async () => {
  const disponibles = cartasDisponibles.value; // Obtener cartas disponibles

  if (disponibles.length > 0) {
    // Elegir una carta aleatoria
    const cartaAleatoria = disponibles[Math.floor(Math.random() * disponibles.length)];

    // Registrar la carta en juego (añadir a cartasJugadores con el jugador actual)
    const nuevaCarta = {
      idCarta: cartaAleatoria.id,
      idJugador: jugadorActual.value, // ID del jugador actual
      idPartida: codigoPartida.value,
      place: "mano", // Ubicación de la carta (en la mano del jugador)
    };

    await createSubCollection("partidas", codigoPartida.value, "cartas_partida", nuevaCarta, cartaAleatoria.id); // Registrar en Firebase
    console.log("Carta nueva tomada:", nuevaCarta);
  } else {
    console.log("No hay cartas disponibles para tomar.");
  }
}


// Mapeo de la carta actual como propiedad computada
const cartaActual = computed(() => {
  if (infoCartas.value.length > 0 && partidaActual.value.cartaActual) {
    const idCartaActual = partidaActual.value.cartaActual;
    return infoCartas.value.find(carta => carta.id === idCartaActual) || null; // Retorna la carta o null si no se encuentra
  }
  return null;
});

const cartasJugador = computed(() => (idJugador=jugadorActual.value) => {
  if (infoCartas.value.length > 0 && cartasJugadores.value.length > 0) {
    // Filtrar las cartas que pertenecen al jugador con el id dado
    const cartasDelJugador = cartasJugadores.value
      .filter(carta => carta.idJugador === idJugador && carta.place === "mano")
      .map(carta => carta.idCarta); // Extraer los IDs de las cartas

    // Retornar las cartas con sus datos completos desde infoCartas
    return infoCartas.value.filter(carta => cartasDelJugador.includes(carta.id));
  }
  return []; // Si no hay datos, retorna un array vacío
});

const cartaJugada = (carta) =>{
  console.log("cartaJugada", carta)
  // Cambiar la carta actual en la partida
  cambiarCartaActual(carta);
  // Cambiar la carta en la subcolección "cartas_partida"
  updateCartaJugadores(carta);

}

//Funcion para cambiar carta actual en partida
const cambiarCartaActual = async (carta) =>{
  await updateDocument("partidas", codigoPartida.value,{
    cartaActual: carta.id
  })
}

const updateCartaJugadores = async (carta)=>{
  await updateSubcollectionDocument("partidas", codigoPartida.value, "cartas_partida", carta.id, {
    place: "mesa"
  })
}
// Funcion para determinar el numero de cartas de cada jugador
const obtenerCartas = (idJugador) => {
  // Filtra las cartas donde el idJugador coincida con el dado
  const cartasMano = cartasJugadores.value
    .filter(carta => carta.idJugador === idJugador)
    .map(carta => carta.idCarta); 

  // console.log("ID del jugador:", idJugador);
  // console.log("Cartas del jugador:", cartasMano);

  return cartasMano;
};

let unsubscribeJugadoresSnap = null;
let unsubscribePartidaSnap = null;
let unsubscribeCartasJugadasSnap = null;

// Montaje de la infomacion de la partida en tiempo real
onMounted(async () => {
  try {
    const user = await AuthService.getCurrentUser();
    console.log("user", user)
    if (!user) {
      Swal.fire("Error", "No estás autenticado. Por favor, inicia sesión.", "error");
      router.push("/login");
      return;
    }
    jugadorActual.value = user.uid
    console.log("jugadorActual", jugadorActual.value)
    // Escuchar cambios en la subcolección "jugadores_partida"
     unsubscribeJugadoresSnap = await onSnapshotSubcollectionWithFullData("partidas", codigoPartida.value, "jugadores_partida", (querySnapshot) => {
      console.log("jugadoresSnap", querySnapshot)
      infoJugadores.value = querySnapshot
    });


    // Escuchar cambios en la subcolección "partida"
     unsubscribePartidaSnap = await onSnapshotDocument("partidas", codigoPartida.value, (querySnapshot) => {
      console.log("partidaSnap", querySnapshot)
      partidaActual.value = querySnapshot
    });

    // Escuchar cambios en la subcolección "cartas_jugadores" --- Cambiar para solo filtrar las del jugador actual
     unsubscribeCartasJugadasSnap = await onSnapshotSubcollectionWithFullData("partidas", codigoPartida.value, "cartas_partida", (querySnapshot) => {
      console.log("cartasJugadas", querySnapshot)
      cartasJugadores.value = querySnapshot
    });

    infoCartas.value = await readCollection ("cartas")
    console.log("infoCartas", infoCartas.value)
    // loading.value = false;
  } catch (error) {
    console.error("Error al cargar los datos:", error);
  } 
  finally {
    loading.value = false; // Finalizar el estado de carga
  }
})

onUnmounted(() => {
  // Cancela cada suscripción activa
  if (unsubscribeJugadoresSnap) unsubscribeJugadoresSnap();
  if (unsubscribePartidaSnap) unsubscribePartidaSnap();
  if (unsubscribeCartasJugadasSnap) unsubscribeCartasJugadasSnap();
});

// Observadores de cambios
// watch([partidaActual,infoCartas], asignarCartaActual, { immediate: true });
</script>
