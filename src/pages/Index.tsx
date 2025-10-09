"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import Calculator from "@/components/Calculator";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">
        Simple Calculator
      </h1>
      <Calculator />
      <MadeWithDyad />
    </div>
  );
};

export default Index;