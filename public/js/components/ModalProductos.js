import {
    editarProducto,
    guardarProducto
} from "../Productos.js";


const fragmentoCategoria = document.createDocumentFragment();
const opcionesCategoria = document.getElementById("opciones-categoria");
const urlCategorias = "http://localhost:8080/punto-venta-api/v0/categorias";

const llenarCategoriaInput = async () => {
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
    }
    let responseCategoria = await fetch(urlCategorias,options);
    let categoriaJson = await responseCategoria.json();
    categoriaJson.content.forEach(categoria => {
        const opcion = document.createElement("option");
        opcion.value = categoria.id;
        opcion.textContent = categoria.nombre;
        fragmentoCategoria.appendChild(opcion);
        fragmentoCategoria.cloneNode(true);
    })
    return fragmentoCategoria;
}
const modalProducto = async (existenValores, valores, operacionHttp) => {
    const fragementDeOpciones = await llenarCategoriaInput();
    opcionesCategoria.appendChild(fragementDeOpciones);
    const modal = document.querySelector(".modal");
    // Asignar los valores actuales de la categoría al formulario dentro del modal
    const nombreInput = document.getElementById("nombre");
    const descripcionInput = document.getElementById("descripcion");
    const precioInput = document.getElementById("precio");
    const cantidadInput = document.getElementById("cantidad");
    // const categoriaInput = document.getElementById("categoria");

    if (existenValores == false) {
        nombreInput.value = "";
        descripcionInput.value = "";
        precioInput.value = "";
        cantidadInput.value = "";

    } else {
        nombreInput.value = valores.nombre;
        descripcionInput.value = valores.descripcion;
        precioInput.value = valores.precio;
        cantidadInput.value = valores.cantidad;
    }
    // Abrir el modal
    modal.style.display = "block";
    // Cerrar el modal cuando se haga clic en el botón de "Cancelar"
    const cancelarBtn = document.getElementById("cancelar-btn");
    cancelarBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });
    // Cerrar el modal cuando se haga clic en cualquier parte fuera del contenido del modal
    modal.addEventListener("click", async (event) => {
        event.preventDefault();
        if (event.target === modal) {
            modal.style.display = "none";
        }
        if (event.target.matches(".btn-guardar")) {
            let producto = {
                "nombre": nombreInput.value,
                "descripcion": descripcionInput.value,
                "precio": Number(precioInput.value),
                "cantidad": Number(cantidadInput.value),
                "categoriaId": Number(opcionesCategoria.value)
            }
            if (operacionHttp == "POST") {
                console.log(producto)
                  await guardarProducto(producto);
            }
            if (operacionHttp == "PUT") {
                let id = event.target.dataset.id;
                console.log(producto)
                console.log(id)
                  await editarProducto(id, producto);
            }
               location.reload(true);
        }
    });
}
export default modalProducto;