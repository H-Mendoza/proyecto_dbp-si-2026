// ==========================================
// materias.js - Página para agregar y quitar materias
// ==========================================

verificarUsuario();
mostrarSaludo();

const formMateria = document.getElementById("form-materia");
const inputMateria = document.getElementById("materia");
const listaMaterias = document.getElementById("lista-materias");
const sinMaterias = document.getElementById("sin-materias");
const mensajeOk = document.getElementById("mensaje-ok");

// Las materias se guardan como una lista de textos
let materias = leerDatos("materias", []);

// Revisa el nombre de la materia. Devuelve el error o "" si está bien
function validarMateria(valor) {
  if (valor === "") {
    return "Escribe el nombre de la materia.";
  }
  if (valor.length < 3) {
    return "El nombre debe tener al menos 3 caracteres.";
  }
  if (valor.length > 40) {
    return "El nombre no puede tener más de 40 caracteres.";
  }
  // Revisa que no esté repetida (sin importar mayúsculas)
  const repetida = materias.some(function (m) {
    return m.toLowerCase() === valor.toLowerCase();
  });
  if (repetida) {
    return "Esa materia ya está en tu lista.";
  }
  return "";
}

// Dibuja la lista de materias en la página (modifica el DOM)
function dibujarMaterias() {
  listaMaterias.innerHTML = "";
  sinMaterias.hidden = materias.length > 0;

  materias.forEach(function (materia, posicion) {
    const item = document.createElement("li");

    const nombre = document.createElement("span");
    nombre.textContent = materia;

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "boton boton-peligro";
    boton.textContent = "Eliminar";
    boton.setAttribute("aria-label", "Eliminar la materia " + materia);
    boton.addEventListener("click", function () {
      eliminarMateria(posicion);
    });

    item.appendChild(nombre);
    item.appendChild(boton);
    listaMaterias.appendChild(item);
  });
}

// Elimina una materia y también sus pendientes
function eliminarMateria(posicion) {
  const nombre = materias[posicion];
  if (confirm("¿Eliminar " + nombre + "? También se borrarán sus pendientes.")) {
    materias.splice(posicion, 1);
    guardarDatos("materias", materias);

    const pendientes = leerDatos("pendientes", []);
    const restantes = pendientes.filter(function (p) {
      return p.materia !== nombre;
    });
    guardarDatos("pendientes", restantes);

    mensajeOk.textContent = "Materia eliminada.";
    dibujarMaterias();
  }
}

// Evento: enviar el formulario
formMateria.addEventListener("submit", function (evento) {
  evento.preventDefault();
  mensajeOk.textContent = "";

  const valor = inputMateria.value.trim();
  const error = validarMateria(valor);

  limpiarError("materia");

  if (error !== "") {
    mostrarError("materia", error);
    inputMateria.focus();
    return;
  }

  materias.push(valor);
  guardarDatos("materias", materias);
  dibujarMaterias();

  inputMateria.value = "";
  mensajeOk.textContent = "Materia agregada: " + valor + ".";
  inputMateria.focus();
});

// Evento: al escribir se borra el error
inputMateria.addEventListener("input", function () {
  limpiarError("materia");
});

dibujarMaterias();
