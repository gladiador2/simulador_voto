document.addEventListener("DOMContentLoaded", inicializacion);

window.addEventListener("pageshow", function() {
    var header = document.querySelector("#contenedor-ayuda > header");
    if (header) {
        header.style.removeProperty("display");
        header.style.removeProperty("visibility");
        header.style.removeProperty("height");
    }
    // Reset de scroll diferido para neutralizar el auto-scroll del browser a la ancla
    setTimeout(function() {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, 0);
});

//SETTINGS
var saltar_unica = true;

function bindUbicacionClick(items, handler) {
    Array.from(items).forEach(function(item) {
        item.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
        item.addEventListener('click', function(e) {
            handler.call(this, e);
            this.blur();
        });
    });
}

function inicializacion() {
    window.addEventListener("load", actualizar_estado);

    window.addEventListener("hashchange", actualizar_estado);

    function actualizar_estado() {
        //se ocultan todos los elementos "paso"
        resetear_divs();
        let element_id =
            window.location.hash.split("#").filter(Boolean)[0] || null;
        if (!element_id) {
            inicio_demo();
        } else if (element_id === 'ubicaciones') {
            // Ubicacion fija: se salta la pantalla de seleccion de
            // departamento/ciudad y se va directo a Caazapa - San Juan Nepomuceno.
            ir_a_ubicacion_fija();
        } else {
            const selected = document.getElementById(element_id);
            selected.style.display = "";
            setTimeout(function() {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            }, 0);
        }
    }

    const element = document.querySelectorAll(".paso button.next");
    Array.from(element).forEach(function (item) {
        item.addEventListener("click", mostrar_siguiente_paso);
    });

    const buttonPrev = document.querySelectorAll("button.prev");
    Array.from(buttonPrev).forEach(function (item) {
        item.addEventListener("click", volver_demo);
    });

    bindUbicacionClick(document.querySelectorAll("[data-tipo=eleccion]"),     mostrar_departamentos);
    bindUbicacionClick(document.querySelectorAll("[data-tipo=departamento]"), mostrar_distritos);
    bindUbicacionClick(document.querySelectorAll("[data-tipo=distrito]"),     mostrar_mesas);
    bindUbicacionClick(document.querySelectorAll("[data-tipo=mesa]"),         mostrar_demo_ubicacion);

    document.getElementById("paso-5").addEventListener("click", mostrar_final);

    document.getElementById("reset").addEventListener("click", inicio_demo);
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (event) => {
        console.log("Mensaje recibido en el cliente", event.data);
        if (event.data.command === "IMAGENES_CACHEADAS") {
            document.location = "/";
        } else if (event.data.command === "ERROR_CACHEANDO_IMAGENES") {
            habilitar_boton_comenzar(true);
            habilitar_boton_cargando(false);
        }
    });
}

function habilitar_boton_comenzar(habilitar) {
    document.querySelector("#btn-continuar").style.display = habilitar
        ? "inline"
        : "none";
}

function habilitar_boton_cargando(habilitar) {
    document.querySelector("#btn-continuar-loading").style.display = habilitar
        ? "inline"
        : "none";
}

function cambiar_url(paso) {
    //setear url con el valor 'paso' que se le pasa a la funcion
    let url = window.location.href.split("#")[0];
    window.location.href = url + "#" + paso;
}

function empezar_demo() {
    // Se omiten los pasos 1 y 2 (instrucciones de cédula/boletín) y se va
    // directo a la votación.
    document
        .getElementById("empezar")
        .removeEventListener("click", empezar_demo);
    ir_a_ubicacion_fija();
}

function mostrar_siguiente_paso(event) {
    event.stopPropagation();
    const next = event.target.parentElement.nextElementSibling;
    if (next.getAttribute("id") != "undefined") {
        cambiar_url(next.getAttribute("id"));
    }
}


