export const crearModalInfo=(mensaje,seccionPrincipal,duracion)=>{
    const body = document.querySelector("body");

    const modalContainer = document.createElement("div");
    const headerModal = document.createElement('h2');
    const bodyModal = document.createElement('p');

    headerModal.textContent = "Error";
    bodyModal.textContent=mensaje;

    headerModal.classList.add("modal-info-header")
    bodyModal.classList.add("modal-info-body");

    modalContainer.appendChild(headerModal);
    modalContainer.appendChild(bodyModal);
    modalContainer.classList.add("modal-info-container");

    const divFondoModal = document.createElement("div");
    divFondoModal.classList.add("fondo-modal");


    body.style.position = "relative";
    seccionPrincipal.appendChild(divFondoModal);
    seccionPrincipal.appendChild(modalContainer);
    setTimeout(()=>{
        body.style.position="";
        seccionPrincipal.removeChild(modalContainer);
        seccionPrincipal.removeChild(divFondoModal);
    },duracion)
    
}