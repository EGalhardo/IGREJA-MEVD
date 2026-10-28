/**
 * Utilitários de sanitização e validação de dados de entrada do utilizador
 * Previne injecções de script/HTML, formata e valida campos de perfil.
 */

/**
 * Remove tags HTML, scripts, caracteres de controlo e normaliza espaços.
 */
export function sanitizeText(input: string, maxLength: number = 100): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, '') // Remove tags HTML/XML
    .replace(/[<>'"&`]/g, (char) => {
      // Escapa caracteres perigosos comuns
      const map: Record<string, string> = {
        '<': '',
        '>': '',
        "'": '',
        '"': '',
        '&': 'e',
        '`': '',
      };
      return map[char] || '';
    })
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove caracteres de controlo invisíveis
    .replace(/\s+/g, ' ') // Colapsa múltiplos espaços
    .trim()
    .slice(0, maxLength);
}

/**
 * Sanitiza e valida endereço de email.
 */
export function sanitizeEmail(input: string): { isValid: boolean; value: string; error?: string } {
  const sanitized = sanitizeText(input, 120).toLowerCase();

  if (!sanitized) {
    return { isValid: false, value: '', error: 'O email é obrigatório.' };
  }

  // Expressão regular padrão para validação de email RFC 5322 simplificada
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!emailRegex.test(sanitized)) {
    return {
      isValid: false,
      value: sanitized,
      error: 'Formato de email inválido. Exemplo: nome@email.com',
    };
  }

  return { isValid: true, value: sanitized };
}

/**
 * Sanitiza número de telefone ou WhatsApp (permite dígitos, +, -, (, ), e espaços).
 */
export function sanitizePhone(input: string): { isValid: boolean; value: string; error?: string } {
  // Limpa caracteres não permitidos em telefones
  const sanitized = input
    .replace(/<[^>]*>/g, '')
    .replace(/[^\d+()\-\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 30);

  // Contar apenas dígitos
  const digitsCount = (sanitized.match(/\d/g) || []).length;

  if (digitsCount < 7) {
    return {
      isValid: false,
      value: sanitized,
      error: 'O número de contacto deve conter pelo menos 7 dígitos.',
    };
  }

  return { isValid: true, value: sanitized };
}

/**
 * Valida o estado civil perante os valores permitidos.
 */
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
