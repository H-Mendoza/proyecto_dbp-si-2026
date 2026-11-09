// ==========================================
// agenda.js - Calendario y lista de pendientes
// ==========================================

verificarUsuario();
mostrarSaludo();

const formPendiente = document.getElementById("form-pendiente");
const selectMateria = document.getElementById("materia-pendiente");
const inputDescripcion = document.getElementById("descripcion");
const inputFecha = document.getElementById("fecha");
const avisoSinMaterias = document.getElementById("aviso-sin-materias");
const listaPendientes = document.getElementById("lista-pendientes");
const sinPendientes = document.getElementById("sin-pendientes");
const resumen = document.getElementById("resumen");
const nombreMes = document.getElementById("nombre-mes");
const cuerpoCalendario = document.getElementById("cuerpo-calendario");
const botonAnterior = document.getElementById("mes-anterior");
const botonSiguiente = document.getElementById("mes-siguiente");

const materias = leerDatos("materias", []);
let pendientes = leerDatos("pendientes", []);

const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// Mes y año que se muestran en el calendario (empieza en el mes actual)
let mesActual = new Date().getMonth();
let anioActual = new Date().getFullYear();

// ---------- Funciones de apoyo ----------

// Convierte "2026-11-15" en "15/11/2026"
function formatearFecha(texto) {
  const partes = texto.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

// Arma el texto AAAA-MM-DD de un día del mes que se está mostrando
function armarFecha(dia) {
  const mes = String(mesActual + 1).padStart(2, "0");
  const diaTexto = String(dia).padStart(2, "0");
  return anioActual + "-" + mes + "-" + diaTexto;
}

// Cuenta cuántos pendientes sin terminar hay en una fecha
function contarPendientes(fecha) {
  return pendientes.filter(function (p) {
    return p.fecha === fecha && !p.hecho;
  }).length;
}

// Llena el selector con las materias registradas
function llenarMaterias() {
  selectMateria.innerHTML = "";

  const opcionInicial = document.createElement("option");
  opcionInicial.value = "";
  opcionInicial.textContent = "Selecciona una materia";
  selectMateria.appendChild(opcionInicial);

  materias.forEach(function (materia) {
    const opcion = document.createElement("option");
    opcion.value = materia;
    opcion.textContent = materia;
    selectMateria.appendChild(opcion);
  });

  // Si no hay materias se oculta el formulario y se muestra un aviso
  formPendiente.hidden = materias.length === 0;
  avisoSinMaterias.hidden = materias.length > 0;
}

// ---------- Validación del formulario ----------

function validarPendiente(materia, descripcion, fecha) {
  let hayErrores = false;

  limpiarError("materia-pendiente");
  limpiarError("descripcion");
  limpiarError("fecha");

  if (materia === "") {
    mostrarError("materia-pendiente", "Selecciona una materia.");
    hayErrores = true;
  }

  if (descripcion === "") {
    mostrarError("descripcion", "Escribe qué tienes que hacer.");
    hayErrores = true;
  } else if (descripcion.length < 3) {
    mostrarError("descripcion", "La descripción debe tener al menos 3 caracteres.");
    hayErrores = true;
  } else if (descripcion.length > 80) {
    mostrarError("descripcion", "La descripción no puede tener más de 80 caracteres.");
    hayErrores = true;
  }

  if (fecha === "") {
    mostrarError("fecha", "Elige la fecha de entrega.");
    hayErrores = true;
  } else if (fecha < fechaHoy()) {
    mostrarError("fecha", "La fecha no puede ser anterior a hoy.");
    hayErrores = true;
  }

  return !hayErrores;
}

// ---------- Dibujar la lista (modifica el DOM) ----------

function dibujarLista() {
  listaPendientes.innerHTML = "";
  sinPendientes.hidden = pendientes.length > 0;

  // Se ordenan de la fecha más cercana a la más lejana
  const ordenados = pendientes.slice().sort(function (a, b) {
    return a.fecha.localeCompare(b.fecha);
  });

  ordenados.forEach(function (pendiente) {
    const item = document.createElement("li");

    const etiqueta = document.createElement("label");
    const casilla = document.createElement("input");
    casilla.type = "checkbox";
    casilla.checked = pendiente.hecho;

    const texto = document.createElement("span");
    texto.textContent = pendiente.materia + ": " + pendiente.descripcion +
      " (entrega " + formatearFecha(pendiente.fecha) + ")";
    if (pendiente.hecho) {
      texto.className = "hecho";
    }

    etiqueta.appendChild(casilla);
    etiqueta.appendChild(texto);

    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "boton boton-peligro";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.setAttribute("aria-label", "Eliminar el pendiente " + pendiente.descripcion);

    // Evento: marcar o desmarcar como hecho
    casilla.addEventListener("change", function () {
      pendiente.hecho = casilla.checked;
      guardarDatos("pendientes", pendientes);
      actualizarTodo();
    });

    // Evento: eliminar el pendiente
    botonEliminar.addEventListener("click", function () {
      pendientes = pendientes.filter(function (p) {
        return p.id !== pendiente.id;
      });
      guardarDatos("pendientes", pendientes);
      actualizarTodo();
    });

    item.appendChild(etiqueta);
    item.appendChild(botonEliminar);
    listaPendientes.appendChild(item);
  });
}

// ---------- Dibujar el calendario (modifica el DOM) ----------

function dibujarCalendario() {
  nombreMes.textContent = nombresMeses[mesActual] + " " + anioActual;
  cuerpoCalendario.innerHTML = "";

  // getDay() devuelve 0 para domingo; se ajusta para que la semana empiece en lunes
  const primerDia = new Date(anioActual, mesActual, 1).getDay();
  const espaciosVacios = (primerDia + 6) % 7;
  const diasDelMes = new Date(anioActual, mesActual + 1, 0).getDate();

  let dia = 1;

  // Máximo 6 filas (semanas) por mes
  for (let fila = 0; fila < 6; fila++) {
    if (dia > diasDelMes) {
      break;
    }

    const tr = document.createElement("tr");

    for (let columna = 0; columna < 7; columna++) {
      const td = document.createElement("td");

      if ((fila === 0 && columna < espaciosVacios) || dia > diasDelMes) {
        td.className = "vacio";
      } else {
        const fecha = armarFecha(dia);
        const cantidad = contarPendientes(fecha);

        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "dia";
        boton.textContent = dia;

        // Texto completo para lectores de pantalla
        let descripcion = dia + " de " + nombresMeses[mesActual];
        if (cantidad > 0) {
          descripcion += ", " + cantidad + " pendientes";
        }
        boton.setAttribute("aria-label", descripcion);

        if (cantidad > 0) {
          const marca = document.createElement("span");
          marca.className = "cantidad";
          marca.textContent = cantidad;
          boton.appendChild(marca);
        }

        if (fecha === fechaHoy()) {
          td.className = "hoy";
          boton.setAttribute("aria-current", "date");
        }

        // Evento: al pulsar un día se pone esa fecha en el formulario
        boton.addEventListener("click", function () {
          inputFecha.value = fecha;
          limpiarError("fecha");
          if (!formPendiente.hidden) {
            inputFecha.focus();
          }
        });

        td.appendChild(boton);
        dia++;
      }

      tr.appendChild(td);
    }

    cuerpoCalendario.appendChild(tr);
  }
}

// Texto de resumen con los pendientes sin terminar
function dibujarResumen() {
  const sinTerminar = pendientes.filter(function (p) {
    return !p.hecho;
  }).length;

  if (sinTerminar === 0) {
    resumen.textContent = "No tienes pendientes sin terminar.";
  } else if (sinTerminar === 1) {
    resumen.textContent = "Tienes 1 pendiente sin terminar.";
  } else {
    resumen.textContent = "Tienes " + sinTerminar + " pendientes sin terminar.";
  }
}

function actualizarTodo() {
  dibujarLista();
  dibujarCalendario();
  dibujarResumen();
}

// ---------- Eventos ----------

// Enviar el formulario de nuevo pendiente
formPendiente.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const materia = selectMateria.value;
  const descripcion = inputDescripcion.value.trim();
  const fecha = inputFecha.value;

  if (!validarPendiente(materia, descripcion, fecha)) {
    // El cursor va al primer campo con error
    const primerError = formPendiente.querySelector("[aria-invalid='true']");
    if (primerError !== null) {
      primerError.focus();
    }
    return;
  }

  pendientes.push({
    id: Date.now(),
    materia: materia,
    descripcion: descripcion,
    fecha: fecha,
    hecho: false
  });
  guardarDatos("pendientes", pendientes);

  formPendiente.reset();
  actualizarTodo();
  inputDescripcion.focus();
});

// Botones para cambiar de mes
botonAnterior.addEventListener("click", function () {
  mesActual--;
  if (mesActual < 0) {
    mesActual = 11;
    anioActual--;
  }
  dibujarCalendario();
});

botonSiguiente.addEventListener("click", function () {
  mesActual++;
  if (mesActual > 11) {
    mesActual = 0;
    anioActual++;
  }
  dibujarCalendario();
});

// Quitar errores al escribir o cambiar un campo
selectMateria.addEventListener("change", function () {
  limpiarError("materia-pendiente");
});
inputDescripcion.addEventListener("input", function () {
  limpiarError("descripcion");
});
inputFecha.addEventListener("change", function () {
  limpiarError("fecha");
});

// ---------- Inicio ----------
llenarMaterias();
actualizarTodo();
