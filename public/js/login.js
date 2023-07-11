import { crearModalInfo } from "./components/ModalInfo.js";
import customFetch from "./utileria/customFetch.js";

const form = document.querySelector('form');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');

const URL_BASE = 'http://localhost:8080/punto-venta-api/v0/auth';

const isNetworkError = (error)=>{
    return (error instanceof TypeError && error.message === 'NetworkError when attempting to fetch resource.')?true:false;
  }

const logeo = async(username, password) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    }
    const response = await customFetch(`${URL_BASE}/login`, options);
    if(!isNetworkError(response)) {
        if(JSON.stringify(response).includes('token')){
            localStorage.setItem('token', response.token)
            location.href="/public/pages/productos.html";
        }
    }else{
        crearModalInfo("Conexion fallida",document.querySelector("main"),1500);
    }
   
   
}






form.addEventListener('submit', e => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;
    logeo(username,password);
});