// ==========================================
// comun.js - Funciones que usan todas las páginas
// ==========================================

// Lee un dato guardado en el navegador (localStorage).
// Si no existe o hay error, devuelve el valor por defecto.
function leerDatos(clave, porDefecto) {
  try {
    const texto = localStorage.getItem(clave);
    if (texto === null) {
      return porDefecto;
    }
    return JSON.parse(texto);
  } catch (error) {
    return porDefecto;
  }
}

// Guarda un dato en el navegador convertido a texto (JSON)
function guardarDatos(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    alert("No se pudo guardar la información en este navegador.");
  }
}

// Devuelve el usuario registrado o null si no hay
function obtenerUsuario() {
  return leerDatos("usuario", null);
}

// Si no hay usuario registrado, manda a la página de inicio
function verificarUsuario() {
  if (obtenerUsuario() === null) {
    window.location.href = "index.html";
  }
}

// Escribe "Hola, Nombre Apellido" en el encabezado
function mostrarSaludo() {
  const usuario = obtenerUsuario();
  const saludo = document.getElementById("saludo");
  if (usuario !== null && saludo !== null) {
    saludo.textContent = "Hola, " + usuario.nombre + " " + usuario.apellido;
  }
}

// Muestra un mensaje de error debajo de un campo
function mostrarError(idCampo, mensaje) {
  document.getElementById("error-" + idCampo).textContent = mensaje;
  document.getElementById(idCampo).setAttribute("aria-invalid", "true");
}

// Quita el mensaje de error de un campo
function limpiarError(idCampo) {
  document.getElementById("error-" + idCampo).textContent = "";
  document.getElementById(idCampo).removeAttribute("aria-invalid");
}

// Devuelve la fecha de hoy como texto AAAA-MM-DD
function fechaHoy() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return hoy.getFullYear() + "-" + mes + "-" + dia;
}
