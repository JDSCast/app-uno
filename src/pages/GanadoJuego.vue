<template>
    <div class="container vh-100 d-flex flex-column justify-content-center align-items-center">
      <h4 class="text-center">¡HAS GANADO LA PARTIDA!</h4>
      <button @click="volverLogin" class="btn btn-outline-dark mt-4">Salir</button>
    </div>
  </template>


<script setup>
const volverLogin = ()=>{
    router.push("login")
}

</script>
  