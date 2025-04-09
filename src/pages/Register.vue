<template>
    <div class="container-register">
      <div class="card card-register mx-auto">
        <div class="card-body card-body-register">
          <h2 class="text-center">Registro</h2>
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
          <p class="text-center mt-3">
            ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link>
          </p>
        </div>
      </div>
    </div>
  </template>