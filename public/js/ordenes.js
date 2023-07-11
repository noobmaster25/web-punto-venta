
import {crearModalInfo} from "./components/ModalInfo.js";
import customFetch from "./utileria/customFetch.js";

const btnAgregarProducto = document.getElementById("agregar");
const fragmentoClientes = document.createDocumentFragment();
const opcionesClinetes = document.querySelector(".opciones-clientes");
const tbody = document.querySelector("tbody");
const productoImput = document.getElementById("search");
const totalCompra = document.getElementById("contenido-compra");
const tabla = document.getElementById("contenido-orden");
const btnEliminarOrdenCompleta = document.getElementById("btn-eliminar-orden")
const btnTerminarOrden = document.getElementById("btn-terminar-orden");

const URL_BASE_ORDEN = "http://localhost:8080/punto-venta-api/v0/ordenes";
const URL_BASE_CLIENTES = "http://localhost:8080/punto-venta-api/v0/clientes";
const URL_BASE_PRODUCTOS = "http://localhost:8080/punto-venta-api/v0/productos";


const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
};

//simulando tener un estado global
let productos = [];

const isNetworkError = (error) => {
    if(error instanceof TypeError && error.message === 'NetworkError when attempting to fetch resource.'
  ||error instanceof TypeError && error.message === 'Failed to fetch'){
    return true;
  }
    return false
  }
const crearElementoOptionCliente = (cliente)=>{
    const opcion = document.createElement("option");
    opcion.value = cliente.id;
    opcion.textContent = cliente.nombre;
    return opcion;
}
const contenidoDefaultPorInformacionNoDisponible = ()=>{
    const opcion = document.createElement("option");
    opcion.textContent = "sin info";
    opcionesClinetes.appendChild(opcion);
    btnAgregarProducto.classList.add("btn-disable");
    btnEliminarOrdenCompleta.classList.add("btn-disable");
    btnTerminarOrden.classList.add("btn-disable");
}
const obtenerListadoDeClientesActuales = async () => {
    const options = {headers}
    let responseClientes = await customFetch(URL_BASE_CLIENTES, options);
    if(!isNetworkError(responseClientes)){
        responseClientes.content.forEach(cliente => {
            fragmentoClientes.appendChild(crearElementoOptionCliente(cliente));
            fragmentoClientes.cloneNode(true);
        })
        opcionesClinetes.appendChild(fragmentoClientes);

        btnAgregarProducto.classList.remove("btn-disable");
        btnEliminarOrdenCompleta.classList.remove("btn-disable");
        btnTerminarOrden.classList.remove("btn-disable");
    }else{
       contenidoDefaultPorInformacionNoDisponible();
    }

}

const actualizarFilaExistente = (id)=>{
    const filaProductoExistente = tabla.querySelector(`tr#id${id}`);
        const inputCantidad = filaProductoExistente.querySelector('input[type=number]');
        const celdadPrecioProducto = filaProductoExistente.querySelectorAll('td')[2];
        const celdaPrecioTotal = filaProductoExistente.querySelector('td[data-id="total"]');

        inputCantidad.value = Number(inputCantidad.value) + 1;
        let precio = inputCantidad.value * Number((celdadPrecioProducto.textContent));
        precio = precio.toFixed(2)
        celdaPrecioTotal.textContent = "$ " + precio;
        filaProductoExistente.dataset.total = precio;
}

const crearFilasProducto = (producto, isPresent, id) => {
    if (!isPresent) {
        //celdas en la fila con valores de id, nombre, precio
        const fila = document.createElement("tr");
        const tdId = document.createElement("td");
        tdId.textContent = producto.id;
        const tdNombre = document.createElement("td");
        tdNombre.textContent = producto.nombre;
        const tdPrecio = document.createElement("td");
        tdPrecio.textContent = producto.precio;

        fila.appendChild(tdId);
        fila.appendChild(tdNombre);
        fila.appendChild(tdPrecio);


        //creando input de cantidad de articulos
        const imputCantidad = document.createElement("input");
        imputCantidad.type = "Number";
        imputCantidad.value = 1;

        //creando celda del total
        const tdTotal = document.createElement("td");
        let totalDefaul = 1 * Number(tdPrecio.textContent);
        totalDefaul = totalDefaul.toFixed(2)
        fila.dataset.total = totalDefaul;
        tdTotal.textContent = "$ " + totalDefaul;

        tdTotal.dataset.id = "total";
        imputCantidad.setAttribute("min", "0");


        //evento para cuando cambie el input de la cantidad se actualice el precio total
        imputCantidad.addEventListener("change", e => {
            let precio = Number(e.target.value * tdPrecio.textContent);
            tdTotal.textContent = "$ " + precio;
            fila.dataset.total = precio;
        })

        //insertando a la fila el input de cantidad con el evento y celda de total
        fila.appendChild(imputCantidad);
        fila.appendChild(tdTotal);

        //creando una cenda con un button para poder eliminar el producto
        const tdOperacion = document.createElement("td");
        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add("btn-eliminar");
        btnEliminar.dataset.id = producto.id_producto;

        tdOperacion.appendChild(btnEliminar).textContent = "Eliminar";
        fila.appendChild(tdOperacion);

        fila.id = 'id' + producto.id;
        return fila;

    } else {
        actualizarFilaExistente(id)
    }


}
const existeProductoEnOrden = (producto) => {
    if (productos.length == 0) return false;
    const productoExistente = productos.find(p => p.id == producto.id);
    if (productoExistente != null) return true;
    return false;
}

