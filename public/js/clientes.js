import customFetch from "./utileria/customFetch.js";
import {
  generarPaginacion
} from "./components/Paginacion.js";
import crearModalCliente from "./components/ModalCliente.js";

const inputSearch = document.getElementById("input-buscar-clientes");
const btnBuscar = document.getElementById("btn-buscar-clientes");
const btnCrear = document.querySelector(".btn-crear-cliente")

const tabla = document.getElementById("tabla");
const fragmento = document.createDocumentFragment();
const sectionTabla = document.querySelector("section");
const divPaginacion = document.getElementById("pagination");


const URL_CLIENTES = "http://localhost:8080/punto-venta-api/v0/clientes";

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}

//Ejecutando Paginacion reutilizable
const generarPaginacionclientes = (paginaActual, totalPages, isFirst, isLast, divPaginacion, tabla, urlPeticion, callbackCrearTabla) => {
  const infoPage = {
    paginaActual,
    totalPages,
    isFirst,
    isLast,
  };
  const renderPaginacion = {
    divPaginacion,
    tabla
  };
  const accion = {
    urlPeticion,
    callbackCrearTabla,
  };
  generarPaginacion(infoPage, renderPaginacion, accion);

}

export const guardarCliente = async (cliente) => {
  const url = URL_CLIENTES;
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(cliente)
  }
  await customFetch(url, options);
}

export const editarCliente = async (id, cliente) => {
  const url = `${URL_CLIENTES}/${id}`;
  const options = {
    method: 'PUT',
    headers,
    body: JSON.stringify(cliente)
  }
  await customFetch(url, options);
}

const eliminarClientePorId = async (id) => {
  const url = `${URL_CLIENTES}/${id}`;
  const options = {
    method: 'DELETE',
    headers
  }
  await customFetch(url, options);
}

const crearFilaCliente = (cliente) => {
  const fila = document.createElement("tr");

  //ingresar una imagen
  const td = document.createElement("td");
  const img = document.createElement("img");
  img.src = "../assets/icons8-cliente-50.png";
  td.appendChild(img);
  fila.appendChild(td);
  //lleno contenido de la fila con valores del objeto cliente
  for (const llave in cliente) {
    if (llave != "id") {
      const td = document.createElement("td");
      td.textContent = cliente[llave];
      fila.appendChild(td);
    }
  }


  //creo columnas donde estaran boton(editar y eliminar)
  const tdOperacion = document.createElement("td");

  //creacion de botones eliminar y editar
  const btnEliminar = document.createElement("button");
  const btnEditar = document.createElement("button");

  //agrego una clase a los botones editar y eliminar para darle estilos
  btnEliminar.classList.add("btn-eliminar");
  btnEditar.classList.add("btn-editar");

  //le asigno al data atributte del boton un id para guardar el id del cliente y despues usar ese id
  //para operaciones de actualizacion y eliminacion
  btnEliminar.dataset.id = cliente.id
  btnEditar.id = "btn-editar-cliente";


  //meto los elementos botones al elemento columna que contendra las operaciones
  tdOperacion.appendChild(btnEditar).textContent = "Editar";
  tdOperacion.appendChild(btnEliminar).textContent = "Eliminar";

  //le asigno un evento al boton editar para posterior menten abrir un modal con los valores
  //que contiene la fila
  btnEditar.addEventListener("click", () => {

    //al boton guardar dentro del modal a su data atributte le doy el valor del id para
    //usarlo para actualizar el elemento
    document.querySelector(".btn-guardar").dataset.id = cliente.id;

    //modal para la editacion
    crearModalCliente(true, cliente, "PUT")
  });
  fila.appendChild(tdOperacion);

  return fila;
}

const isNetworkError = (error) => {
  if(error instanceof TypeError && error.message === 'NetworkError when attempting to fetch resource.'
  ||error instanceof TypeError && error.message === 'Failed to fetch'){
    return true;
  }
    return false
}

const filaDefaultSiNoExistenElementosClientes = ()=>{
  const tr = document.createElement('tr');
  const td = document.createElement('td');
  td.setAttribute("colspan", "7");
  td.style.textAlign = 'center';
  td.textContent = "informacion no disponible";
  tr.appendChild(td);
  tabla.appendChild(tr);
  btnCrear.classList.add("btn-disable");
  btnBuscar.classList.add("btn-disable");
}
const crearTablaClientes = async (urlClienteBusqueda, numPage) => {
  let url = urlClienteBusqueda || URL_CLIENTES;
  if (numPage != null) url = `${url}?page=${numPage}`;

  const clientesResponse = await obtenerClientes(url);

  if (!isNetworkError(clientesResponse)) {
    clientesResponse.content.forEach(cliente => {
      const fila = crearFilaCliente(cliente);
      fragmento.appendChild(fila);
      fragmento.cloneNode(true);
    })
    tabla.appendChild(fragmento);

    //generar paginacion
    let {number,totalPages,first,last} = clientesResponse;
    generarPaginacionclientes(number, totalPages, first, last, divPaginacion, tabla, URL_CLIENTES, crearTablaClientes);

    btnCrear.classList.remove("btn-disable");
    btnBuscar.classList.remove("btn-disable");
  } else {
    filaDefaultSiNoExistenElementosClientes();
  }

}

const obtenerClientes = async (url) => {
  const options = {headers}
  const clientes = await customFetch(url, options);
  return clientes;
}


sectionTabla.addEventListener("click", async (e) => {
  e.preventDefault();
  if (e.target.matches(".btn-eliminar")) {
    let idcliente = e.target.dataset.id;
    await eliminarClientePorId(idcliente);
    location.reload(true);
  }
  if (e.target.matches(".btn-crear-cliente")) {
    crearModalCliente(false, {}, "POST");
  }
  if (e.target.matches("#btn-buscar-clientes")) {
    let urlBuscar = `${URL_CLIENTES}/search?query=${inputSearch.value}`;
    tabla.innerHTML = '';
    crearTablaClientes(urlBuscar);

  }
})
document.addEventListener("DOMContentLoaded", () => {
  crearTablaClientes();
});