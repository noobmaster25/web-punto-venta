import customFetch from "./utileria/customFetch.js";
import modalProducto from "./components/ModalProductos.js";
import {generarPaginacion} from "./components/Paginacion.js";
import { crearModalInfo } from "./components/ModalInfo.js";

const inputSearch = document.getElementById("input-buscar");
const btnBuscar = document.getElementById("buscar");
const btnCrearProducto = document.querySelector(".btn-crear-producto");
const tabla = document.getElementById("tabla");
const fragmento = document.createDocumentFragment();
const sectionTabla = document.querySelector("section");
const divPaginacion = document.getElementById("pagination");


const URL_PRODUCTOS = "http://localhost:8080/punto-venta-api/v0/productos";

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
};


//Ejecutando Paginacion reutilizable
const generarPaginacionProductos = (paginaActual, totalPages, isFirst, isLast, divPaginacion, tabla, urlPeticion, callbackCrearTabla) => {
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
const generarModalEstatico = ()=>{
// PAGINACION ESTATICA SOLO PARA ESTE ARCHIVO

// const cambiarPagina = (numPagina) => {
//   tabla.innerHTML = '';
//   let url = `${URL_PRODUCTOS}?page=${numPagina}`;
//   crearTablaProductos(url);
// }

// const agregarPagina =(pagina, textoPagina,isActive) => {

//   let btnIsActive = isActive || false;
//   const btnPagina = document.createElement("button");
//   btnPagina.textContent = textoPagina;
//   btnPagina.addEventListener("click", (e) => {
//     cambiarPagina(pagina)
//   });
//   if(btnIsActive)btnPagina.classList.add("active")
//   divPaginacion.appendChild(btnPagina);
// }

// const generarPaginacion = (paginaActual, totalPages, isFirst, isLast) => {

//   divPaginacion.innerHTML = '';


//   //pagina inicio y fin pagina son como positiones de las paginas que quiero renderizar
//   let paginaInicio = Math.max(1, paginaActual - 2);
//   let finPagina = Math.min(totalPages, paginaInicio + 3);


//   if (!isFirst) {
//     agregarPagina(paginaActual - 1, "<<");
//   }


//   for (let index = paginaInicio; index <= finPagina; index++) {
//     if(index == paginaActual + 1 ) {agregarPagina(index - 1, index.toString(),true);continue;}
//     agregarPagina(index - 1, index.toString());
//   }
//   if (totalPages > 4 && finPagina < totalPages && finPagina != totalPages-1) {
//     const p = document.createElement("p")
//     p.textContent="....";
//     divPaginacion.appendChild(p);
//     agregarPagina(totalPages-1, totalPages.toString());
//   }

//   if (!isLast) {
//     agregarPagina(Number(paginaActual) + 1, ">>")
//   }
// }
}

const mapearProductoJsonAString=(producto)=>{
  return JSON.stringify({
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: producto.precio,
    cantidad: producto.cantidad,
    categoriaId: producto.categoriaId

  })
}

export const guardarProducto = async (producto) => {
  const options = {
    method: 'POST',
    headers,
    body:mapearProductoJsonAString(producto)
  }
   await customFetch(URL_PRODUCTOS, options);
}

export const editarProducto = async (id, producto) => {
  const url = `${URL_PRODUCTOS}/${id}`;
  const options = {
    method: 'PUT',
    headers,
    body: mapearProductoJsonAString(producto)
  }
  await customFetch(url, options);
}

const eliminarProductoId = async (id) => {
  const url = `${URL_PRODUCTOS}/${id}`;
  const options = {
    method: 'DELETE',
    headers
  }
  await customFetch(url, options);
}

const cargarValoresProductoModal = (producto) => {
  let valoresModal = {
    "nombre": producto.nombre,
    "descripcion": producto.descripcion,
    "cantidad": producto.cantidad,
    "precio": producto.precio,
    "categoriaId": 1
  }
  return valoresModal;
}

const crearFilaProducto = (producto) => {
  //creo un elemento tr para la fila
  const fila = document.createElement("tr");

  //lleno contenido de la fila con valores del objeto producto
  for (const llave in producto) {
    const td = document.createElement("td");
    td.textContent = producto[llave];
    fila.appendChild(td);
  }

  //creo columnas donde estaran boton(editar y eliminar)
  const tdOperacion = document.createElement("td");

  //creacion de botones eliminar y editar
  const btnEliminar = document.createElement("button");
  const btnEditar = document.createElement("button");

  //agrego una clase a los botones editar y eliminar para darle estilos
  btnEliminar.classList.add("btn-eliminar");
  btnEditar.classList.add("btn-editar");

  //le asigno al data atributte del boton un id para guardar el id del producto y despues usar ese id
  //para operaciones de actualizacion y eliminacion
  btnEliminar.dataset.id = producto.id
  btnEditar.id = "btn-editar-producto";


  //meto los elementos botones al elemento columna que contendra las operaciones
  tdOperacion.appendChild(btnEditar).textContent = "Editar";
  tdOperacion.appendChild(btnEliminar).textContent = "Eliminar";

  //le asigno un evento al boton editar para posterior menten abrir un modal con los valores
  //que contiene la fila
  btnEditar.addEventListener("click", () => {

    //al boton guardar dentro del modal a su data atributte le doy el valor del id para
    //usarlo para actualizar el elemento
    document.querySelector(".btn-guardar").dataset.id = producto.id;

    //obtengo valores del producto para cargarlos al momento de abrir el modal
    let valoresImput = cargarValoresProductoModal(producto);
    //modal para la editacion
    modalProducto(true, valoresImput, "PUT")
  });
  fila.appendChild(tdOperacion);

  return fila;
}

const filaDefaultSiNoExistenProductos = ()=>{
  const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.setAttribute("colspan", "7");
    td.style.textAlign = 'center';
    td.textContent = "informacion no disponible";
    tr.appendChild(td);
    tabla.appendChild(tr);
    btnBuscar.classList.add("btn-disable");
    btnCrearProducto.classList.add("btn-disable");
}

const isNetworkError = (error)=>{

  if(error instanceof TypeError && error.message === 'NetworkError when attempting to fetch resource.'
  ||error instanceof TypeError && error.message === 'Failed to fetch'){
    return true;
  }
    return false

}

const productoContentIsEmpty = ()=>{
  crearModalInfo("producto no encontrado",document.querySelector("main"),1500);
  divPaginacion.textContent = "";
}


const crearTablaProductos = async (urlProductosBusqueda, numPage) => {
  let url = urlProductosBusqueda || URL_PRODUCTOS;
  url = (numPage != null)?`${url}?page=${numPage}`:url;


  const productosResponse = await obtenerProductos(url);

  if(isNetworkError(productosResponse))filaDefaultSiNoExistenProductos();
  else{
    if(productosResponse.empty)productoContentIsEmpty();
    else{
      let {number,totalPages,first,last} = productosResponse;
      productosResponse.content.forEach(producto => {
      const fila = crearFilaProducto(producto);
      fragmento.appendChild(fila);
      fragmento.cloneNode(true);
    })
    tabla.appendChild(fragmento);
    //generar paginacion correspondiente
    generarPaginacionProductos(number, totalPages, first, last, divPaginacion, tabla, URL_PRODUCTOS, crearTablaProductos);
    //habilita botones si existe contenido para interactuar
    btnBuscar.classList.remove("btn-disable");
    btnCrearProducto.classList.remove("btn-disable");
  }
  }

}
const obtenerProductos = async (url) => {
  const options = {headers}
  const productos = await customFetch(url, options);
  return productos;
}


//delegar eventos al padre del contenido
sectionTabla.addEventListener("click", async (e) => {
  e.preventDefault();
  if (e.target.matches(".btn-eliminar")) {
    let idProducto = e.target.dataset.id;
    await eliminarProductoId(idProducto);
    location.reload(true);
  }
  if (e.target.matches(".btn-crear-producto")) {
    modalProducto(false, {}, "POST");
  }
  if (e.target.matches("#buscar")) {
    let urlBuscar = `${URL_PRODUCTOS}/search?query=${inputSearch.value}`;
    tabla.innerHTML = '';
    crearTablaProductos(urlBuscar);
  }

})

//crear tabla a la carga de la pagina
document.addEventListener("DOMContentLoaded", () => {
  crearTablaProductos();
});
