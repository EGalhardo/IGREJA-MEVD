/**
 * Utilitários para partilha de conteúdos e cópia segura para a área de transferência.
 * Trata casos de iframes, restrições de permissões do navegador e dispositivos móveis.
 */

export interface SharePayload {
  title: string;
  text: string;
  url?: string;
}

/**
 * Partilha ou copia para a área de transferência com cascata de fallbacks:
 * 1. navigator.share (Web Share API)
 * 2. navigator.clipboard.writeText
 * 3. document.execCommand('copy') via textarea invisível
 */
export async function shareOrCopy(
  payload: SharePayload,
  onFeedback: (message: string, success: boolean) => void
): Promise<boolean> {
  const shareUrl = payload.url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = `${payload.title}\n${payload.text}${shareUrl ? `\n\nLink: ${shareUrl}` : ''}`;

  // 1. Tentar Web Share API se suportado nativamente
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: payload.title,
        text: `${payload.text}`,
        url: shareUrl,
      });
      onFeedback('Partilhado com sucesso!', true);
      return true;
    } catch (err: unknown) {
      const error = err as { name?: string };
      // Se o utilizador cancelou a janela de partilha nativa
      if (error?.name === 'AbortError') {
        return false;
      }
      // Se foi NotAllowedError (comum em iframes sem permissão web-share), avança para cópia
    }
  }

  // 2. Tentar navigator.clipboard.writeText
  const copied = await copyToClipboard(shareText);
  if (copied) {
    onFeedback('Link e detalhes copiados para a área de transferência!', true);
    return true;
  }

  // 3. Fallback informativo
  onFeedback('Link do evento: ' + (shareUrl || payload.title), true);
  return false;
}

/**
 * Cópia robusta de texto com fallback duplo (Clipboard API -> execCommand)
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // 1. Tentar API moderna
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Falha ou permissão negada no iframe, segue para execCommand
    }
  }

  // 2. Fallback clássico via elemento textarea
  if (typeof document !== 'undefined') {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.top = '-9999px';
      textArea.style.left = '-9999px';
      textArea.style.opacity = '0';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);

      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, 99999);

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return !!successful;
    } catch {
      return false;
    }
  }

  return false;
}
