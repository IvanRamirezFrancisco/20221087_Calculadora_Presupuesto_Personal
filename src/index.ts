type TipoTransaccion = "ingreso" | "gasto";

interface Transaccion {
  id: number;
  monto: number;
  descripcion: string;
  tipo: TipoTransaccion;
}

let transacciones: Transaccion[] = [];

const balanceElement = document.getElementById("balance")!;
const transactionTableElement = document.getElementById("transaction-table-body")!;
const descriptionInput = document.getElementById("description") as HTMLInputElement;
const amountInput = document.getElementById("amount") as HTMLInputElement;
const addIncomeButton = document.getElementById("add-income")!;
const addExpenseButton = document.getElementById("add-expense")!;
const messageElement = document.getElementById("message")!;  // Nuevo mensaje de alerta

function agregarTransaccion(tipo: TipoTransaccion) {
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

  // Validar que el balance no sea negativo si es un gasto
  if (tipo === "gasto") {
    const nuevoBalance = calcularBalance() - monto;
    if (nuevoBalance < 0) {
      mostrarMensaje("No puedes agregar un gasto que genere balance negativo.", "error");
      return;
    }
  }

  const nuevaTransaccion: Transaccion = {
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

function calcularBalance(): number {
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

function mostrarMensaje(mensaje: string, tipo: "success" | "error") {
  messageElement.textContent = mensaje;
  messageElement.className = tipo;
  setTimeout(() => {
    messageElement.textContent = "";
  }, 3000);
}

addIncomeButton.addEventListener("click", () => agregarTransaccion("ingreso"));
addExpenseButton.addEventListener("click", () => agregarTransaccion("gasto"));
