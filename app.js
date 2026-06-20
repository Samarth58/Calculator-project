
const display = document.getElementById("display");
const buttons = document.getElementById("buttons");

let expression = "";

function updateDisplay() {
  display.textContent = expression || "0";
}

function calculateExpression(expr) {
  let tokens = expr.trim().split(" ");

  // Handle * and /
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === "*" || tokens[i] === "/") {
      const left = parseFloat(tokens[i - 1]);
      const right = parseFloat(tokens[i + 1]);

      let result;

      if (tokens[i] === "*") {
        result = left * right;
      } else {
        if (right === 0) return "Error";
        result = left / right;
      }

      tokens.splice(i - 1, 3, result.toString());
      i--;
    }
  }

  // Handle + and -
  let result = parseFloat(tokens[0]);

  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const value = parseFloat(tokens[i + 1]);

    if (operator === "+") {
      result += value;
    } else if (operator === "-") {
      result -= value;
    }
  }

  return result;
}

buttons.addEventListener("click", (event) => {
  const target = event.target;

  if (!target.matches("button")) return;

  // Numbers
  if (target.dataset.number) {
    expression += target.dataset.number;
    updateDisplay();
  }

  // Decimal
  if (target.dataset.decimal) {
    const parts = expression.split(/[\+\-\*\/]/);
    const currentNumber = parts[parts.length - 1];

    if (!currentNumber.includes(".")) {
      expression += ".";
    }

    updateDisplay();
  }

  // Operators
  if (target.dataset.operator) {
    const operator = target.dataset.operator;

    // Change operator if last character is already an operator
    if (/[+\-*/]\s*$/.test(expression)) {
      expression = expression.replace(/[+\-*/]\s*$/, operator + " ");
    } else if (expression !== "") {
      expression += " " + operator + " ";
    }

    updateDisplay();
  }

  // Equals
  if (target.dataset.action === "equals") {
    if (expression !== "") {
      const result = calculateExpression(expression);

      expression = String(result);
      updateDisplay();
    }
  }

  // Clear
  if (target.dataset.action === "clear") {
    expression = "";
    updateDisplay();
  }

  // Delete
  if (target.dataset.action === "delete") {
    expression = expression.slice(0, -1);
    updateDisplay();
  }
});

updateDisplay();

