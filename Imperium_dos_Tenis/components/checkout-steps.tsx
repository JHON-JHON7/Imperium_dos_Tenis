// components/CheckoutSteps.tsx
"use client";

import { Check } from "lucide-react";

export function CheckoutSteps({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, title: "Endereço" },
    { number: 2, title: "Pagamento" },
    { number: 3, title: "Confirmação" },
  ];

  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((s, i) => (
        <div key={s.number} className="flex items-center w-full">
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                currentStep > s.number
                  ? "bg-yellow-400 text-black border-yellow-400"
                  : currentStep === s.number
                  ? "border-yellow-400 text-yellow-400"
                  : "border-white/30 text-white/60"
              }`}
            >
              {currentStep > s.number ? <Check className="h-5 w-5" /> : <span className="font-medium">{s.number}</span>}
            </div>
            <div className={`mt-2 text-xs ${currentStep >= s.number ? "text-white" : "text-white/60"}`}>{s.title}</div>
          </div>

          {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-4 ${currentStep > s.number ? "bg-yellow-400" : "bg-white/20"}`} />}
        </div>
      ))}
    </div>
  );
}
