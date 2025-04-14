import Swal from "sweetalert2";

let alertaEnProceso = false; // Bandera para saber si una alerta está activa
const colaDeAlertas = []; // Cola de alertas pendientes

export function mostrarAlertaSecuencial(html, title = "Información", icon = "info") {
  // Agregar la alerta a la cola
  colaDeAlertas.push({ html, title, icon });

  // Si no hay una alerta en proceso, procesar la siguiente
  if (!alertaEnProceso) {
    procesarCola();
  }
}

async function procesarCola() {
  if (colaDeAlertas.length === 0) return; // Salir si no hay alertas en la cola

  alertaEnProceso = true; // Marcar que una alerta está activa

  // Extraer la siguiente alerta de la cola
  const { html, title, icon } = colaDeAlertas.shift();

  // Mostrar la alerta y esperar a que se cierre
  await Swal.fire({
    title,
    html,
    icon,
    confirmButtonText: "Aceptar",
  });

  alertaEnProceso = false; // Marcar que la alerta ha terminado

  // Procesar la siguiente alerta en la cola
  procesarCola();
}
