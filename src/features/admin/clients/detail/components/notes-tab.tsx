import { NotebookPen } from "lucide-react";

export function NotesTab() {
  return (
    <section className="flex flex-col items-center gap-3 rounded-[2rem] border border-dashed border-tertiary/40 bg-quaternary/15 px-6 py-12 text-center">
      <NotebookPen className="size-6 text-tertiary" />
      <h2 className="font-heading text-xl text-secondary">Notas internas</h2>
      <p className="max-w-md font-sans text-sm text-secondary/65">
        Este espacio queda listo para las notas del equipo (preferencias, cuidados, observaciones).
        Se habilitará cuando el backend tenga el módulo de notas; por ahora no se guarda nada aquí.
      </p>
    </section>
  );
}
