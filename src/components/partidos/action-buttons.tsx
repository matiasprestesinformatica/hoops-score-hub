"use client"

import { Button } from "@/components/ui/button"

interface ActionButtonsProps {
  onStatUpdate: (statType: string, made: boolean) => void
  disabled: boolean
}

const ActionButton = ({ onClick, disabled, children, className, variant = "outline" }: { onClick: () => void; disabled: boolean; children: React.ReactNode, className?: string, variant?: "outline" | "destructive" }) => (
    <Button
        variant={variant}
        className={`aspect-square w-full h-auto bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 text-[10px] sm:text-xs whitespace-pre-line leading-tight p-1 flex flex-col justify-center ${className}`}
        onClick={onClick}
        disabled={disabled}
    >
        {children}
    </Button>
);


export function ActionButtons({ onStatUpdate, disabled }: ActionButtonsProps) {
  
  return (
    <div className="grid grid-cols-1 gap-3">
        {/* Fila de Tiros */}
        <div className="grid grid-cols-3 gap-2">
            <ActionButton onClick={() => onStatUpdate("2PT", true)} disabled={disabled}>
                <span>2 PTS</span>
                <span className="text-green-400 font-bold">ANOTADO</span>
            </ActionButton>
            <ActionButton onClick={() => onStatUpdate("3PT", true)} disabled={disabled}>
                <span>3 PTS</span>
                <span className="text-green-400 font-bold">ANOTADO</span>
            </ActionButton>
            <ActionButton onClick={() => onStatUpdate("FT", true)} disabled={disabled}>
                <span>T. LIBRE</span>
                <span className="text-green-400 font-bold">ANOTADO</span>
            </ActionButton>

            <ActionButton onClick={() => onStatUpdate("2PT", false)} disabled={disabled}>
                <span>2 PTS</span>
                <span className="text-red-400 font-bold">FALLADO</span>
            </ActionButton>
            <ActionButton onClick={() => onStatUpdate("3PT", false)} disabled={disabled}>
                <span>3 PTS</span>
                <span className="text-red-400 font-bold">FALLADO</span>
            </ActionButton>
            <ActionButton onClick={() => onStatUpdate("FT", false)} disabled={disabled}>
                <span>T. LIBRE</span>
                <span className="text-red-400 font-bold">FALLADO</span>
            </ActionButton>
        </div>
        {/* Fila de Otras Acciones */}
        <div className="grid grid-cols-3 gap-2">
            <ActionButton onClick={() => {}} disabled={disabled}>
                REBOTE
            </ActionButton>
            <ActionButton onClick={() => {}} disabled={disabled}>
                ASISTENCIA
            </ActionButton>
            <ActionButton onClick={() => {}} disabled={disabled}>
                FALTA
            </ActionButton>
        </div>
    </div>
  )
}
