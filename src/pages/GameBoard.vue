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
          <Cuadrados :nombre="infoJugadores[2].nombre" :number="cartasJugador(infoJugadores[2].idJugador).length"
            :player="'J4'" />
        </div>
        <div v-else class="col-auto text-center">
          <p>Jugador no disponible</p>
        </div>
      </div>

      <!-- Centro: jugador izquierda (4), carta central, jugador derecha (2) -->
      <div class="row justify-content-center align-items-center flex-grow-1 text-center">
        <!-- Jugador 4 (izquierda) -->
        <div v-if="infoJugadores[3]" class="col-3 text-center">
          <Cuadrados :nombre="infoJugadores[3].nombre" :number="cartasJugador(infoJugadores[3].idJugador).length"
            :player="'J3'" />
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
          <Cuadrados :nombre="infoJugadores[1].nombre" :number="cartasJugador(infoJugadores[1].idJugador).length"
            :player="'J2'" />
        </div>
        <div v-else class="col-3 text-center">
          <p>Jugador no disponible</p>
        </div>
      </div>

      <!-- Parte inferior: jugador 1 y botones -->
      <div class="row align-items-center text-center">
        <div class="col-4">
          <button class="btn btn-outline-dark btn-lg w-100">¡UNO!</button>
        </div>

        <div v-if="infoJugadores[0]" class="col-4">
          <Cuadrados :nombre="infoJugadores[0].nombre" :number="cartasJugador(infoJugadores[0].idJugador).length"
            :player="'J1'" />
        </div>
        <div v-else class="col-4 text-center">
          <p>Jugador no disponible</p>
        </div>

        <div class="col-4">
          <button @click="tomarCartaNueva" :class="{ 'disabled': isDisabled }" class="btn btn-outline-dark btn-lg w-100">Tomar del mazo</button>
        </div>
      </div>
      <PlayerHand v-if="estadosListos" :handCards="cartasJugador(jugadorActual.value)" @select-card="cartaJugada"
        :class="{ 'disabled': isDisabled }" />

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
import { createSubCollection, readDocumentById, updateDocument, updateSubcollectionDocument, onSnapshotDocument, onSnapshotSubcollectionWithFullData, readCollection, listenToMultipleSubcollections, enrichDataWithField} from "../firebase/servicesFirebase.js";
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();
const jugadorActual = ref();
const infoJugadores = ref([]);
const infoCartas = ref([]);
const partidaActual = ref([]);
const cartasJugadores = ref([]);
const codigoPartida = ref(route.params.codigo);
const loading = ref(true); // Estado de carga


// Toco computadas las dos por que falla al hacer el renderizado
const estadosListos = computed(() => partidaActual.value && jugadorActual.value);

//Si el jugador actual no es el turno actual, se deshabilita
const isDisabled = computed(() => {
  // Solo calcular si los datos están disponibles
  if (partidaActual.value?.turnoActual && jugadorActual.value) {
    return partidaActual.value.turnoActual !== jugadorActual.value;
  }
  return true; // Predeterminado: deshabilitado si no hay datos
});

// Mapeo de la carta actual como propiedad computada
const cartaActual = computed(() => {
  if (infoCartas.value.length > 0 && partidaActual.value.cartaActual) {
    const idCartaActual = partidaActual.value.cartaActual;
    return infoCartas.value.find(carta => carta.id === idCartaActual) || null; // Retorna la carta o null si no se encuentra
  }
  return null;
});

const cartasJugador = computed(() => (idJugador=jugadorActual.value, lugar = "mano") => {
  if (infoCartas.value.length > 0 && cartasJugadores.value.length > 0) {
    // Filtrar las cartas que pertenecen al jugador con el id dado
    const cartasDelJugador = cartasJugadores.value
      .filter(carta => carta.idJugador === idJugador && carta.place === lugar)
      .map(carta => carta.idCarta); // Extraer los IDs de las cartas

    // Retornar las cartas con sus datos completos desde infoCartas
    return infoCartas.value.filter(carta => cartasDelJugador.includes(carta.id));
  }
  return []; // Si no hay datos, retorna un array vacío
});

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

// Función para cambiar el turno (normal, salto o reversa) -----------------------------------------------------
const cambiarTurno = async (avance = 1, reversa = partidaActual.value.ordenInverso || false) => {
  if (infoJugadores.value.length > 0 && partidaActual.value.turnoActual) {
    // Clonar los jugadores para evitar modificar el original
    const jugadoresOrdenados = [...infoJugadores.value];

    // Si es reversa, invertir el orden de los jugadores
    if (reversa) {
      jugadoresOrdenados.reverse();
    }

    // Obtener el índice actual del jugador en turno
    const turnoActual = partidaActual.value.turnoActual;
    const indexActual = jugadoresOrdenados.findIndex(jugador => jugador.idJugador === turnoActual);

    // Calcular el índice del nuevo turno (cíclico)
    const nuevoIndice = (indexActual + avance) % jugadoresOrdenados.length;
    const nuevoTurno = jugadoresOrdenados[nuevoIndice].idJugador;

    // Actualizar el campo "turno" en Firebase
    await updateDocument("partidas", codigoPartida.value, {
      turnoActual: nuevoTurno
    });

    console.log(`Turno actualizado: Jugador ${nuevoTurno} (avance: ${avance}, reversa: ${reversa})`);
  } else {
    console.error("No se pudo cambiar el turno.");
  }
};

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

