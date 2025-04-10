<template>
  <div
    class="d-flex justify-content-center align-items-center min-vh-100 bg-light"
  >
    <div class="card shadow-lg p-4" style="max-width: 800px; width: 100%">
      <h3 class="text-center text-danger fw-bold mb-4">
        Historial de movimientos
      </h3>

      <div class="table-responsive" style="max-height: 250px; overflow-y: auto">
        <table class="table table-bordered text-center align-middle mb-0">
          <thead class="table-light sticky-top">
            <tr>
              <th>Turno</th>
              <th>Jugador</th>
              <th>Acción</th>
              <th>Carta</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(movimiento, index) in movimientos"
              :key="index"
              :class="{
                'table-danger': movimiento.color === 'rojo',
                'table-secondary': movimiento.color === 'gris',
              }"
            >
              <td>{{ movimiento.turno }}</td>
              <td>{{ movimiento.jugador }}</td>
              <td>{{ movimiento.accion }}</td>
              <td>
                <span v-if="movimiento.carta === 'prohibido'">🚫</span>
                <span v-else>{{ movimiento.carta }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="text-start mt-3">
        <button class="btn btn-outline-dark" @click="$router.push('/home')">
          ← Volver
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HistorialMovimientos",
  data() {
    return {
      movimientos: [
        {
          turno: 1,
          jugador: "Jugador 1",
          accion: "Jugó carta",
          carta: "6",
          color: "rojo",
        },
        {
          turno: 2,
          jugador: "Jugador 2",
          accion: "Jugó carta",
          carta: "prohibido",
          color: "rojo",
        },
        {
          turno: 3,
          jugador: "Jugador 3",
          accion: "Salta turno",
          carta: "",
          color: "gris",
        },
        {
          turno: 4,
          jugador: "Jugador 4",
          accion: "Jugó carta",
          carta: "5",
          color: "rojo",
        },
        {
          turno: 5,
          jugador: "Jugador 1",
          accion: "Jugó carta",
          carta: "2",
          color: "rojo",
        },
        {
          turno: 4,
          jugador: "Jugador 4",
          accion: "Jugó carta",
          carta: "5",
          color: "rojo",
        },
        {
          turno: 5,
          jugador: "Jugador 1",
          accion: "Jugó carta",
          carta: "2",
          color: "rojo",
        },
        {
          turno: 4,
          jugador: "Jugador 4",
          accion: "Jugó carta",
          carta: "5",
          color: "rojo",
        },
        {
          turno: 5,
          jugador: "Jugador 1",
          accion: "Jugó carta",
          carta: "2",
          color: "rojo",
        },
      ],
    };
  },
};
</script>
