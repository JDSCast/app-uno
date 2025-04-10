<template>
  <div class="container-home">
    <div class="card card-home mx-auto my-5 shadow">
      <div class="card-body">
        <img src="/Logo-UNO.svg" class="card-img-top" alt="Logo juego uno">
        <h3 class="card-subtitle my-3 text-center">¡Hola, {{ userName }}!</h3>
        <p class="card-text">Aquí podrás crear o unirte a partidas con tus amigos.</p>
        
        <div class="d-grid gap-2">
          <button class="btn btn-outline-primary" @click="$router.push('/creategame')">Crear partida</button>
          <button class="btn btn-outline-success" @click="$router.push('/JoinGame')">Unirse a partida</button>
          <button class="btn btn-danger" @click="handleLogout">Cerrar sesión</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { AuthService } from "../firebase/auth.js";


const user = ref(null);
const userName = ref("");
const router = useRouter();


onMounted(() => {
  const unsubscribe = AuthService.onAuthStateChange(({ user: currentUser, profile, loggedIn }) => {
    if (loggedIn) {
      user.value = currentUser;
      userName.value = profile?.nombre || currentUser.displayName || "Jugador";
    } else {
      user.value = null;
      userName.value = "";
    }
  });

  return () => unsubscribe();
});

const handleLogout = async () => {
  try {
    const result = await AuthService.logout();
    if (result.success) {
      router.push("/login");
    } else {
      console.error(result.error);
      router.push("/");
    }
  } catch (error) {
    console.error("Error al cerrar sesión:", error.message);
  }
};

</script>
<style scoped>
.container-home {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-home {
  width: 400px;
}
</style>