<template>
  <div class="container-home bg-light">
    <div class="card card-home mx-auto my-5 shadow">
      <div class="card-body">
        <img src="/Logo-UNO.svg" class="card-img-top" alt="Logo juego uno">
        <h5 class="card-subtitle my-3">Bienvenido, {{ userName }}</h5>
        <div class="d-grid gap-2">
          <button class="btn btn-outline-primary" @click="$router.push('/create-game')">Crear partida</button>
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
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";


    const user = ref(null);
    const userName = ref("");
    const router = useRouter();
    const auth = getAuth();
    const db = getFirestore();

    onMounted(() => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          user.value = currentUser;

          const userDoc = await getDoc(doc(db, "jugadores", currentUser.uid));
          if (userDoc.exists()) {
            userName.value = userDoc.data().name;
          } else {
            userName.value = currentUser.displayName || "Usuario";
          }
        } else {
          user.value = null;
          userName.value = "";
        }
      });

      return () => unsubscribe();
    });

    const handleLogout = async () => {
      try {
        await signOut(auth);
        router.push("/login");
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