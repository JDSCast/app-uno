<template>
    <div class="container-join text-center">
      <div class="card card-join">
        <div class="card-body-join">
          <h3>Unirse a una partida</h3>
          <input
            type="text"
            class="form-control my-2"
            placeholder="Código de la partida"
            v-model="codigoIngresado"
            :disabled="esperandoInicio"
          />
  
          <div class="d-grid">
            <button class="btn btn-outline-success" @click="unirseAPartida" :disabled="esperandoInicio">
              {{ esperandoInicio ? "Esperando..." : "Unirse" }}
            </button>
            <button class="btn btn-danger mt-2" @click="$router.push('/inicio')">
              Cancelar
            </button>
          </div>
  
          <div v-if="esperandoInicio" class="mt-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Esperando...</span>
            </div>
          </div>
  
          <p v-if="mensaje" class="mt-2">{{ mensaje }}</p>
        </div>
      </div>
    </div>
  </template>