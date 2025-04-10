import { createRouter, createWebHistory } from "vue-router";
import { Lobby, Cartas, GanadoJuego, Login, Home, Register, JoinGame, CreateGame} from '../pages'
import {  TomarCarta } from '../components'


const routes = [
  { path: '/register', name: 'Register', component: Register },
  { path: '/lobby', name: 'Lobby', component: Lobby },
  { path: '/cartas', name: 'Cartas', component: Cartas },
  {path: "/tomar-carta", name: "Tomar-carta", component:TomarCarta },
  {path: "/ganador",name: "GanadoJuego", component: GanadoJuego},
  {path: "/home",name: "Home", component: Home},
  {path:"/joingame", name: "joingame", component: JoinGame},
  {path:"/creategame", name: "creategame", component: CreateGame},
  {path: "/login", name : "Login",component: Login},
  {path: "/register", name:"register", component: Register},
  { path: "/:pathMatch(.*)*", redirect: "/login" }, //Redirigir a /login si la ruta no existe
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
// El router se encarga de gestionar las rutas de la aplicacion, es decir, que componente se va a mostrar en cada ruta.
