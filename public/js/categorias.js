import {
    crearModalInfo
} from "./components/ModalInfo.js";
import customFetch from "./utileria/customFetch.js";
import modal from "./components/ModalCategoria.js";
import {
    generarPaginacion
} from "./components/Paginacion.js";

const btnCrearCategoria = document.querySelector(".crear-categoria");
const tabla = document.getElementById("tabla");
const fragmento = document.createDocumentFragment();
const sectionTabla = document.querySelector("section");
const divPaginacion = document.getElementById("pagination");


const URL_BASE = "http://localhost:8080/punto-venta-api/v0/categorias";

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
};

const generarPaginacionCategoria = (paginaActual, totalPages, isFirst, isLast, divPaginacion, tabla, urlPeticion, callbackCrearTabla) => {
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

const mapearCategoriaJsonAString = (categoria) =>{
    return JSON.stringify({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion
    })
}

export const guardar = async (categoria) => {
    const options = {
        method: 'POST',
        headers,
        body:mapearCategoriaJsonAString(categoria)
    }
    await customFetch(URL_BASE, options);
}

export const editarCategoria = async (id, categoria) => {
    const url = `${URL_BASE}/${id}`;
    const options = {
        method: 'PUT',
        headers,
        body: mapearCategoriaJsonAString(categoria)
    }
    await customFetch(url, options);
}

const eliminarCategoriaId = async (id) => {
    const url = `${URL_BASE}/${id}`;
    const options = {
        method: 'DELETE',
        headers
    }
    const response = await customFetch(url, options);

    (response.status = 409)?
    crearModalInfo("No se puede eliminar, Tiene elementos asociados", document.querySelector("main"), 1500)
    :location.reload(true);
}

const creatFilaCategoria = (categoria) => {
    const row = document.createElement("tr");
    for (const llave in categoria) {
        const td = document.createElement("td");
        td.textContent = categoria[llave];
        row.appendChild(td);
    }
    const tdOperacion = document.createElement("td");

    const btnEliminar = document.createElement("button");
    const btnEditar = document.createElement("button");

    btnEliminar.classList.add("btn-eliminar");
    btnEliminar.dataset.id = categoria.id;

    btnEditar.classList.add("btn-editar");
    btnEditar.id = "btn-editar-categoria";

    tdOperacion.appendChild(btnEditar).textContent = "Editar";
    tdOperacion.appendChild(btnEliminar).textContent = "Eliminar";

    //evento con modal para editar categoria
    btnEditar.addEventListener("click", () => {
        document.querySelector(".btn-guardar").dataset.id = categoria.id;
        let valoresImput = {
            "nombre": categoria.nombre,
            "descripcion": categoria.descripcion
        }
        //modal para la editacion
        modal(true, valoresImput, "PUT")
    });
    row.appendChild(tdOperacion);
    return row;
}
const isNetworkError = (error) => {
    if(error instanceof TypeError && error.message === 'NetworkError when attempting to fetch resource.'
    ||error instanceof TypeError && error.message === 'Failed to fetch'){
      return true;
    }
      return false
}

const contenidoDefualtSiNoTieneElementos = ()=>{
    const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute("colspan", "4");
        td.style.textAlign = 'center';
        td.textContent = "sin elementos";
        tr.appendChild(td);
        tabla.appendChild(tr);
        btnCrearCategoria.classList.add("btn-disable");
}

export const llenarTablaCategorias = async (urlNumPage) => {
    let url = urlNumPage || URL_BASE;
    const options = {headers}
    const responseCategoria = await customFetch(url, options);

    if (!isNetworkError(responseCategoria)) {
        responseCategoria.content.forEach(categoria => {
            const row = creatFilaCategoria(categoria);
            fragmento.appendChild(row);
            fragmento.cloneNode(true);
        })
        tabla.appendChild(fragmento);
        let {number,totalPages,first,last} = responseCategoria;
        generarPaginacionCategoria(number, totalPages, first, last, divPaginacion, tabla, URL_BASE, llenarTablaCategorias);

        btnCrearCategoria.classList.remove("btn-disable");
    }else{
        contenidoDefualtSiNoTieneElementos();
    }


}

//delegando eventos a la seccion de la tabla
sectionTabla.addEventListener("click", async (e) => {
    e.preventDefault();
    if (e.target.matches(".btn-eliminar")) {
        let idCategoria = e.target.dataset.id;
        await eliminarCategoriaId(idCategoria);
    }
    if (e.target.matches(".crear-categoria")) {
        modal(false, {}, "POST");
    }
})

document.addEventListener("DOMContentLoaded", () => {
    llenarTablaCategorias();
})