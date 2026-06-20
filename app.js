const display = document.getElementById("display");
const buttons = document.getElementById("buttons");

const calculator = {
    firstValue: null,
    operator: null,
    waitingForSecondValue: false,
    displayValue: "0",
    expression: "0"
};

function updateDisplay() {
    display.textContent = calculator.expression;
}

function inputNumber(number) {

    if (calculator.waitingForSecondValue) {

        calculator.displayValue = number;
        calculator.waitingForSecondValue = false;

        calculator.expression += number;

    } else {

        calculator.displayValue =
            calculator.displayValue === "0"
                ? number
                : calculator.displayValue + number;

        if (
            calculator.expression === "0" ||
            calculator.expression === "Error"
        ) {
            calculator.expression = calculator.displayValue;
        } else {
            calculator.expression += number;
        }
    }

    updateDisplay();
}

function inputDecimal() {

    if (calculator.waitingForSecondValue) {

        calculator.displayValue = "0.";
        calculator.expression += "0.";
        calculator.waitingForSecondValue = false;

        updateDisplay();
        return;
    }

    if (!calculator.displayValue.includes(".")) {

        calculator.displayValue += ".";
        calculator.expression += ".";
    }

    updateDisplay();
}

function calculate(first, second, operator) {

    switch (operator) {

        case "+":
            return first + second;

        case "-":
            return first - second;

        case "*":
            return first * second;

        case "/":

            if (second === 0) {
                return "Error";
            }

            return first / second;

        default:
            return second;
    }
}

function handleOperator(nextOperator) {

    const inputValue = parseFloat(calculator.displayValue);

    if (
        calculator.operator &&
        calculator.waitingForSecondValue
    ) {

        calculator.operator = nextOperator;

        calculator.expression =
            calculator.expression.slice(0, -1) + nextOperator;

        updateDisplay();
        return;
    }

    if (calculator.firstValue === null) {

        calculator.firstValue = inputValue;

    } else if (calculator.operator) {

        const result = calculate(
            calculator.firstValue,
            inputValue,
            calculator.operator
        );

        if (result === "Error") {

            calculator.expression = "Error";
            updateDisplay();

            resetCalculator();
            return;
        }

        calculator.firstValue = result;
    }

    calculator.operator = nextOperator;
    calculator.waitingForSecondValue = true;

    calculator.expression += " " + nextOperator + " ";

    updateDisplay();
}

function resetCalculator() {

    calculator.firstValue = null;
    calculator.operator = null;
    calculator.waitingForSecondValue = false;
    calculator.displayValue = "0";
    calculator.expression = "0";
}

function deleteLastDigit() {

    if (calculator.displayValue.length > 1) {

        calculator.displayValue =
            calculator.displayValue.slice(0, -1);

    } else {

        calculator.displayValue = "0";
    }

    calculator.expression = calculator.displayValue;

    updateDisplay();
}

buttons.addEventListener("click", (event) => {

    const target = event.target;

    if (!target.matches("button")) return;

    if (target.dataset.number) {
        inputNumber(target.dataset.number);
    }

    if (target.dataset.decimal) {
        inputDecimal();
    }

    if (target.dataset.operator) {
        handleOperator(target.dataset.operator);
    }

    if (target.dataset.action === "equals") {

        if (calculator.operator) {

            const secondValue =
                parseFloat(calculator.displayValue);

            const result = calculate(
                calculator.firstValue,
                secondValue,
                calculator.operator
            );

            if (result === "Error") {

                calculator.expression = "Error";
                updateDisplay();

                setTimeout(resetCalculator, 1500);
                return;
            }

            calculator.displayValue = String(result);
            calculator.expression = String(result);

            calculator.firstValue = null;
            calculator.operator = null;
            calculator.waitingForSecondValue = false;

            updateDisplay();
        }
    }

    if (target.dataset.action === "clear") {

        resetCalculator();
        updateDisplay();
    }

    if (target.dataset.action === "delete") {
        deleteLastDigit();
    }
});

updateDisplay();