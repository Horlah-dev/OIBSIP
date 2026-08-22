const previousDisplay = document.querySelector(".previous-display");
const currentDisplay = document.querySelector(".current-display");
const buttons = document.querySelectorAll(".calculator-buttons button");

let firstNumber = null;
let operator = null;
let resetDisplay = false;

function calculate(firstNumber, operator, secondNumber) {
    if (operator === "+") {
        return firstNumber + secondNumber;
    }

    if (operator === "-") {
        return firstNumber - secondNumber;
    }

    if (operator === "×") {
        return firstNumber * secondNumber;
    }

    if (operator === "÷") {
        if (secondNumber === 0) {
            return "Error";
        }

        return firstNumber / secondNumber;
    }
}


buttons.forEach((button) => {
    button.addEventListener("click", () => {
        if (button.classList.contains("number")) {
            if (resetDisplay){
                currentDisplay.textContent = button.dataset.number;
                resetDisplay = false;
            }

    else if (currentDisplay.textContent === "0") {
        currentDisplay.textContent = button.dataset.number;
    } else {
        currentDisplay.textContent += button.dataset.number;
    }
}

    if (button.classList.contains("decimal")) {
        if (resetDisplay) {
        currentDisplay.textContent = "0.";
        resetDisplay = false;
    } else if (!currentDisplay.textContent.includes(".")) {
        currentDisplay.textContent += ".";
    }
}

   if (button.classList.contains("operator")) {

    if (operator !== null && !resetDisplay) {
        const secondNumber = Number(currentDisplay.textContent);
        const result = calculate(firstNumber, operator, secondNumber);

        currentDisplay.textContent = result;
        firstNumber = result;
    } else {
        firstNumber = Number(currentDisplay.textContent);
    }

    operator = button.dataset.operator;
    resetDisplay = true;
}

    if(button.classList.contains("equals")){
        if (firstNumber === null || operator === null){
            return;
        }
        const secondNumber = Number(currentDisplay.textContent);
        const result = calculate(firstNumber, operator, secondNumber);

        previousDisplay.textContent = `${firstNumber} ${operator} ${secondNumber} =`;
        currentDisplay.textContent = result;
        resetDisplay = true;
        firstNumber = null;
        operator = null;
    };

    if(button.classList.contains("clear")){
        currentDisplay.textContent = "0";
    firstNumber = null;
    operator = null;
    resetDisplay = false;
    previousDisplay.textContent = "";
    }

    if(button.classList.contains("delete")){
        if(currentDisplay.textContent.length > 1){
        currentDisplay.textContent = currentDisplay.textContent.slice(0, -1);

    } else {
        currentDisplay.textContent = "0";
    }
    }
    
})});
