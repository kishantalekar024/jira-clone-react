import DOMPurify from 'dompurify';

const sanitizeConfig = {
  ALLOWED_TAGS: [
    'p',
    'br',
    'strong',
    'em',
    'u',
    'ul',
    'ol',
    'li',
    'a',
    'code',
    'pre',
    'h1',
    'h2',
    'h3',
    'h4',
    'blockquote',
    'img',
    'span',
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'style'],
};

export function sanitizeRichHtml(rawHtml: string): string {
  return DOMPurify.sanitize(rawHtml, sanitizeConfig);
}

export function stripHtmlToText(rawHtml: string): string {
  const sanitized = sanitizeRichHtml(rawHtml);
  const doc = new DOMParser().parseFromString(sanitized, 'text/html');
  return (doc.body.textContent || '').trim();
}
