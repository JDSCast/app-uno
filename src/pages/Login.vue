<template>
    <div class="container-login">
      <div class="card card-login">
        <div class="card-body card-body-login">
          <h1 class="text-center">Iniciar Sesión</h1>
          <form >
            <div class="mb-3">
              <label class="form-label">Correo electrónico</label>
              <input type="email" class="form-control" v-model="email" />
            </div>
            <div class="mb-3">
              <label class="form-label">Contraseña</label>
              <input type="password" class="form-control" v-model="password" />
            </div>
            <div class="d-grid">
              <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
            </div>
          </form>
          <p class="mt-3 text-center">
            ¿No tienes cuenta? <router-link to="/register">Regístrate aquí</router-link>
          </p>
        </div>
      </div>
    </div>
  </template>
  