function mostrar_nivel(ubicaciones_a_ocultar, id_nivel_a_mostrar){
    
    let a_ocultar = document.getElementsByClassName(`elegir_${ubicaciones_a_ocultar}`);
    Array.from(a_ocultar).forEach(function (item) {
        item.style.display = 'none';
    });

    const elementos_a_mostrar = document.querySelector(`[data-${ubicaciones_a_ocultar}="${id_nivel_a_mostrar}"]`);
    if (!elementos_a_mostrar) {
        return;
    }
    if (elementos_a_mostrar.children.length === 1 && saltar_unica && ubicaciones_a_ocultar=='distrito')        
        elementos_a_mostrar.children[0].click(); 
    else elementos_a_mostrar.style.display = 'flex';
}

function mostrar_departamentos(event) {
    event.stopPropagation();
    document.getElementById('nivel-a-elegir').innerText = "el Departamento";
    const id_nivel = event.currentTarget.dataset.id;
    mostrar_nivel('eleccion', id_nivel);
}

function mostrar_distritos(event) {
    event.stopPropagation();
    document.getElementById('nivel-a-elegir').innerText = "el Distrito";
    const id_nivel = event.currentTarget.dataset.id;
    mostrar_nivel('departamento', id_nivel);
}

function mostrar_mesas(event) {
    event.stopPropagation();
    document.getElementById('nivel-a-elegir').innerText = "la Zona";
    const id_nivel = event.currentTarget.dataset.id;
    mostrar_nivel('distrito', id_nivel);
}


var UBICACION_FIJA = "59.6.13";
var TITULO_UBICACION_FIJA =
    "ELECCIONES MUNICIPALES / 6-CAAZAPA / 13-SAN JUAN NEPOMUCENO / 0-San Juan Nepomuceno";

function ir_a_ubicacion_fija() {
    window.localStorage.setItem("ubicacion", UBICACION_FIJA);
    window.localStorage.setItem("titulo-ubicacion", TITULO_UBICACION_FIJA);
    window.location = "sufragio.html?ubicacion=" + UBICACION_FIJA;
}

function volver_demo() {
    var ubicacion = window.localStorage.getItem("ubicacion");
    if (ubicacion && ubicacion != "null") {
        window.location = "sufragio.html?ubicacion=" + ubicacion;
    } else {
        ir_a_ubicacion_fija();
    }
}

function mostrar_demo_ubicacion(event) {
    event.stopPropagation();
    resetear_divs();
    const ubicacion = event.currentTarget.dataset.id;
    const titulo_ubicacion = event.currentTarget.getAttribute("titulo-ubicacion");
    window.localStorage.setItem("ubicacion", ubicacion);
    window.localStorage.setItem("titulo-ubicacion", titulo_ubicacion);
    window.location = "sufragio.html?ubicacion=" + ubicacion;
}

function mostrar_final() {
    const TagBody = document.getElementsByTagName("body");
    Array.from(TagBody).forEach(function (item) {
        item.setAttribute("id", "final");
    });
    cambiar_url("agradecimiento");
    // const IdAgrad = document.getElementById("agradecimiento");
    // IdAgrad.addEventListener("load", function(event){});
}

function inicio_demo() {
    cambiar_url("");
    const TagBody = document.getElementsByTagName("body");
    Array.from(TagBody).forEach(function (item) {
        item.setAttribute("id", "final");
    });
    const bienvenido = document.getElementById("bienvenido");
    bienvenido.style.display = "";
    const empezar = document.getElementById("empezar");
    empezar.style.display = "";
    document.getElementById("empezar").addEventListener("click", empezar_demo);
}

function resetear_divs() {
    const contenedorAyuda = document.querySelectorAll(
        "#contenedor-ayuda > div"
    );
    Array.from(contenedorAyuda).forEach(function (item) {
        item.style.display = "none";
    });
    const franja = document.querySelectorAll(".franja");
    Array.from(franja).forEach(function (item) {
        item.style.display = "none";
    });
    const header = document.querySelector("#contenedor-ayuda > header");
    if (header) {
        header.style.display = "";
    }
}
