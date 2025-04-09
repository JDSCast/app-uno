<template>
  <div class="login-container d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <div class="card card-login w-100" style="max-width: 600px;">
      <div class="login-card p-5 shadow-sm rounded-3 bg-white">
        <h1 class="text-center mb-4 fw-bold">Registro</h1>
        <form @submit.prevent="handleRegister">
          <div class="mb-3">
            <label class="form-label">Nombre de usuario</label>
            <input type="text" class="form-control" v-model="name" />
          </div>
          <div class="mb-3">
            <label class="form-label">Correo electrónico</label>
            <input type="email" class="form-control" v-model="email" />
          </div>
          <div class="mb-3">
            <label class="form-label">Contraseña</label>
            <input type="password" class="form-control" v-model="password" />
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-primary">Registrarse</button>
          </div>
        </form>
        <p class="mt-3 text-center">
          ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link>
        </p>
      </div>
    </div>
  </div>
</template>


<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Swal from 'sweetalert2';

export default {
  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const router = useRouter();
    
    const auth = getAuth();
    const db = getFirestore();

    const verificarNombreUnico = async (nombre) => {
      const q = query(collection(db, "usuarios"), where("name", "==", nombre));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    };

    const handleRegister = async () => {
      if (!name.value || !email.value || !password.value) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Todos los campos son obligatorios.',
          confirmButtonText: 'OK'
        });
        return;
      }

      try {
        // Mostrar loading mientras se valida
        Swal.fire({
          title: 'Registrando...',
          text: 'Por favor espera',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        const existeNombre = await verificarNombreUnico(name.value);
        if (existeNombre) {
          Swal.close(); // Cerrar loading
          Swal.fire({
            icon: 'error',
            title: 'Nombre en uso',
            text: 'El nombre de usuario ya fue registrado por otro jugador.',
            confirmButtonText: 'OK'
          });
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name.value });

        await setDoc(doc(db, "usuarios", user.uid), {
          uid: user.uid,
          name: name.value,
          email: email.value,
        });

        Swal.close(); // Cerrar loading

        // Mostrar alerta de éxito y redirigir al login después del OK
        await Swal.fire({
          icon: "success",
          title: "Registrado",
          text: "Usuario registrado correctamente.",
          confirmButtonText: "OK",
        });

        router.push("/login");

      } catch (error) {
        Swal.close(); // Cerrar loading si hay error
        handleAuthError(error.code);
      }
    };

    const handleAuthError = (errorCode) => {
      const errorMessages = {
        'auth/email-already-in-use': "El correo ya está registrado.",
        'auth/invalid-email': "Correo inválido.",
        'auth/weak-password': "La contraseña debe tener al menos 6 caracteres.",
      };
      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: errorMessages[errorCode] || "Error al registrar. Inténtalo de nuevo.",
        confirmButtonText: "OK",
      });
    };

    return { name, email, password, handleRegister };
  }
};
</script>

