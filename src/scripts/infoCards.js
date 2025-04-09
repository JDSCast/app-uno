// Importar Firebase y Firestore
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
    // aca van las apis papu
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const colores = ["rojo", "azul", "verde", "amarillo"];

const cartas = [];

// Cartas numéricas (del 0 al 9, con duplicados del 1 al 9)
colores.forEach(color => {
  // Una carta con número 0
  cartas.push({ color, tipo: "numero", numero: 0 });

  // Dos cartas de cada número del 1 al 9
  for (let i = 1; i <= 9; i++) {
    cartas.push({ color, tipo: "numero", numero: i });
    cartas.push({ color, tipo: "numero", numero: i });
  }
});

// Cartas de acción (toma 2, reversa, salta) - 2 por color por tipo
colores.forEach(color => {
  for (let i = 0; i < 2; i++) {
    cartas.push({ color, tipo: "toma2", numero: -1});
    cartas.push({ color, tipo: "reversa", numero: -1 });
    cartas.push({ color, tipo: "salta", numero: -1 });
  }
});

// Comodines sin color
for (let i = 0; i < 4; i++) {
  cartas.push({ color: "ninguno", tipo: "comodin", numero: -1 });
  cartas.push({ color: "ninguno", tipo: "comodin4", numero: -1 });
}

const subirCartas = async () => {
  try {
    const refCartas = collection(db, "cartas");

    for (const carta of cartas) {
      console.log("Subiendo carta:", carta);
      await addDoc(refCartas, carta);
    }

    console.log("¡Todas las cartas fueron subidas exitosamente!");
  } catch (error) {
    console.error("Error al subir cartas:", error);
  }
};

subirCartas();
