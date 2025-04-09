import { createRouter, createWebHistory } from "vue-router";

// Importar componentes o paginas
import HelloWorld from "../components/HelloWorld.vue";

const routes = [
  { path: "/", name: "main", component: HelloWorld },
  { path: "/:pathMatch(.*)*", redirect: "/login" }, //Redirigir a /login si la ruta no existe
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
// El router se encarga de gestionar las rutas de la aplicacion, es decir, que componente se va a mostrar en cada ruta.
