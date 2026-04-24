export type ValidationResult = true | string;

export class SetupValueValidator {
  static host(raw: string): ValidationResult {
    const value = raw.trim();
    if (value.length === 0) {
      return true;
    }
    if (/\s/.test(value)) {
      return 'must not contain whitespace';
    }
    try {
      const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
      if (!url.hostname) {
        return 'must include a host name';
      }
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return 'must use http or https';
      }
      return true;
    } catch {
      return 'enter a host name or http(s) URL';
    }
  }

  static apiBasePath(raw: string): ValidationResult {
    const value = raw.trim();
    if (value.length === 0) {
      return true;
    }
    if (/\s/.test(value)) {
      return 'must not contain whitespace';
    }
    if (/^https?:\/\//i.test(value)) {
      try {
        new URL(value);
        return true;
      } catch {
        return 'enter a valid http(s) URL';
      }
    }
    return value.startsWith('/') ? true : 'enter a path starting with / or a full http(s) URL';
  }

  static token(raw: string): ValidationResult {
    const value = raw.trim();
    if (value.length === 0) {
      return true;
    }
    return /\s/.test(value) ? 'must not contain whitespace' : true;
  }

  static pageSize(raw: string): ValidationResult {
    const trimmed = raw.trim();
    return /^\d+$/.test(trimmed) && Number.parseInt(trimmed, 10) > 0
      ? true
      : 'enter a positive integer';
  }
}
