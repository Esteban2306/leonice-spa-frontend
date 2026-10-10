export interface PasswordRule {
  key: string;
  label: string;
  test: (value: string) => boolean;
}

export const PASSWORD_RULES: readonly PasswordRule[] = [
  { key: "length", label: "Mínimo 8 caracteres", test: (v) => v.length >= 8 },
  { key: "upper", label: "Una mayúscula", test: (v) => /[A-ZÁÉÍÓÚÑ]/.test(v) },
  { key: "lower", label: "Una minúscula", test: (v) => /[a-záéíóúñ]/.test(v) },
  { key: "number", label: "Un número", test: (v) => /\d/.test(v) },
  {
    key: "symbol",
    label: "Un símbolo (! # $ %)",
    test: (v) => /[^A-Za-z0-9ÁÉÍÓÚÑáéíóúñ\s]/.test(v),
  },
];

export interface PasswordDraft {
  current: string;
  next: string;
  confirmation: string;
}

export function evaluatePassword(draft: PasswordDraft) {
  const rules = PASSWORD_RULES.map((rule) => ({
    key: rule.key,
    label: rule.label,
    passed: rule.test(draft.next),
  }));
  const isStrong = rules.every((rule) => rule.passed);
  const matches = draft.next.length > 0 && draft.next === draft.confirmation;
  const isDifferent = draft.next !== draft.current;

  return {
    rules,
    isStrong,
    matches,
    isDifferent,
    canSubmit: draft.current.length > 0 && isStrong && matches && isDifferent,
  };
}
