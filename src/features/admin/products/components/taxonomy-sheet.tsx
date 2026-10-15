"use client";

import { useState, type FormEvent } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/src/components/ui/sheet";
import { INPUT_CLASS } from "@/src/features/admin/components/reservation-actions/form-controls";
import { CatalogSwitch } from "@/src/features/admin/services/components/catalog-switch";
import type {
  AdminProductCategory,
  AdminProductTag,
} from "@/src/features/admin/types/products.types";

interface TaxonomyItem {
  id: string;
  name: string;
  isActive: boolean;
  usage: number;
}

interface TaxonomySectionProps {
  id: string;
  title: string;
  description: string;
  placeholder: string;
  items: readonly TaxonomyItem[];
  usageLabel: (count: number) => string;
  deleteBlockedReason: (item: TaxonomyItem) => string | null;
  onCreate: (name: string) => Promise<boolean>;
  onRename: (id: string, name: string) => Promise<boolean>;
  onToggle: (id: string, isActive: boolean) => Promise<boolean>;
  onDelete: (item: TaxonomyItem) => void;
}

function TaxonomyRow({
  item,
  section,
}: {
  item: TaxonomyItem;
  section: TaxonomySectionProps;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const blocked = section.deleteBlockedReason(item);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (editing === null) return;
    const name = editing.trim().replace(/\s+/g, " ");
    if (name.length < 2 || name === item.name) {
      setEditing(null);
      return;
    }
    setIsSaving(true);
    const ok = await section.onRename(item.id, name);
    setIsSaving(false);
    if (ok) setEditing(null);
  };

  if (editing !== null) {
    return (
      <li>
        <form
          onSubmit={(event) => void save(event)}
          className="flex items-center gap-2 py-1.5"
        >
          <input
            value={editing}
            autoFocus
            maxLength={60}
            aria-label={`Nuevo nombre para ${item.name}`}
            onChange={(event) => setEditing(event.target.value)}
            onKeyDown={(event) => event.key === "Escape" && setEditing(null)}
            className={`${INPUT_CLASS} h-10`}
          />
          <button
            type="submit"
            disabled={isSaving}
            aria-label="Guardar nombre"
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-secondary text-primary disabled:opacity-50"
          >
            <Check className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Cancelar"
            onClick={() => setEditing(null)}
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-secondary/60 hover:bg-secondary/5"
          >
            <X className="size-4" />
          </button>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-2 py-2">
      <div className="min-w-0 flex-1">
        <p
          className={
            item.isActive
              ? "truncate font-sans text-sm font-semibold text-secondary"
              : "truncate font-sans text-sm text-secondary/55"
          }
        >
          {item.name}
        </p>
        <p className="font-sans text-xs text-secondary/55 tabular-nums">
          {section.usageLabel(item.usage)}
          {!item.isActive && " · desactivada"}
        </p>
      </div>
      <CatalogSwitch
        checked={item.isActive}
        label={
          item.isActive ? `Desactivar ${item.name}` : `Activar ${item.name}`
        }
        onChange={(next) => void section.onToggle(item.id, next)}
      />
      <button
        type="button"
        aria-label={`Renombrar ${item.name}`}
        onClick={() => setEditing(item.name)}
        className="grid size-8 cursor-pointer place-items-center rounded-full text-secondary/55 transition-colors hover:bg-quaternary/35 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
      >
        <Pencil className="size-4" />
      </button>
      <button
        type="button"
        aria-label={`Eliminar ${item.name}`}
        title={blocked ?? `Eliminar ${item.name}`}
        disabled={blocked !== null}
        onClick={() => section.onDelete(item)}
        className="grid size-8 cursor-pointer place-items-center rounded-full text-secondary/55 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-secondary/55"
      >
        <Trash2 className="size-4" />
      </button>
    </li>
  );
}

function TaxonomySection(props: TaxonomySectionProps) {
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const normalized = name.trim().replace(/\s+/g, " ");

  const create = async (event: FormEvent) => {
    event.preventDefault();
    if (normalized.length < 2) return;
    setIsCreating(true);
    const ok = await props.onCreate(normalized);
    setIsCreating(false);
    if (ok) setName("");
  };

  return (
    <section
      aria-labelledby={props.id}
      className="flex flex-col gap-3 border-t border-tertiary/25 px-6 py-6 first:border-t-0"
    >
      <div>
        <h3 id={props.id} className="font-heading text-xl text-secondary">
          {props.title}
        </h3>
        <p className="mt-1 font-sans text-sm text-secondary/65">
          {props.description}
        </p>
      </div>
      <form onSubmit={(event) => void create(event)} className="flex gap-2">
        <input
          value={name}
          maxLength={60}
          placeholder={props.placeholder}
          aria-label={`Nombre de la nueva ${props.title.toLowerCase().replace(/s$/, "")}`}
          onChange={(event) => setName(event.target.value)}
          className={`${INPUT_CLASS} h-10`}
        />
        <button
          type="submit"
          disabled={normalized.length < 2 || isCreating}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-secondary px-4 font-sans text-sm text-primary transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="size-4" strokeWidth={2} />
          Crear
        </button>
      </form>
      {props.items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-tertiary/50 px-4 py-3 font-sans text-sm text-secondary/60">
          Todavía no hay ninguna.
        </p>
      ) : (
        <ul className="divide-y divide-tertiary/15">
          {props.items.map((item) => (
            <TaxonomyRow key={item.id} item={item} section={props} />
          ))}
        </ul>
      )}
    </section>
  );
}

