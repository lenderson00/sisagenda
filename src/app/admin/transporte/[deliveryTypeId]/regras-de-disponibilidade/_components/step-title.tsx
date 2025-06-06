"use client";

interface StepTitleProps {
  title: string;
  description: string;
}

export function StepTitle({ title, description }: StepTitleProps) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}
