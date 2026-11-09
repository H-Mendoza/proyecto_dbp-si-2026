// ==========================================
// registro.js - Página de inicio (registro del usuario)
// ==========================================

const formRegistro = document.getElementById("form-registro");
const inputNombre = document.getElementById("nombre");
const inputApellido = document.getElementById("apellido");
const seccionRegistro = document.getElementById("seccion-registro");
const seccionBienvenida = document.getElementById("seccion-bienvenida");
const textoBienvenida = document.getElementById("texto-bienvenida");
const botonBorrar = document.getElementById("boton-borrar");

// Solo letras (con tildes y ñ) y espacios entre palabras
const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+( [A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/;

// Revisa un nombre o apellido. Devuelve el mensaje de error o "" si está bien
function validarTexto(valor, etiqueta) {
  if (valor === "") {
    return "Escribe tu " + etiqueta + ".";
  }
  if (valor.length < 2) {
    return "El " + etiqueta + " debe tener al menos 2 letras.";
  }
  if (!soloLetras.test(valor)) {
    return "El " + etiqueta + " solo puede tener letras.";
  }
  return "";
}

// Decide qué sección se muestra según si ya hay usuario
function mostrarVista() {
  const usuario = obtenerUsuario();
  if (usuario !== null) {
    seccionRegistro.hidden = true;
    seccionBienvenida.hidden = false;
    textoBienvenida.textContent = "Estás registrado como " + usuario.nombre + " " + usuario.apellido + ".";
  } else {
    seccionRegistro.hidden = false;
    seccionBienvenida.hidden = true;
  }
  mostrarSaludo();
}

// Evento: enviar el formulario de registro
formRegistro.addEventListener("submit", function (evento) {
  evento.preventDefault(); // evita que la página se recargue

  const nombre = inputNombre.value.trim();
  const apellido = inputApellido.value.trim();

  const errorNombre = validarTexto(nombre, "nombre");
  const errorApellido = validarTexto(apellido, "apellido");

  // Primero se limpian los errores anteriores
  limpiarError("nombre");
  limpiarError("apellido");

  if (errorNombre !== "") {
    mostrarError("nombre", errorNombre);
  }
  if (errorApellido !== "") {
    mostrarError("apellido", errorApellido);
  }

  // Si hay errores, el cursor va al primer campo con problema
  if (errorNombre !== "") {
    inputNombre.focus();
    return;
  }
  if (errorApellido !== "") {
    inputApellido.focus();
    return;
  }

  // Todo correcto: se guarda el usuario y se pasa a agregar materias
  guardarDatos("usuario", { nombre: nombre, apellido: apellido });
  window.location.href = "materias.html";
});

// Evento: al escribir se borra el error de ese campo
inputNombre.addEventListener("input", function () {
  limpiarError("nombre");
});
inputApellido.addEventListener("input", function () {
  limpiarError("apellido");
});

// Evento: botón para borrar todos los datos guardados
botonBorrar.addEventListener("click", function () {
  if (confirm("¿Seguro que quieres borrar tu usuario, materias y pendientes?")) {
    localStorage.clear();
    mostrarVista();
    inputNombre.focus();
  }
});

mostrarVista();
