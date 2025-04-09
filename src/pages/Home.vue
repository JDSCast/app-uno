<template>
    <div class="container-inicio">
      <div class="card card-inicio">
        <div class="card-body card-body-inicio">
          <h2 class="text-center">Monopoly</h2>
          <p>Bienvenido, {{ userName }}</p>
          <div class="d-grid gap-2">
            <button class="btn btn-outline-primary" @click="$router.push('/create-game')">Crear partida</button>
            <button class="btn btn-outline-success" @click="$router.push('/join-game')">Unirse a partida</button>
            <button class="btn btn-danger" @click="handleLogout">Cerrar sesión</button>
          </div>
        </div>
      </div>
    </div>
  </template>