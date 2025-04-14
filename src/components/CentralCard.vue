<template>
    <div class="card border-2 text-center rounded-3" :class="cardClass" style="width: 6rem;">
        <div v-if="cardData">
            <div class="card-body rounded-3 align-content-center">
                <span v-if="cardData.tipo === 'numero'" class="card-title display-4">
                    <strong>{{ cardData.numero }}</strong>
                </span>
                <span v-else class="card-title fs-4">
                    <!-- Render para cartas especiales -->
                    {{ specialCardText }}
                </span>
            </div>
        </div>
        <div v-else>
            <div class="card-body bg-dark uno-card text-white rounded-3">
                <!-- <span class="card-title">Sin carta</span> -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, toRefs } from 'vue';

const props = defineProps({
    cardData: {
        type: Object,
        required: false,
        default: null,
    },
    colorActual: { // Para cambiar a los comodines
        type: String,
        required: false,
        default: null,
    },
    isCenterCard: { // diferenciar uso como carta central
        type: Boolean,
        required: false,
        default: false,
    },
});

const { cardData, isCenterCard, colorActual } = toRefs(props);

// Mapeo de colores en español a clases de Bootstrap
const colorMap = {
    rojo: 'danger',
    azul: 'primary',
    amarillo: 'warning',
    verde: 'success',
    gris: 'secondary', // Para cartas sin color específico
};

// Texto descriptivo para cartas especiales
const specialCardMap = {
    toma2: 'Toma 2',
    comodin: 'Comodín',
    comodin4: 'Comodín +4',
    salta: 'Salta',
    reversa: 'Reversa',
};

const cardClass = computed(() => {
    let color;

    // Si la carta es un comodín y esta en la mitad, usar el colorActual de la partida
    if (isCenterCard.value && (cardData?.value?.tipo === "comodin" || cardData?.value?.tipo === "comodin4")) {
        // Si es la carta central y es un comodín, usar colorActual
        color = colorActual.value || 'gris';
    } else {
        // Si no es la carta central o no es un comodín, usar el color de la carta
        color = cardData?.value?.color || 'gris';
    }

    const bootstrapColor = colorMap[color.toLowerCase()] || 'dark'; // Conversión o uso de un color por defecto
    return `bg-${bootstrapColor} text-white`;
});

const specialCardText = computed(() => {
    if (cardData?.value?.tipo && cardData.value.numero === -1) {
        return specialCardMap[cardData.value.tipo] || 'Carta especial';
    }
    return ''; // Por defecto vacío si no es especial
});
</script>

<style scoped>
.uno-card {
    background-image: url("/public/Logo-UNO.svg") !important;
    background-position: center;
    object-fit: cover;
    background-size: 5rem;
    background-repeat: no-repeat;
}

.card-body {
    width: 6rem;
    height: 8rem;
}
</style>
