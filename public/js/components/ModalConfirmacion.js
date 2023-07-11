export const crearModalConfirmacion = (mensaje, seccionPrincipal) => {
    const body = document.querySelector("body");

    const modalContainer = document.createElement('div');
    const headerModal = document.createElement('h1');
    const bodyModal = document.createElement('p');
    const divBtnConfirmacion = document.createElement('div')
    const btnAceptar = document.createElement('button');
    const btnCancelar = document.createElement('button');

    let confirmacion = false;
    headerModal.textContent = "Confirmar";
    bodyModal.textContent = mensaje;

    headerModal.classList.add("modal-confirmacion-header")
    bodyModal.classList.add("modal-info-body");

    btnAceptar.textContent = "aceptar";
    btnCancelar.textContent = "cancelar";

    btnAceptar.classList.add("btn-confirmar");
    btnCancelar.classList.add("btn-cancelar");
    btnAceptar.classList.add("btn-confirmar");
    btnCancelar.classList.add("btn-cancelar");

    modalContainer.appendChild(headerModal);
    modalContainer.appendChild(bodyModal);   

    modalContainer.classList.add("modal-info-container");

    const divFondoModal = document.createElement("div");
    divFondoModal.classList.add("fondo-modal");

    body.style.position = "relative";
    seccionPrincipal.appendChild(divFondoModal);
    seccionPrincipal.appendChild(modalContainer);

    btnAceptar.addEventListener("click", e => {
        body.style.position = "";
        seccionPrincipal.removeChild(modalContainer);
        seccionPrincipal.removeChild(divFondoModal);
        confirmacion = true;
    });
    btnCancelar.addEventListener("click", e => {
        body.style.position = "";
        seccionPrincipal.removeChild(modalContainer);
        seccionPrincipal.removeChild(divFondoModal);
        confirmacion = false;
    });


    divBtnConfirmacion.appendChild(btnAceptar);
    divBtnConfirmacion.appendChild(btnCancelar);

    modalContainer.appendChild(divBtnConfirmacion);

    return confirmacion;
}