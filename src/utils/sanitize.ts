/**
 * Utilitários de validação dos dados de perfil.
 * Os valores são apresentados como texto pelo React, que escapa HTML na renderização.
 */

/** Remove tags e caracteres de controlo sem alterar pontuação legítima de nomes e moradas. */
export function sanitizeText(input: string, maxLength: number = 100): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/** Valida o email sem modificar caracteres válidos do endereço. */
export function sanitizeEmail(input: string): { isValid: boolean; value: string; error?: string } {
  const value = input.trim();

  if (!value) {
    return { isValid: false, value: '', error: 'O email é obrigatório.' };
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  const localPart = value.split('@')[0];

  if (
    value.length > 120 ||
    localPart.length > 64 ||
    localPart.startsWith('.') ||
    localPart.endsWith('.') ||
    localPart.includes('..') ||
    !emailRegex.test(value)
  ) {
    return {
      isValid: false,
      value,
      error: 'Formato de email inválido. Exemplo: nome@email.com',
    };
  }

  return { isValid: true, value };
}

/** Valida número de telefone sem remover silenciosamente caracteres inválidos. */
export function sanitizePhone(input: string): { isValid: boolean; value: string; error?: string } {
  const value = input.replace(/\s+/g, ' ').trim();
  const digitsCount = (value.match(/\d/g) || []).length;

  if (digitsCount < 7) {
    return {
      isValid: false,
      value,
      error: 'O número de contacto deve conter pelo menos 7 dígitos.',
    };
  }

  if (value.length > 30 || !/^\+?[\d()\- ]+$/.test(value)) {
    return {
      isValid: false,
      value,
      error: 'O número de contacto contém caracteres inválidos.',
    };
  }

  return { isValid: true, value };
}

/** Valida o estado civil perante os valores permitidos. */
export const ALLOWED_CIVIL_STATUSES = [
  'Solteiro(a)',
  'Casado(a)',
  'Divorciado(a)',
  'Viúvo(a)',
] as const;

export type CivilStatus = (typeof ALLOWED_CIVIL_STATUSES)[number];

export function sanitizeCivilStatus(input: string): CivilStatus {
  const trimmed = input.trim();
  if (ALLOWED_CIVIL_STATUSES.includes(trimmed as CivilStatus)) {
    return trimmed as CivilStatus;
  }
  return 'Casado(a)';
}
