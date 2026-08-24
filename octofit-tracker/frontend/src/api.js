export function getCodespaceName() {
  const value = import.meta.env.VITE_CODESPACE_NAME;
  return typeof value === 'string' ? value.trim() : '';
}

export function getApiBaseUrl() {
  const codespaceName = getCodespaceName();

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }

  return 'http://localhost:8000';
}

export function buildApiUrl(component) {
  const safeComponent = String(component ?? '').trim().replace(/^\/+|\/+$/g, '');

  if (!safeComponent) {
    return `${getApiBaseUrl()}/api/`;
  }

  return `${getApiBaseUrl()}/api/${safeComponent}/`;
}

export function normalizeApiRecords(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  if (Array.isArray(payload.results)) {
    return payload.results;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload.items)) {
    return payload.items;
  }

  return [];
}
