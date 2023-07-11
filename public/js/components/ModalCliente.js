import {editarCliente,guardarCliente} from "../clientes.js";

const crearModalCliente = async (existenValores, valores, operacionHttp) => {
    const modal = document.querySelector(".modal");
    // Asignar los valores actuales de la categoría al formulario dentro del modal
    const nombreInput = document.getElementById("nombre");
    const telefonoInput = document.getElementById("telefono");
    const tipoInput = document.getElementById("tipo");
    const correoInput = document.getElementById("correo");
    const direccionInput = document.getElementById("direccion");
    
    // const categoriaInput = document.getElementById("categoria");

    if (existenValores == false) {
        nombreInput.value = "";
        telefonoInput.value = "";
        tipoInput.value = "";
        correoInput.value = "";
        direccionInput.value = "";

    } else {
        nombreInput.value = valores.nombre;
        telefonoInput.value = valores.telefono;
        tipoInput.value = valores.tipo;
        correoInput.value = valores.correo;
        direccionInput.value = valores.direccion;
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
            let cliente = {
                "nombre": nombreInput.value,
                "telefono": telefonoInput.value,
                "tipo": tipoInput.value,
                "correo": correoInput.value,
                "direccion":direccionInput.value 
            }
            if (operacionHttp == "POST") {
                  await guardarCliente(cliente);
            }
            if (operacionHttp == "PUT") {
                let id = event.target.dataset.id;
                await editarCliente(id, cliente);
            }
               location.reload(true);
        }
    });
}
export default crearModalCliente;