"use client";

interface StepTitleProps {
  title: string;
  description: string;
}

export function StepTitle({ title, description }: StepTitleProps) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
