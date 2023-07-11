

const cambiarPagina = (numPagina, tabla, urlPeticion, callbackCrearTabla) => {
    tabla.innerHTML = '';
    let url = `${urlPeticion}?page=${numPagina}`;
    callbackCrearTabla(url);
}
const agregarPagina = (pagina, textoPagina, isActive, divPaginacion,tabla,urlPeticion,callbackCrearTabla) => {

    const btnPagina = document.createElement("button");
    btnPagina.textContent = textoPagina;
    btnPagina.addEventListener("click", (e) => {
        cambiarPagina(pagina,tabla,urlPeticion,callbackCrearTabla);
    });
    if (isActive) btnPagina.classList.add("active")
    divPaginacion.appendChild(btnPagina);
}

export const generarPaginacion = (infoPage, renderPaginacion, accion) => {

    let {paginaActual, totalPages, isFirst, isLast} = infoPage;
    let {divPaginacion, tabla} = renderPaginacion;
    let {urlPeticion,callbackCrearTabla}=accion;

    divPaginacion.innerHTML = '';


    //pagina inicio y fin pagina son como positiones de las paginas que quiero renderizar
    let paginaInicio = Math.max(1, paginaActual - 2);
    let finPagina = Math.min(totalPages, paginaInicio + 3);


    if (!isFirst) {
        agregarPagina(paginaActual - 1, "<<", false, divPaginacion,tabla,urlPeticion,callbackCrearTabla);
    }


    for (let index = paginaInicio; index <= finPagina; index++) {
        if (index == paginaActual + 1) {
            agregarPagina(index - 1, index.toString(), true,divPaginacion,tabla,urlPeticion,callbackCrearTabla);
            continue;
        }
        agregarPagina(index - 1, index.toString(), false, divPaginacion,tabla,urlPeticion,callbackCrearTabla);
    }
    if (totalPages > 4 && finPagina < totalPages && finPagina != totalPages - 1) {
        const p = document.createElement("p")
        p.textContent = "....";
        divPaginacion.appendChild(p);
        agregarPagina(totalPages-1, totalPages.toString(), false, divPaginacion,tabla,urlPeticion,callbackCrearTabla);
    }

    if (!isLast) {
        agregarPagina(Number(paginaActual) + 1, ">>", false, divPaginacion,tabla,urlPeticion,callbackCrearTabla)
    }
}


