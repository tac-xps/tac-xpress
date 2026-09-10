"use client"

interface WizardStepHeaderProps {
  name: string
  description: string
}

export function WizardStepHeader({ name, description }: WizardStepHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-foreground">{name}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
