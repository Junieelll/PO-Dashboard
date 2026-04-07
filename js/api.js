// ══════════════════════════════════════════════════════════
//  api.js — Thin API client for PO Dashboard
// ══════════════════════════════════════════════════════════

const API = window.location.origin;

function headers() {
  const h = { 'Content-Type': 'application/json' };
  const t = localStorage.getItem('po_token');
  if (t) h['Authorization'] = `Bearer ${t}`;
  return h;
}

async function request(method, path, body) {
  const opts = { method, headers: headers() };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API}${path}`, opts);
  
  let data;
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    // If server returns HTML (e.g. 502 Bad Gateway when crashed)
    const text = await res.text();
    throw new Error(`Server returned ${res.status} (Not JSON): ` + (text.slice(0, 50) || 'Empty response'));
  }

  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const auth = {
  register: (d) => request('POST', '/auth/register', d),
  login:    (d) => request('POST', '/auth/login', d),
  me:       ()  => request('GET',  '/auth/me'),
};

export const sheets = {
  list:     ()      => request('GET',    '/sheets'),
  create:   (name)  => request('POST',   '/sheets', { name }),
  rename:   (id, n) => request('PATCH',  `/sheets/${id}`, { name: n }),
  remove:   (id)    => request('DELETE', `/sheets/${id}`),
  loadFull: (id)    => request('GET',    `/sheets/${id}/full`),
};

export const data = {
  saveRows:      (id, cellData, purchaseOrders) => request('PUT', `/data/${id}/rows`, { cellData, purchaseOrders }),
  saveColumns:   (id, columns)  => request('PUT', `/data/${id}/columns`, { columns }),
  saveThreshold: (id, thr)      => request('PUT', `/data/${id}/threshold`, thr),
  saveEmail:     (id, cfg)      => request('PUT', `/data/${id}/email`, cfg),
  logAlert:      (id, d)        => request('POST', `/data/${id}/alert-log`, d),
  clearAlerts:   (id)           => request('DELETE', `/data/${id}/alert-log`),
};

export const email = {
  sendAlert: (d)  => request('POST', '/email/send-alert', d),
  test:      (to) => request('POST', '/email/test-email', { to }),
};

export const share = {
  list:      (id)    => request('GET',    `/share/${id}`),
  create:    (id, d) => request('POST',   `/share/${id}`, d),
  revoke:    (id)    => request('DELETE',  `/share/${id}`),
  revokeOne: (id, t) => request('DELETE',  `/share/${id}/${t}`),
  update:    (id, t, d) => request('PATCH',   `/share/${id}/${t}`, d),
  view:      (token) => request('GET',     `/share/view/${token}`),
};