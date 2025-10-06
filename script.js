// 1. SELEÇÃO DE ELEMENTOS
// Usamos os atributos data- que definimos no HTML
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

// 2. CLASSE CALCULADORA
class Calculadora {
    // O construtor é chamado quando criamos uma nova instância da Calculadora
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
    this.clear(); // Inicializa a calculadora com valores limpos
    // (Este método deve estar DENTRO da sua classe Calculadora)
}

// Método para 'Deletar' (DEL)
delete() {
    // Ele converte para string e remove o último caractere
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
}

    // Método para 'Limpar Tudo' (AC - All Clear)
    clear() {
        this.currentOperand = ''; // Número que está sendo digitado
        this.previousOperand = ''; // Número anterior para a operação
        this.operation = undefined; // Operação (+, -, *, /)
    }

    // Método para atualizar o display no HTML
    updateDisplay() {
        this.currentOperandTextElement.innerText = this.currentOperand;
        // Mostra a operação anterior (opcional)
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
    // Método para adicionar um número ao 'currentOperand'
    appendNumber(number) {
        // Evita múltiplos pontos decimais
        if (number === '.' && this.currentOperand.includes('.')) return; 
        
        // Concatena a string do número
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }
    // Formata o número para exibição (ex: 1000000 -> 1,000,000)
    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]); // Pega a parte inteira
        const decimalDigits = stringNumber.split('.')[1]; // Pega a parte decimal
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            // Usa o local para formatação (ex: 'en' usa vírgulas, 'pt-BR' usa pontos)
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    // Atualiza o display usando a nova formatação
    updateDisplay() {
        // Usa o método de formatação para o número atual
        this.currentOperandTextElement.innerText = 
            this.getDisplayNumber(this.currentOperand);
        
        // Exibe a operação anterior formatada
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }

    // Define qual operação o usuário quer
    chooseOperation(operation) {
        // Se o usuário não digitou nada, ignora a operação
        if (this.currentOperand === '') return; 
        
        // Se já houver um número anterior, calcula o resultado antes de iniciar a nova operação
        if (this.previousOperand !== '') {
            this.compute();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand; // Move o número atual para o anterior
        this.currentOperand = ''; // Limpa o atual para o próximo número
    }

    // Executa o cálculo
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        // Se faltar algum número, cancela o cálculo
        if (isNaN(prev) || isNaN(current)) return; 

        // O 'switch' é ótimo para operações múltiplas
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return; // Se não for nenhuma, sai
        }

        this.currentOperand = computation;
        this.operation = undefined; // Limpa a operação
        this.previousOperand = ''; // Limpa o anterior
    }
}

// Cria uma nova instância da calculadora
const calculator = new Calculadora(previousOperandTextElement, currentOperandTextElement);

// Event Listener para os botões de número
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 1. Adiciona o número clicado
        calculator.appendNumber(button.innerText);
        // 2. Atualiza a tela
        calculator.updateDisplay();
    });
});
// (Código a ser adicionado DEPOIS da criação da instância 'calculator')

// Event Listener para os botões de operação (+, -, *, /)
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

// Event Listener para o botão de Igual (=)
equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
});
// (Adicione ou confirme que estes métodos estão DENTRO da sua classe Calculadora)
// (Os métodos clear e delete já estão definidos dentro da classe Calculadora acima, então remova estas definições duplicadas.)

// Event Listener para o botão AC (Limpar Tudo)
allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

// Event Listener para o botão DEL (Deletar)
deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

// Listener de Evento para o Teclado
document.addEventListener('keydown', e => {
    // A propriedade 'key' contém o caractere da tecla pressionada
    const key = e.key;

    // 1. Números (0-9) e Ponto Decimal
    if ((key >= '0' && key <= '9') || key === '.') {
        calculator.appendNumber(key);
        calculator.updateDisplay();
    } 
    // 2. Operações
    else if (key === '+' || key === '-' || key === '*' || key === '/') {
        // No teclado, a divisão é '/'
        // No display, usamos '÷', então convertemos:
        const operationKey = key === '/' ? '÷' : key; 
        calculator.chooseOperation(operationKey);
        calculator.updateDisplay();
    }
    // 3. Botão de Igual (=) e Enter
    else if (key === '=' || key === 'Enter') {
        // Previne que o 'Enter' execute a ação padrão do navegador (como clicar no último botão)
        e.preventDefault(); 
        calculator.compute();
        calculator.updateDisplay();
    }
    // 4. Botão DEL (Backspace/Delete)
    else if (key === 'Backspace') {
        calculator.apagar(); // Use o nome do método que funcionou para você ('apagar' ou 'delete')
        calculator.updateDisplay();
    }
    // 5. Botão AC (Delete ou Esc) - Opcional, mas útil
    else if (key === 'Delete' || key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    }
});