interface TaxonomySheetProps {
  open: boolean;
  categories: readonly AdminProductCategory[];
  tags: readonly AdminProductTag[];
  onOpenChange: (open: boolean) => void;
  onCreateCategory: (name: string) => Promise<boolean>;
  onRenameCategory: (id: string, name: string) => Promise<boolean>;
  onToggleCategory: (id: string, isActive: boolean) => Promise<boolean>;
  onDeleteCategory: (category: { id: string; name: string }) => void;
  onCreateTag: (name: string) => Promise<boolean>;
  onRenameTag: (id: string, name: string) => Promise<boolean>;
  onToggleTag: (id: string, isActive: boolean) => Promise<boolean>;
  onDeleteTag: (tag: { id: string; name: string; usage: number }) => void;
}

export function TaxonomySheet(props: TaxonomySheetProps) {
  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full gap-0 overflow-hidden border-l border-tertiary/30 bg-[#FCF6EB] p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-lg"
      >
        <header className="bg-secondary px-6 pt-6 pb-5 pr-16 text-primary">
          <SheetTitle className="font-heading text-3xl leading-tight text-primary">
            Categorías y etiquetas
          </SheetTitle>
          <SheetDescription className="mt-1 font-sans text-sm text-primary/70">
            Las categorías agrupan los productos en la web; las etiquetas
            conectan productos relacionados y alimentan las recomendaciones.
          </SheetDescription>
        </header>
        <div className="flex-1 overflow-y-auto">
          <TaxonomySection
            id="taxonomy-categories"
            title="Categorías"
            description="Una categoría con productos no se puede borrar: muévelos o desactívala."
            placeholder="Cuidado capilar"
            items={props.categories.map((category) => ({
              id: category.id,
              name: category.name,
              isActive: category.isActive,
              usage: category._count.products,
            }))}
            usageLabel={(count) =>
              count === 1 ? "1 producto" : `${count} productos`
            }
            deleteBlockedReason={(item) =>
              item.usage > 0 ? "Tiene productos: muévelos o desactívala" : null
            }
            onCreate={props.onCreateCategory}
            onRename={props.onRenameCategory}
            onToggle={props.onToggleCategory}
            onDelete={(item) => props.onDeleteCategory(item)}
          />
          <TaxonomySection
            id="taxonomy-tags"
            title="Etiquetas"
            description="Borrar una etiqueta la quita de todos los productos que la usan."
            placeholder="Control de frizz"
            items={props.tags.map((tag) => ({
              id: tag.id,
              name: tag.name,
              isActive: tag.isActive,
              usage: tag._count.assignments,
            }))}
            usageLabel={(count) =>
              count === 1 ? "En 1 producto" : `En ${count} productos`
            }
            deleteBlockedReason={() => null}
            onCreate={props.onCreateTag}
            onRename={props.onRenameTag}
            onToggle={props.onToggleTag}
            onDelete={(item) => props.onDeleteTag(item)}
          />
        </div>
        <SheetClose
          render={
            <button
              type="button"
              aria-label="Cerrar"
              className="absolute top-5 right-5 grid size-9 cursor-pointer place-items-center rounded-full border border-primary/20 text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quaternary"
            />
          }
        >
          <X className="size-4.5" />
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
