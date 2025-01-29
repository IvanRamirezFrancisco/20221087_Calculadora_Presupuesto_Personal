"use strict";
let transacciones = [];
const balanceElement = document.getElementById("balance");
const transactionTableElement = document.getElementById("transaction-table-body");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const addIncomeButton = document.getElementById("add-income");
const addExpenseButton = document.getElementById("add-expense");
const messageElement = document.getElementById("message"); //  mensaje de alerta
function agregarTransaccion(tipo) {
    const descripcion = descriptionInput.value.trim();
    const monto = parseFloat(amountInput.value);
    if (!descripcion) {
        mostrarMensaje("La descripción no puede estar vacía.", "error");
        return;
    }
    if (isNaN(monto) || monto <= 0) {
        mostrarMensaje("El monto debe ser un número positivo.", "error");
        return;
    }
    // Validar que no sea negativo 
    if (tipo === "gasto") {
        const nuevoBalance = calcularBalance() - monto;
        if (nuevoBalance < 0) {
            mostrarMensaje("No puedes agregar un gasto que genere balance negativo.", "error");
            return;
        }
    }
    const nuevaTransaccion = {
        id: Date.now(),
        monto,
        descripcion,
        tipo,
    };
    transacciones.push(nuevaTransaccion);
    actualizarUI();
    mostrarMensaje("Transacción agregada correctamente.", "success");
    // Limpiar inputs
    descriptionInput.value = "";
    amountInput.value = "";
}
function calcularBalance() {
    const ingresos = transacciones
        .filter((t) => t.tipo === "ingreso")
        .reduce((sum, t) => sum + t.monto, 0);
    const gastos = transacciones
        .filter((t) => t.tipo === "gasto")
        .reduce((sum, t) => sum + t.monto, 0);
    return ingresos - gastos;
}
function actualizarUI() {
    balanceElement.textContent = `$${calcularBalance().toFixed(2)}`;
    transactionTableElement.innerHTML = ""; // Limpiar tabla antes de actualizar
    transacciones.forEach((t) => {
        const row = document.createElement("tr");
        const cellMonto = document.createElement("td");
        cellMonto.textContent = `$${t.monto.toFixed(2)}`;
        row.appendChild(cellMonto);
        const cellDescripcion = document.createElement("td");
        cellDescripcion.textContent = t.descripcion;
        row.appendChild(cellDescripcion);
        const cellTipo = document.createElement("td");
        cellTipo.textContent = t.tipo;
        cellTipo.classList.add(t.tipo === "ingreso" ? "income" : "expense");
        row.appendChild(cellTipo);
        transactionTableElement.appendChild(row);
    });
}
function mostrarMensaje(mensaje, tipo) {
    messageElement.textContent = mensaje;
    messageElement.className = tipo;
    setTimeout(() => {
        messageElement.textContent = "";
    }, 3000);
}
addIncomeButton.addEventListener("click", () => agregarTransaccion("ingreso"));
addExpenseButton.addEventListener("click", () => agregarTransaccion("gasto"));
