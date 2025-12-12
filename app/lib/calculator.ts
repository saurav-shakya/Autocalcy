import { CalculatorState } from '../types/calculator';

// Safe math evaluation without using eval()
export function evaluateExpression(expression: string): number {
  try {
    // Clean the expression
    let cleaned = expression
      .replace(/\s+/g, '')
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/\^/g, '**');

    // Handle percentage
    cleaned = cleaned.replace(/(\d+(\.\d+)?)%/g, (match, num) => {
      return `(${num}/100)`;
    });

    // Handle sqrt
    cleaned = cleaned.replace(/sqrt\(([^)]+)\)/g, (match, expr) => {
      return `Math.sqrt(${expr})`;
    });

    // Handle scientific functions
    cleaned = cleaned.replace(/sin\(([^)]+)\)/g, (match, expr) => {
      return `Math.sin(${expr})`;
    });
    cleaned = cleaned.replace(/cos\(([^)]+)\)/g, (match, expr) => {
      return `Math.cos(${expr})`;
    });
    cleaned = cleaned.replace(/tan\(([^)]+)\)/g, (match, expr) => {
      return `Math.tan(${expr})`;
    });
    cleaned = cleaned.replace(/log\(([^)]+)\)/g, (match, expr) => {
      return `Math.log10(${expr})`;
    });
    cleaned = cleaned.replace(/ln\(([^)]+)\)/g, (match, expr) => {
      return `Math.log(${expr})`;
    });

    // Validate expression (only allow numbers, operators, parentheses, and Math functions)
    if (!/^[0-9+\-*/().\sMath\.sqrt\(\)sin\(\)cos\(\)tan\(\)log\(\)ln\(\)]+$/.test(cleaned)) {
      throw new Error('Invalid expression');
    }

    // Use Function constructor as safer alternative to eval
    const result = new Function('return ' + cleaned)();
    
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Invalid result');
    }

    return result;
  } catch (error) {
    console.error('Evaluation error:', error);
    throw new Error('Invalid expression');
  }
}

export function calculatePercentage(value: number, percentage: number): number {
  return (value * percentage) / 100;
}

export function handleScientificFunction(func: string, value: number, isRadians: boolean = false): number {
  const angle = isRadians ? value : (value * Math.PI) / 180;

  switch (func.toLowerCase()) {
    case 'sin':
      return Math.sin(angle);
    case 'cos':
      return Math.cos(angle);
    case 'tan':
      return Math.tan(angle);
    case 'log':
      return Math.log10(value);
    case 'ln':
      return Math.log(value);
    case 'sqrt':
      return Math.sqrt(value);
    default:
      throw new Error(`Unknown function: ${func}`);
  }
}

export function formatDisplay(value: number | string): string {
  if (typeof value === 'string') return value;
  
  // Handle very large or very small numbers
  if (Math.abs(value) > 1e15 || (Math.abs(value) < 1e-6 && value !== 0)) {
    return value.toExponential(6);
  }

  // Format with appropriate decimal places
  const str = value.toString();
  if (str.includes('e')) return str;
  
  // Limit to 10 decimal places
  const rounded = Math.round(value * 1e10) / 1e10;
  return rounded.toString();
}

export function processButtonClick(
  state: CalculatorState,
  buttonValue: string
): Partial<CalculatorState> {
  let { display, previousValue, currentOperation, waitingForOperand, memory } = state;

  // Handle clear
  if (buttonValue === 'C' || buttonValue === 'AC') {
    return {
      display: '0',
      previousValue: null,
      currentOperation: null,
      waitingForOperand: true,
    };
  }

  // Handle backspace
  if (buttonValue === '⌫') {
    if (display.length > 1) {
      return { display: display.slice(0, -1) };
    }
    return { display: '0' };
  }

  // Handle numbers
  if (/^\d$/.test(buttonValue)) {
    if (waitingForOperand) {
      return { display: buttonValue, waitingForOperand: false };
    }
    if (display === '0') {
      return { display: buttonValue };
    }
    return { display: display + buttonValue };
  }

  // Handle decimal point
  if (buttonValue === '.') {
    if (waitingForOperand) {
      return { display: '0.', waitingForOperand: false };
    }
    if (!display.includes('.')) {
      return { display: display + '.' };
    }
    return {};
  }

  // Handle operators
  if (['+', '-', '×', '÷'].includes(buttonValue)) {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      return {
        previousValue: inputValue,
        currentOperation: buttonValue,
        waitingForOperand: true,
      };
    }

    if (currentOperation && !waitingForOperand) {
      const result = performCalculation(previousValue, inputValue, currentOperation);
      return {
        display: formatDisplay(result),
        previousValue: result,
        currentOperation: buttonValue,
        waitingForOperand: true,
      };
    }

    return { currentOperation: buttonValue, waitingForOperand: true };
  }

  // Handle equals
  if (buttonValue === '=') {
    if (previousValue !== null && currentOperation) {
      const inputValue = parseFloat(display);
      const result = performCalculation(previousValue, inputValue, currentOperation);
      return {
        display: formatDisplay(result),
        previousValue: null,
        currentOperation: null,
        waitingForOperand: true,
      };
    }
    return {};
  }

  // Handle toggle sign
  if (buttonValue === '±') {
    const value = parseFloat(display);
    return {
      display: formatDisplay(-value),
    };
  }

  // Handle percentage
  if (buttonValue === '%') {
    const value = parseFloat(display);
    const result = value / 100;
    return {
      display: formatDisplay(result),
      waitingForOperand: true,
    };
  }

  // Handle scientific functions
  if (['sin', 'cos', 'tan', 'log', 'ln'].includes(buttonValue)) {
    const value = parseFloat(display);
    try {
      const result = handleScientificFunction(buttonValue, value, false);
      return {
        display: formatDisplay(result),
        waitingForOperand: true,
      };
    } catch (error) {
      return { display: 'Error' };
    }
  }

  // Handle constants
  if (buttonValue === 'π') {
    return {
      display: formatDisplay(Math.PI),
      waitingForOperand: true,
    };
  }
  if (buttonValue === 'e') {
    return {
      display: formatDisplay(Math.E),
      waitingForOperand: true,
    };
  }

  // Handle power
  if (buttonValue === '^') {
    // This will be handled in the expression evaluation
    return { currentOperation: '^', waitingForOperand: true };
  }

  // Handle square root
  if (buttonValue === '√') {
    const value = parseFloat(display);
    if (value < 0) {
      return { display: 'Error' };
    }
    const result = Math.sqrt(value);
    return {
      display: formatDisplay(result),
      waitingForOperand: true,
    };
  }

  // Handle square
  if (buttonValue === 'x²') {
    const value = parseFloat(display);
    const result = value * value;
    return {
      display: formatDisplay(result),
      waitingForOperand: true,
    };
  }

  // Handle memory functions
  if (buttonValue === 'M+') {
    return { memory: memory + parseFloat(display) };
  }
  if (buttonValue === 'M-') {
    return { memory: memory - parseFloat(display) };
  }
  if (buttonValue === 'MR') {
    return { display: formatDisplay(memory), waitingForOperand: true };
  }
  if (buttonValue === 'MC') {
    return { memory: 0 };
  }

  return {};
}

function performCalculation(prev: number, current: number, operation: string): number {
  switch (operation) {
    case '+':
      return prev + current;
    case '-':
      return prev - current;
    case '×':
      return prev * current;
    case '÷':
      if (current === 0) {
        throw new Error('Division by zero');
      }
      return prev / current;
    default:
      return current;
  }
}

