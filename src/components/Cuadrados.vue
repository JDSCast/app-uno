<template>
    <div @click="alertMe" class="container d-flex flex-column align-items-center m-2 clickable">
        <h3><strong>{{ nombre }}</strong></h3>
        <div class="container-squares">
        <div v-for="index in displayedSquares.length" :key="index"
            class="square bg-primary border border-dark shadow d-flex align-items-center justify-content-center"
            :style="{ top: `${(index - 1) * overlap}px`, left: `${(index - 1) * overlap}px` }">
            <!-- Mostrar número solo en el último cuadro -->
            <span v-if="index === displayedSquares.length && number > maxSquares" class="text-white fw-bold fs-4 p-1 bg-dark rounded-1">
                {{ number }}
            </span>
        </div>
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, toRefs } from 'vue';

// Definir las props con valores predeterminados
const props = defineProps({
    nombre: {
        type: String,
        default: "Jugador", // Valor por defecto si no se proporciona
    },
    number: {
        type: Number,
        default: 10, // Valor por defecto si no se proporciona
    },
    size: {
        type: Number,
        default: 50, // Tamaño fijo por defecto
    },
    overlap: {
        type: Number,
        default: 6, // Desplazamiento entre cuadros por defecto
    },
    maxSquares: {
        type: Number,
        default: 5, // Máximo número de cuadros superpuestos por defecto
    },
});

// Convertir props a referencias reactivas
const { nombre, number, maxSquares, overlap } = toRefs(props);

// Lógica para calcular los cuadros visibles
const displayedSquares = computed(() => {
    const squaresToShow = Math.min(number.value, maxSquares.value);
    return Array.from({ length: squaresToShow });
});

const alertMe = ()=>{
    alert("Boton de mis cartas")
}
</script>

<style scoped>
.square {
    position: absolute;
    /* background-image: url("/public/Logo-UNO.svg");
    background-position:
        center;
    object-fit: cover;
    background-size: 3rem;
    background-repeat: no-repeat; */
    width: 60px;
    /* Tamaño fijo */
    height: 90px;
    border-radius: 5px;
    /* Bordes redondeados */
    cursor: pointer;
}
.container-squares {
    position: relative;
    width: 100px;
    height: 130px;
}
</style>