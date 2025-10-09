"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const Calculator = () => {
  const [displayValue, setDisplayValue] = useState("0");
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === "0" ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplayValue("0.");
      setWaitingForSecondOperand(false);
      return;
    }
    if (!displayValue.includes(".")) {
      setDisplayValue(displayValue + ".");
    }
  };

  const clearDisplay = () => {
    setDisplayValue("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplayValue(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (first: number, second: number, op: string) => {
    switch (op) {
      case "+":
        return first + second;
      case "-":
        return first - second;
      case "*":
        return first * second;
      case "/":
        return first / second;
      default:
        return second;
    }
  };

  const handleEquals = () => {
    if (firstOperand === null || operator === null) {
      return;
    }
    const inputValue = parseFloat(displayValue);
    const result = calculate(firstOperand, inputValue, operator);
    setDisplayValue(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const buttonClasses = "w-full h-16 text-xl";
  const operatorClasses = "bg-blue-500 hover:bg-blue-600 text-white";
  const equalsClasses = "bg-green-500 hover:bg-green-600 text-white";
  const clearClasses = "bg-red-500 hover:bg-red-600 text-white";

  return (
    <div className="p-4 max-w-sm mx-auto bg-gray-800 rounded-xl shadow-lg space-y-4">
      <Input
        type="text"
        value={displayValue}
        readOnly
        className="w-full text-right text-4xl p-4 bg-gray-900 text-white border-none rounded-md"
      />
      <div className="grid grid-cols-4 gap-2">
        <Button
          onClick={() => inputDigit("7")}
          className={buttonClasses}
          variant="secondary"
        >
          7
        </Button>
        <Button
          onClick={() => inputDigit("8")}
          className={buttonClasses}
          variant="secondary"
        >
          8
        </Button>
        <Button
          onClick={() => inputDigit("9")}
          className={buttonClasses}
          variant="secondary"
        >
          9
        </Button>
        <Button
          onClick={() => performOperation("/")}
          className={cn(buttonClasses, operatorClasses)}
        >
          ÷
        </Button>

        <Button
          onClick={() => inputDigit("4")}
          className={buttonClasses}
          variant="secondary"
        >
          4
        </Button>
        <Button
          onClick={() => inputDigit("5")}
          className={buttonClasses}
          variant="secondary"
        >
          5
        </Button>
        <Button
          onClick={() => inputDigit("6")}
          className={buttonClasses}
          variant="secondary"
        >
          6
        </Button>
        <Button
          onClick={() => performOperation("*")}
          className={cn(buttonClasses, operatorClasses)}
        >
          ×
        </Button>

        <Button
          onClick={() => inputDigit("1")}
          className={buttonClasses}
          variant="secondary"
        >
          1
        </Button>
        <Button
          onClick={() => inputDigit("2")}
          className={buttonClasses}
          variant="secondary"
        >
          2
        </Button>
        <Button
          onClick={() => inputDigit("3")}
          className={buttonClasses}
          variant="secondary"
        >
          3
        </Button>
        <Button
          onClick={() => performOperation("-")}
          className={cn(buttonClasses, operatorClasses)}
        >
          -
        </Button>

        <Button
          onClick={() => inputDigit("0")}
          className={buttonClasses}
          variant="secondary"
        >
          0
        </Button>
        <Button
          onClick={inputDecimal}
          className={buttonClasses}
          variant="secondary"
        >
          .
        </Button>
        <Button
          onClick={clearDisplay}
          className={cn(buttonClasses, clearClasses)}
        >
          C
        </Button>
        <Button
          onClick={() => performOperation("+")}
          className={cn(buttonClasses, operatorClasses)}
        >
          +
        </Button>
        <Button
          onClick={handleEquals}
          className={cn(buttonClasses, equalsClasses, "col-span-4")}
        >
          =
        </Button>
      </div>
    </div>
  );
};

export default Calculator;