// Función para que un jugador tome varias cartas
const tomarCartas = async (cantidad) => {
  for (let i = 0; i < cantidad; i++) {
    await tomarCartaNueva();
  }
};

// Modificar cartaJugada para aplicar efectos
const cartaJugada = (carta) => {
  // Validar que la carta y la carta actual tengan datos correctos
  if (!carta ) {
    Swal.fire("Error", "Datos de la carta o carta actual no válidos.", "error");
    return;
  }

  // Validar si se puede jugar la carta
  if (cartaActual.value) {

    const result = validateCardPlay(carta, cartaActual.value)
    if (!result) {
      Swal.fire({
        title: "Carta inválida", text: "Esta carta no se puede jugar en este momesnto.", icon: "error", showConfirmButton: false,
        timer: 1000
      });
      return;
    }
  }

  // Validar turno del jugador
  if (partidaActual.value.turnoActual !== jugadorActual.value) {
    Swal.fire("Espera", "No es tu turno, espera a que jueguen los demás.", "warning");
    return;
  }

  // Cambiar la carta actual en la partida
  cambiarCartaActual(carta);

  // Cambiar la carta en la subcolección "cartas_partida"
  updateCartaJugadores(carta);

  // Aplicar efectos de la carta jugada
  applyCardEffect(carta);

  // Cambiar el turno al siguiente jugador (si no es un efecto especial que lo altera)
  if (!["salta", "reversa", "toma2", "comodin4"].includes(carta.tipo)) {
    cambiarTurno();
  }
}

//Reglas del juego UNO ---------------------------------------------------------
const validateCardPlay = (card, lastCard) => {
  switch (card.tipo) {
    case "numero":
      return card.color === lastCard.color || card.numero === lastCard.numero;
    case "salta":
    case "reversa":
    case "toma2":
      return card.color === lastCard.color || card.tipo === lastCard.tipo;
    case "comodin":
    case "comodin4":
      return true;
    default:
      return false;
  }
};

// Aplicar efectos de las cartas especiales
const applyCardEffect = async (card) => {
  switch (card.tipo) {
    case "salta":
      await cambiarTurno(2); // Salta al siguiente jugador
      break;
    case "reversa":
      await updateDocument("partidas", codigoPartida.value, {
        ordenInverso: !partidaActual.value.ordenInverso
      });
      await cambiarTurno(1); // Cambia el orden del turno
      break;
    case "toma2":
      await tomarCartas(2); // El siguiente jugador toma 2 cartas
      await cambiarTurno(); // Cambia al siguiente turno
      break;
    case "comodin":
      Swal.fire("Comodín", "Selecciona un color para continuar.", "info");
      // Aquí puedes implementar la lógica para seleccionar un color
      break;
    case "comodin4":
      Swal.fire("Comodín +4", "Selecciona un color y el siguiente jugador toma 4 cartas.", "info");
      // Implementa la lógica para seleccionar un color
      await tomarCartas(4); // El siguiente jugador toma 4 cartas
      await cambiarTurno(); // Cambia al siguiente turno
      break;
    default:
      console.log("Carta sin efecto especial.");
  }
};

let unsubscribePartidaSnap = null;
let unsubscribeMultiSubCollection = null;

// Montaje de la infomacion de la partida en tiempo real ----------------------------------------------------
onMounted(async () => {
  try {
    const user = await AuthService.getCurrentUser();

    if (!user) {
      Swal.fire("Error", "No estás autenticado. Por favor, inicia sesión.", "error");
      router.push("/login");
      return;
    }
    jugadorActual.value = user.uid

    // Escuchar cambios en la subcolección "partida"
     unsubscribePartidaSnap = await onSnapshotDocument("partidas", codigoPartida.value, (querySnapshot) => {
      console.log("partidaSnap", querySnapshot)
      partidaActual.value = querySnapshot
    });

    unsubscribeMultiSubCollection = listenToMultipleSubcollections(
    ["cartas_partida", "jugadores_partida"], // Subcolecciones a escuchar
    async (datos, subcollection) => {
      if (subcollection === "cartas_partida") {
        cartasJugadores.value = datos; // Actualizar estado para cartas_partida
      } else if (subcollection === "jugadores_partida") {
        infoJugadores.value = await enrichDataWithField(datos, "jugadores", "idJugador", "nombre"); 

      }
    },
    "idPartida", // Campo a filtrar
    codigoPartida.value// Valor a filtrar
  );

    infoCartas.value = await readCollection ("cartas")
    console.log("infoCartas", infoCartas.value)

  } catch (error) {
    console.error("Error al cargar los datos:", error);
  } 
  finally {
    loading.value = false; // Finalizar el estado de carga
  }
})

onUnmounted(() => {
  // Cancela cada suscripción activa
  if (unsubscribeMultiSubCollection) {
    unsubscribeMultiSubCollection(); // Llama a la función para detener todas las suscripciones
  }
  if (unsubscribePartidaSnap) unsubscribePartidaSnap();
});


</script>
<style scoped>
.disabled {
  pointer-events: none;
  opacity: 0.5;
}
</style>