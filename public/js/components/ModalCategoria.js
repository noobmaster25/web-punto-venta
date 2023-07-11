import {editarCategoria, guardar} from "../categorias.js";
const modal = (existenValores, valores, operacionHttp) => {

    const modal = document.querySelector(".modal");
    // Asignar los valores actuales de la categoría al formulario dentro del modal
    const nombreInput = document.getElementById("nombre");
    const descripcionInput = document.getElementById("descripcion");
    
    if (existenValores == false) {
        nombreInput.value = "";
        descripcionInput.value = "";
    } else {
        nombreInput.value = valores.nombre;
        descripcionInput.value = valores.descripcion;
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
        if (event.target === modal) {
            modal.style.display = "none";
        }
        if (event.target.matches(".btn-guardar")) {
            let categoria = {
                "nombre": nombreInput.value,
                "descripcion": descripcionInput.value
            }
            if (operacionHttp == "POST") {
                await guardar(categoria);
            }
            if (operacionHttp == "PUT") {
                let id = event.target.dataset.id;
                await editarCategoria(id,categoria);
            }
            location.reload(true);
        }
    });
}
export default modal;