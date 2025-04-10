<template>
  <div
    class="d-flex justify-content-center align-items-center min-vh-100"
  >
    <div class="card card-create">
      <div class="card-body card-body-create">
        <h3 class="me-2">Código: {{ codigo }}</h3>
        <h5>
          Estado de la partida:
          <span class="badge bg-primary">{{ estado }}</span>
        </h5>
        <h4>Lista de participantes</h4>
        <ul class="list-group">
          <li
            v-for="(p, index) in participantes"
            :key="index"
            class="list-group-item"
          >
            {{ p.nombre }}
          </li>
        </ul>
        <div v-if="estado === 'No iniciada'" class="d-grid">
          <button class="btn btn-outline-primary mt-3" @click="iniciarPartida">
            Iniciar partida
          </button>
          <button class="btn btn-danger mt-3" @click="$router.push('/home')">
            Volver
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { AuthService } from "../firebase/auth.js";
import {
  createDocument,
  readDocumentById,
  updateDocument,
  createSubCollection,
  onSnapshotDocument,
  onSnapshotSubcollectionWithFullData,
  readCollection
} from "../firebase/servicesFirebase.js";
import Swal from "sweetalert2";

export default {
  setup() {
    const codigo = ref("");
    const participantes = ref([]);
    const estado = ref("esperando");
    const router = useRouter();

    const generarCodigo = () => {
      const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let codigo = "";
      for (let i = 0; i < 5; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres.charAt(indiceAleatorio);
      }
      return codigo;
    };

    onMounted(async () => {
      const user = await AuthService.getCurrentUser();
      console.log(user);
      if (!user) {
        Swal.fire(
          "Error",
          "Debes iniciar sesión para crear una partida.",
          "error"
        );
        return;
      }

      const { displayName, uid } = user;
      console.log(displayName, uid);
      let nuevoCodigo;
      let partidaSnap;

      try {
        // Verifica y genera un código único
        do {
          nuevoCodigo = generarCodigo(); // Generar un nuevo código
          partidaSnap = await readDocumentById("partidas", nuevoCodigo);
        } while (partidaSnap); // Repetir mientras el código ya exista

        // Crea la nueva partida
        await createDocument(
          "partidas",
          {
            codigo: nuevoCodigo,
            estado: "esperando",
            turnoActual: null,
            cartaActual: null,
            colorActual: null,
            cartaAcumulada: null,
          },
          nuevoCodigo
        );

        //Añadir el jugador a "jugadores_partida"
        await createSubCollection(
          "partidas",
          nuevoCodigo,
          "jugadores_partida",
          {
            idJugador: uid,
            idPartida: nuevoCodigo,
            host: true,
            estadoUno: false,
          }
        );

        // Asignar valores locales
        codigo.value = nuevoCodigo;
        estado.value = "No iniciada";

        // Escuchar cambios en la subcolección "jugadores_partida"
        await onSnapshotSubcollectionWithFullData(
          "partidas",
          codigo.value,
          "jugadores_partida",
          (querySnapshot) => {
            participantes.value = querySnapshot;
          }
        );

        // Escuchar cambios en la partida
        await onSnapshotDocument("partidas", codigo.value, (docSnap) => {
          if (docSnap) {
            if (docSnap.estado === "iniciada") {
              router.push(`/partida/${codigo.value}`);
            }
          }
        });
      } catch (error) {
        console.error("Error al crear la partida:", error);
        Swal.fire(
          "Error",
          "No se pudo crear la partida. Inténtalo de nuevo.",
          "error"
        );
      }
    });

    const asignarCartasAJugadores = async (codigoPartida, jugadores) => {
      try {
        // Obtén todas las cartas de la colección "Cartas"
        const cartasTotalesSnap = await readCollection("cartas"); // Suponiendo que tienes un documento que contiene todas las cartas
        let cartasDisponibles = cartasTotalesSnap

        if (!cartasDisponibles || cartasDisponibles.length === 0) {
          throw new Error("No hay cartas disponibles en la colección 'Cartas'.");
        }

        for (let jugador of jugadores) {
          const cartasJugador = [];

          for (let i = 0; i < 7; i++) {
            const indiceAleatorio = Math.floor(Math.random() * cartasDisponibles.length);
            const cartaSeleccionada = cartasDisponibles[indiceAleatorio];

            cartasJugador.push(cartaSeleccionada);

            // Crea el registro en la subcolección "cartas_partida"
            await createSubCollection("partidas", codigoPartida, "cartas_partida", {
              idJugador: jugador.idJugador,
              idPartida: codigoPartida,
              idCarta: cartaSeleccionada.id,
              place: "mano"
            }, cartaSeleccionada.id);

            // Elimina la carta asignada del conjunto disponible
            cartasDisponibles.splice(indiceAleatorio, 1);
          }

          // console.log(`Cartas asignadas al jugador ${jugador.nombre}:`, cartasJugador);
        }

        console.log("Asignación de cartas completada.");
      } catch (error) {
        console.error("Error en la asignación de cartas:", error);
        throw error;
      }
    };


    const iniciarPartida = async () => {
      try {
        const confirmar = await Swal.fire({
          title: "¿Iniciar partida?",
          text: "Una vez iniciada, no podrás agregar más jugadores.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, iniciar",
          cancelButtonText: "Cancelar",
        });

        if (confirmar.isConfirmed) {
          // Valida si el número de jugadores es suficiente
          if (participantes.value.size < 2) {
            Swal.fire(
              "Mínimo de jugadores no alcanzado",
              "Necesitas al menos 2 jugadores para iniciar la partida.",
              "error"
            );
            return;
          }

<<<<<<< HEAD
          await updateDocument("partidas", codigo.value, {
            estado: "iniciada",
          });
=======
          // Asigna las cartas a los jugadores
          await asignarCartasAJugadores(codigo.value, participantes.value);
          
          await updateDocument("partidas", codigo.value, { estado: "iniciada" })
>>>>>>> cadee4198a2ceb05908b092db30e3abef74771c7
        }
      } catch (error) {
        console.error("Error al iniciar la partida:", error);
        Swal.fire("Error", "No se pudo iniciar la partida.", "error");
      }
    };

    return { codigo, participantes, estado, iniciarPartida };
  },
};
</script>

<style scoped></style>