const actualizarTotal = () => {
    let total = 0;
    const filasProductos = document.querySelectorAll("tbody tr");
    filasProductos.forEach(producto => {
        total += Number(producto.dataset.total);
    })
    totalCompra.textContent = "$ " + total.toFixed(2);

}
const agregarProductoOrden = async (id) => {
    const options = {headers}
    const response = await fetch(`${URL_BASE_PRODUCTOS}/${id}`, options);
    if (!response.ok)crearModalInfo("producto no existe", document.querySelector("main"), 1000);
    else {
        const producto = await response.json();
        if (!existeProductoEnOrden(producto)) {
            productos.push(producto);
            const fila = crearFilasProducto(producto, false);
            tbody.appendChild(fila);
        } else {
            crearFilasProducto(producto, true, producto.id);
        }
        actualizarTotal();
    }
}

const generarFechaActual = () => {
    const fechaActual = new Date();
    const dia = fechaActual.getDate().toString().padStart(2, '0');
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaActual.getFullYear().toString().padStart(4, '0');
    const hora = fechaActual.getHours().toString().padStart(2, '0');
    const minutos = fechaActual.getMinutes().toString().padStart(2, '0');
    const segundos = fechaActual.getSeconds().toString().padStart(2, '0');

    const fechaFormateada = `${dia}/${mes}/${anio} ${hora}:${minutos}:${segundos}`;
    return fechaFormateada;
}

const obtenerJsonDeTablaOrden = (orden)=>{
    const tds = orden.querySelectorAll("td");
    const imput = orden.querySelector("input");
    let cantidad = Number(imput.value);
    let precio = Number(tds[2].textContent);
    let precioLimpio = (tds[3].textContent).replace("$", "").trim();
    let total = Number(precioLimpio);
    let nombre = tds[1].textContent;
    let productoId = Number(tds[0].textContent);
    const json = {cantidad,precio,total,nombre,productoId}
    return json;
}
const generarDetallesOrden = () => {
    const filasOrden = document.querySelectorAll("tbody tr");
    const jsonOrden = [];
    filasOrden.forEach(orden => {
        obtenerJsonDeTablaOrden(orden);
        jsonOrden.push(json);
    })
    return jsonOrden;

}

const guardarOrden = async (jsonOrden) => {;
    const options = {
        method: 'POST',
        headers,
        body: JSON.stringify(jsonOrden)
    }
    await customFetch(URL_BASE_ORDEN, options);
    setTimeout(() => {
        location.reload();
    }, 500)
}

btnEliminarOrdenCompleta.addEventListener("click", e => {
    tbody.innerHTML = '';
    actualizarTotal();
})

btnTerminarOrden.addEventListener("click", e => {
    let response = confirm("desea realizar operacion?");
    if (response) {
        const numeroAleatorio = Math.round(Math.random() * 1000) + 1;
        let idCliente = opcionesClinetes.value;
        const jsonOrden = {
            "numero": numeroAleatorio,
            "fechaCreacion": generarFechaActual(),
            "fechaRecibida": generarFechaActual(),
            "clienteId": Number(idCliente),
            "detallesOrden": generarDetallesOrden()
        }
         guardarOrden(jsonOrden);
    }

});

tabla.addEventListener("change", e => {
    actualizarTotal();
})
tabla.addEventListener("click", e => {
    if (e.target.matches("button.btn-eliminar")) {
        const fila = e.target.parentNode.parentNode;
        //eliminado elemento fila del dom
        fila.remove();
        const celdaId = fila.querySelectorAll("td")[0].textContent;
        //actualizando arreglo de mis produtos
        const actualizandoProductos = productos.filter(producto => producto.id != celdaId);
        productos = [...actualizandoProductos];
        actualizarTotal();
    }
})

document.getElementById("agregar").addEventListener("click", e => {
    e.preventDefault();
    const idProducto = productoImput.value;
    if (idProducto > 0) agregarProductoOrden(idProducto);
    else crearModalInfo("No se proporciono id del producto", document.querySelector('main'), 1500);
})

document.addEventListener("DOMContentLoaded", obtenerListadoDeClientesActuales);