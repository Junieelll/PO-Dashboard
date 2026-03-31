// ══════════════════════════════════════════════════════════
//  PO Dashboard — Main Application
// ══════════════════════════════════════════════════════════

import * as api from './api.js';

// ── Heroicons (outline, 24×24) ───────────────────────────
const I = {
  bolt:       `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>`,
  plus:       `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>`,
  arrowDown:  `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>`,
  cog:        `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  envelope:   `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>`,
  share:      `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"/></svg>`,
  xMark:      `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`,
  clipboard:  `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"/></svg>`,
  inbox:      `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-17.399 0V6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 0112.214 0c1.131.094 1.976 1.057 1.976 2.192V13.5M2.25 13.5V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.5"/></svg>`,
  excTriangle:`<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>`,
  checkCircle:`<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  logout:     `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/></svg>`,
  trash:      `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>`,
  bellAlert:  `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>`,
  chartBar:   `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>`,
  eye:        `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  eyeSlash:   `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c1.685 0 3.267-.42 4.65-1.158M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>`,
  sun:        `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/></svg>`,
  moon:       `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>`,
  clipCopy:   `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"/></svg>`,
  chevDown:   `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>`,
  document: `<svg class="ico" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clip-rule="evenodd" />
  <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
</svg>
`
};

// ── State ────────────────────────────────────────────────
let user       = null;
let sheets     = [];
let activeSheet = null;
let columns    = [];
let cellData   = [];
let thresholds = { '*': { danger: 0, warn: 1000 } };
let emailCfg   = { to: '', name: 'PO Tracker System', subj: '[ALERT] PO Balance Warning' };
let alertLog   = [];
let saveTimer  = null;
let lastAlertKey = '';

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const app = () => $('#app');

// ── Tailwind class constants ─────────────────────────────
const TW = {
  overlay: 'fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-[1000] anim-fadeIn p-6',
  modal: 'bg-surface border border-line rounded-[28px] p-9 w-full max-w-[480px] anim-scaleIn shadow-lg',
  modalH2: 'text-base font-semibold mb-1 tracking-tight flex items-center gap-2.5 [&_.ico]:w-[22px] [&_.ico]:h-[22px] [&_.ico]:align-[-4px] [&_.ico]:text-accent-2',
  modalSub: 'text-txt-3 text-[13px] mb-6 font-normal',
  modalActions: 'flex justify-end gap-2.5 mt-7',
  field: 'mb-[18px]',
  label: 'block text-[11px] font-semibold text-txt-2 uppercase tracking-[0.6px] mb-[7px]',
  input: 'w-full bg-surface-2 border-[1.5px] border-line rounded-xl py-[11px] px-3.5 text-txt text-[13px] font-normal outline-none transition-all duration-200 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-glow)] placeholder:text-txt-3',
  ghostBtn: 'inline-flex items-center justify-center gap-1.5 px-[22px] py-[9px] border border-line rounded-xl font-semibold text-[13px] cursor-pointer transition-all duration-200 whitespace-nowrap bg-surface-2 text-txt-2 hover:bg-surface-3 hover:text-txt hover:border-line-lit min-w-[96px]',
  primaryBtn: 'inline-flex items-center justify-center gap-1.5 px-[22px] py-[9px] border-none rounded-xl font-semibold text-[13px] cursor-pointer transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-accent to-[#ef4444] text-white min-w-[96px] shadow-[0_4px_16px_rgba(124,92,252,0.25)] hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(124,92,252,0.35)]',
  dangerBtn: 'inline-flex items-center justify-center gap-1.5 px-[22px] py-[9px] border border-danger/[0.18] rounded-xl font-semibold text-[13px] cursor-pointer transition-all duration-200 whitespace-nowrap bg-danger/[0.08] text-danger hover:bg-danger/[0.15] min-w-[96px]',
};

// ══════════════════════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════════════════════
function toast(msg, type = 'ok') {
  const el = document.createElement('div');
  const bc = { ok: 'border-l-ok', warn: 'border-l-warn', danger: 'border-l-danger' }[type] || '';
  el.className = `py-3.5 px-5 bg-surface border border-line border-l-[3px] ${bc} rounded-xl text-[13px] text-txt font-medium anim-toastIn pointer-events-auto max-w-[380px] shadow-lg`;
  el.textContent = msg;
  $('#toast-container').appendChild(el);
  setTimeout(() => { el.classList.remove('anim-toastIn'); el.classList.add('anim-toastOut'); setTimeout(() => el.remove(), 300); }, 3000);
}

// ══════════════════════════════════════════════════════════
//  AUTH
// ══════════════════════════════════════════════════════════
function renderAuth(isLogin = true) {
  const fieldCls = 'mb-[18px]';
  const labelCls = 'block text-[11px] font-semibold text-txt-2 uppercase tracking-[0.6px] mb-[7px]';
  const inputCls = 'w-full bg-surface-2 border-[1.5px] border-line rounded-xl py-[11px] px-3.5 text-txt text-[13px] font-normal outline-none transition-all duration-200 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-glow)] placeholder:text-txt-3 placeholder:font-normal';
  app().innerHTML = `
  <div class="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Decorative orbs -->
    <div class="absolute top-[8%] left-[10%] w-80 h-80 bg-accent/10 rounded-full blur-[100px] anim-orbDrift pointer-events-none"></div>
    <div class="absolute bottom-[12%] right-[8%] w-72 h-72 bg-teal/[0.06] rounded-full blur-[80px] anim-float1 pointer-events-none"></div>
    <div class="absolute top-[45%] left-[55%] w-40 h-40 bg-accent-2/[0.08] rounded-full blur-[60px] anim-float2 pointer-events-none"></div>
    <!-- Geometric shapes -->
    <svg class="absolute top-[18%] right-[22%] w-4 h-4 text-accent/30 anim-float1" viewBox="0 0 16 16"><rect width="10" height="10" x="3" y="3" rx="2" fill="currentColor" transform="rotate(45 8 8)"/></svg>
    <svg class="absolute bottom-[28%] left-[18%] w-3 h-3 text-teal/25 anim-float2" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="currentColor"/></svg>
    <svg class="absolute top-[35%] right-[32%] w-2.5 h-2.5 text-accent-2/20 anim-float1" viewBox="0 0 10 10"><polygon points="5,0 10,10 0,10" fill="currentColor"/></svg>
    <svg class="absolute bottom-[40%] right-[45%] w-5 h-5 text-accent/[0.12] anim-float2" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>

    <div class="bg-surface border border-line rounded-[28px] py-12 px-10 w-full max-w-[420px] shadow-lg anim-fadeUp relative z-10">
      
      <div class="flex flex-col items-center gap-2.5 mb-3">
        <span class="[&_.ico]:w-[26px] [&_.ico]:h-[26px] [&_.ico]:text-accent">${I.document}</span>
        <h1 class="text-[20px] font-semibold text-accent tracking-tight mb-1 flex items-center gap-2.5">
          Joanne's PO Tracker
        </h1>
      </div>
      <p class="text-txt-3 text-[13px] mb-8 font-normal">${isLogin ? 'Sign in to continue' : 'Create your account'}</p>
      <div id="auth-err"></div>
      ${!isLogin ? `<div class="${fieldCls}"><label class="${labelCls}">Username</label><input id="a-user" placeholder="johndoe" autocomplete="username" class="${inputCls}"/></div>` : ''}
      ${!isLogin ? `<div class="${fieldCls}"><label class="${labelCls}">Email</label><input id="a-email" type="email" placeholder="john@example.com" class="${inputCls}"/></div>` : ''}
      ${isLogin ? `<div class="${fieldCls}"><label class="${labelCls}">Username or Email</label><input id="a-user" placeholder="johndoe" autocomplete="username" class="${inputCls}"/></div>` : ''}
      <div class="${fieldCls}"><label class="${labelCls}">Password</label><div class="relative"><input id="a-pass" type="password" placeholder="••••••" autocomplete="${isLogin ? 'current-password' : 'new-password'}" class="${inputCls} pr-11"/><button type="button" class="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-txt-3 cursor-pointer p-1 rounded-lg flex items-center justify-center transition-all duration-200 hover:text-txt hover:bg-surface-3 [&_.ico]:w-[18px] [&_.ico]:h-[18px] [&_.ico]:align-[0]" id="pw-toggle" title="Show password">${I.eye}</button></div></div>
      <button class="inline-flex items-center justify-center gap-1.5 border-none rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200 whitespace-nowrap bg-gradient-to-br from-accent to-accent-2 text-white w-full py-[13px] mt-2 shadow-[0_4px_16px_rgba(124,92,252,0.25)] hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(124,92,252,0.35)] active:translate-y-0" id="a-submit">${isLogin ? 'Sign In' : 'Create Account'}</button>
      <div class="text-center mt-5 text-[13px] text-txt-3">
        ${isLogin
          ? 'No account? <a id="a-toggle" class="text-accent-2 cursor-pointer no-underline font-semibold hover:underline">Register</a>'
          : 'Already have one? <a id="a-toggle" class="text-accent-2 cursor-pointer no-underline font-semibold hover:underline">Sign In</a>'}
      </div>
    </div>
  </div>`;

  $('#a-toggle').onclick = () => renderAuth(!isLogin);
  $('#a-submit').onclick = () => doAuth(isLogin);
  app().querySelectorAll('input').forEach(inp => {
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') doAuth(isLogin); });
  });
  setTimeout(() => $('#a-user')?.focus(), 100);

  $('#pw-toggle').onclick = () => {
    const inp = $('#a-pass');
    const btn = $('#pw-toggle');
    if (inp.type === 'password') { inp.type = 'text'; btn.innerHTML = I.eyeSlash; btn.title = 'Hide password'; }
    else { inp.type = 'password'; btn.innerHTML = I.eye; btn.title = 'Show password'; }
  };
}

async function doAuth(isLogin) {
  const btn = $('#a-submit');
  btn.disabled = true; btn.textContent = 'Please wait…';
  const errEl = $('#auth-err');
  errEl.innerHTML = '';
  try {
    const username = $('#a-user').value.trim();
    const password = $('#a-pass').value;
    let res;
    if (isLogin) { res = await api.auth.login({ username, password }); }
    else {
      const email = $('#a-email').value.trim();
      res = await api.auth.register({ username, email, password });
    }
    localStorage.setItem('po_token', res.token);
    user = res.user;
    boot();
  } catch (err) {
    errEl.innerHTML = `<div class="bg-danger/[0.08] border border-danger/[0.18] text-danger rounded-xl py-2.5 px-3.5 text-[13px] mb-4 anim-shake">${esc(err.message)}</div>`;
    btn.disabled = false;
    btn.textContent = isLogin ? 'Sign In' : 'Create Account';
  }
}

// ══════════════════════════════════════════════════════════
//  BOOT
// ══════════════════════════════════════════════════════════
async function boot() {
  try {
    if (!user) { const me = await api.auth.me(); user = me; }
  } catch {
    localStorage.removeItem('po_token');
    renderAuth();
    return;
  }
  try {
    sheets = await api.sheets.list();
    if (sheets.length) { activeSheet = sheets[0].id; await loadSheet(activeSheet); }
    renderApp();
  } catch (err) {
    toast('Failed to load data: ' + err.message, 'danger');
    renderApp();
  }
}

async function loadSheet(id) {
  const d = await api.sheets.loadFull(id);
  columns    = d.columns;
  cellData   = d.cellData || [];
  thresholds = d.thresholds && Object.keys(d.thresholds).length ? d.thresholds : { '*': { danger: 0, warn: 1000 } };
  emailCfg   = d.emailSettings || { to: '', name: 'PO Tracker System', subj: '[ALERT] PO Balance Warning' };
  alertLog   = d.alertLog || [];
  activeSheet = id;
  lastAlertKey = '';
  recomputeAllBalances();
  
  const al = getAlertRows();
  lastAlertKey = al.length ? al.map(a => `${a.po}:${a.level}:${a.bv}`).join('|') : '';
}

function getThreshold(po) {
  return thresholds[po] || thresholds['*'] || { danger: 0, warn: 1000 };
}

// ══════════════════════════════════════════════════════════
//  RENDER APP
// ══════════════════════════════════════════════════════════
function renderApp() {
  const initial = user.username.charAt(0).toUpperCase();
  const isDark = !document.body.classList.contains('light');
  app().innerHTML = `
  <div class="flex flex-col min-h-screen anim-fadeIn relative">
    <!-- Background decoration -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute -top-32 -right-32 w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-[120px] anim-orbDrift"></div>
      <div class="absolute bottom-0 left-[15%] w-80 h-80 bg-teal/[0.03] rounded-full blur-[100px] anim-float2"></div>
      <svg class="absolute top-[30%] right-[5%] w-3 h-3 text-accent/[0.15] anim-float1" viewBox="0 0 12 12"><rect width="8" height="8" x="2" y="2" rx="1.5" fill="currentColor" transform="rotate(45 6 6)"/></svg>
      <svg class="absolute top-[70%] left-[8%] w-2.5 h-2.5 text-teal/[0.12] anim-float2" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="currentColor"/></svg>
    </div>

    <header class="flex items-center justify-between px-7 h-[60px] bg-surface border-b border-line sticky top-0 z-[100] transition-colors duration-300 shadow-sm topbar-responsive relative">
      <div class="flex items-center text-accent gap-2.5 font-bold text-base tracking-tight [&_.ico]:w-[18px] [&_.ico]:h-[18px] [&_.ico]:text-accent">
        <span class="[&_.ico]:w-[18px] [&_.ico]:h-[18px] [&_.ico]:text-accent">${I.document}</span> Joanne's PO Tracker
        <div class="w-2 h-2 bg-accent rounded-full anim-pulse shadow-[0_0_8px_rgba(124,92,252,0.5)]"></div>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2 py-[5px] px-3.5 pl-[5px]">
          <div class="w-7 h-7 bg-gradient-to-br from-accent to-rose-600 rounded-full flex items-center justify-center text-[11px] font-bold text-white">${initial}</div>
          ${esc(user.username)}
        </div>
        <div class="alert-wrap relative" id="alert-wrap">
          <button class="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-semibold text-[13px] cursor-pointer transition-all duration-200 whitespace-nowrap bg-surface-2 text-txt-2 hover:bg-surface-3 hover:text-txt hover:border-line-lit relative" id="btn-alerts" title="Alert Notifications">${I.bellAlert}</button>
          <div class="alert-popover" id="alert-popover">
            <div class="py-3.5 px-[18px] border-b border-line flex justify-between items-center bg-surface-2 rounded-t-[20px]">
              <strong class="text-[13px] flex items-center gap-2 text-txt [&_.ico]:w-4 [&_.ico]:h-4 [&_.ico]:text-accent">${I.bellAlert} Notifications</strong>
              <div class="flex items-center gap-3">
                <button class="bg-transparent border-none text-[10px] uppercase font-bold text-txt-3 hover:text-danger cursor-pointer transition-colors" id="btn-clear-alerts">Clear All</button>
                <button class="bg-transparent border-none text-txt-3 cursor-pointer hover:text-danger hover:scale-110 transition-all duration-200 [&_.ico]:w-[18px] [&_.ico]:h-[18px]" id="btn-close-alerts" title="Close">${I.xMark}</button>
              </div>
            </div>
            <div class="p-3 flex-1 max-h-[400px] overflow-y-auto" id="alert-popover-body"></div>
          </div>
        </div>
        <button class="bg-surface-2 text-txt-2 cursor-pointer px-3 py-2.5 rounded-[10px] flex items-center justify-center transition-all duration-200 hover:bg-surface-3 hover:text-txt hover:border-line-lit [&_.ico]:w-[18px] [&_.ico]:h-[18px] [&_.ico]:align-[0]" id="btn-theme" title="Toggle theme">${isDark ? I.sun : I.moon}</button>
        <button class="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 border border-red-500 rounded-[10px] font-semibold text-xs cursor-pointer transition-all duration-200 whitespace-nowrap text-red-500 hover:bg-red-500/10 [&_.ico]:w-4 [&_.ico]:h-4 [&_.ico]:align-[-2px]" id="btn-logout">${I.logout} Logout</button>
      </div>
    </header>
    <div class="flex items-center gap-[3px] px-7 py-2.5 bg-surface border-b border-line overflow-x-auto transition-colors duration-300 tab-bar-responsive" id="tab-bar"></div>
    <div class="flex-1 p-7 max-w-[1000px] mx-auto w-full relative z-10 content-responsive">
      <div id="toolbar-section"></div>
      <div id="dashboard-section"></div>
    </div>
  </div>`;

  $('#btn-logout').onclick = () => { localStorage.removeItem('po_token'); user = null; renderAuth(); };
  $('#btn-theme').onclick = () => {
    document.body.classList.toggle('light');
    const isNowLight = document.body.classList.contains('light');
    localStorage.setItem('po_theme', isNowLight ? 'light' : 'dark');
    $('#btn-theme').innerHTML = isNowLight ? I.moon : I.sun;
  };

  $('#btn-alerts').onclick = (e) => {
    e.stopPropagation();
    const wrap = $('#alert-wrap');
    if (!wrap.classList.contains('open')) {
      wrap.classList.add('open');
      if (alertLog.length > 0) {
        localStorage.setItem(`po_alert_seen_time_${activeSheet}`, Date.now().toString());
        renderAlertLog(); // Clear badge
      }
    } else {
      wrap.classList.remove('open');
    }
  };
  $('#btn-close-alerts').onclick = (e) => {
    e.stopPropagation();
    $('#alert-wrap').classList.remove('open');
  };
  
  if (!window._alertClickBound) {
    document.addEventListener('click', (e) => {
      const wrap = $('#alert-wrap');
      if (wrap && wrap.classList.contains('open') && !wrap.contains(e.target)) {
        wrap.classList.remove('open');
      }
    });
    
    $('#btn-clear-alerts').onclick = async () => {
      if (!activeSheet || alertLog.length === 0) return;
      try {
        await api.data.clearAlerts(activeSheet);
        alertLog = [];
        renderAlertLog();
        toast('Alert logs cleared', 'ok');
      } catch (err) {
        toast('Failed to clear logs', 'danger');
      }
    };
    
    window._alertClickBound = true;
  }

  renderTabs();
  renderToolbar();
  renderDashboard();
  renderAlertLog();
  checkAutoAlert();
}

// ══════════════════════════════════════════════════════════
//  TABS
// ══════════════════════════════════════════════════════════
function renderTabs() {
  const el = $('#tab-bar');
  el.innerHTML = sheets.map(s => `
    <button class="py-2 px-[18px] text-xs font-medium text-txt-3 bg-transparent border-none rounded-[10px] cursor-pointer transition-all duration-200 whitespace-nowrap relative hover:text-txt-2 hover:bg-surface-2 ${s.id === activeSheet ? '!text-txt !bg-surface-3 !font-semibold tab-active' : ''}" data-id="${s.id}">${esc(s.name)}</button>
  `).join('') + '<button class="w-[30px] h-[30px] flex items-center justify-center bg-transparent border-[1.5px] border-dashed border-line rounded-[10px] text-txt-3 cursor-pointer text-base transition-all duration-200 ml-1 hover:border-accent hover:text-accent hover:bg-accent/[0.06]" id="tab-add" title="New sheet">+</button>';

  el.querySelectorAll('button[data-id]').forEach(btn => {
    btn.onclick = async () => {
      if (Number(btn.dataset.id) === activeSheet) return;
      await loadSheet(Number(btn.dataset.id));
      renderTabs(); renderToolbar(); renderDashboard(); renderAlertLog();
    };
    btn.ondblclick = () => renameSheet(Number(btn.dataset.id), btn.textContent.trim());
    btn.oncontextmenu = (e) => { e.preventDefault(); if (sheets.length > 1) deleteSheet(Number(btn.dataset.id), btn.textContent.trim()); };
  });

  $('#tab-add').onclick = () => showModal('New Sheet', 'Sheet name', 'Sheet' + (sheets.length + 1), async (name) => {
    const s = await api.sheets.create(name);
    sheets.push(s);
    await loadSheet(s.id);
    renderTabs(); renderToolbar(); renderDashboard(); renderAlertLog();
    toast(`Created "${name}"`, 'ok');
  });
}

async function renameSheet(id, currentName) {
  showModal('Rename Sheet', 'New name', currentName, async (name) => {
    await api.sheets.rename(id, name);
    const s = sheets.find(x => x.id === id); if (s) s.name = name;
    renderTabs();
    toast(`Renamed to "${name}"`, 'ok');
  });
}

function deleteSheet(id, name) {
  showConfirm(`Delete "${name}"?`, 'This will permanently remove the sheet and all its data.', async () => {
    await api.sheets.remove(id);
    sheets = sheets.filter(s => s.id !== id);
    if (activeSheet === id) { activeSheet = sheets[0]?.id; if (activeSheet) await loadSheet(activeSheet); }
    renderTabs(); renderToolbar(); renderDashboard(); renderAlertLog();
    toast(`Deleted "${name}"`, 'warn');
  });
}

// ══════════════════════════════════════════════════════════
//  TOOLBAR
// ══════════════════════════════════════════════════════════
function renderToolbar() {
  const ghostBtn = 'inline-flex items-center justify-center gap-1.5 px-3.5 py-2 border border-line rounded-[10px] font-semibold text-xs cursor-pointer transition-all duration-200 whitespace-nowrap bg-surface-2 text-txt-2 hover:bg-surface-3 hover:text-txt hover:border-line-lit [&_.ico]:w-4 [&_.ico]:h-4 [&_.ico]:align-[-2px]';
  $('#toolbar-section').innerHTML = `
  <div class="flex items-center justify-between mb-5 flex-wrap gap-2.5">
    <div class="flex items-center gap-2">
      <button class="${ghostBtn}" id="btn-add-entry">${I.plus} New Entry</button>
      <button class="${ghostBtn}" id="btn-export">${I.arrowDown} Export CSV</button>
    </div>
    <div class="flex items-center gap-2">
      <button class="${ghostBtn}" id="btn-email">${I.envelope} Email</button>
      <button class="${ghostBtn}" id="btn-share">${I.share} Share</button>
    </div>
  </div>`;

  $('#btn-add-entry').onclick = addEntry;
  $('#btn-export').onclick = exportCSV;
  $('#btn-email').onclick = openEmailModal;
  $('#btn-share').onclick = openShareModal;
}

// ══════════════════════════════════════════════════════════
//  DASHBOARD — PO Card Layout
// ══════════════════════════════════════════════════════════
function groupByPO() {
  const groups = {};
  const order = [];
  cellData.forEach((row, idx) => {
    const po = row.po_number || 'Unassigned';
    if (!groups[po]) { groups[po] = []; order.push(po); }
    groups[po].push({ ...row, _idx: idx });
  });
  return { groups, order };
}

function renderDashboard() {
  const { groups, order } = groupByPO();
  const section = $('#dashboard-section');

  if (!cellData.length) {
    section.innerHTML = `
      <div class="text-center py-16 px-6 text-txt-3" style="margin-top:60px">
        <div class="mb-4 flex justify-center [&_.ico]:w-14 [&_.ico]:h-14 [&_.ico]:text-txt-3 [&_.ico]:opacity-40">${I.inbox}</div>
        <p class="text-[13px] mb-5 font-normal">No PO entries yet</p>
        <button class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 border border-line rounded-[10px] font-semibold text-xs cursor-pointer transition-all duration-200 whitespace-nowrap bg-surface-2 text-txt-2 hover:bg-surface-3 hover:text-txt hover:border-line-lit [&_.ico]:w-4 [&_.ico]:h-4 [&_.ico]:align-[-2px]" id="btn-empty-add">${I.plus} Add first entry</button>
      </div>`;
    section.querySelector('#btn-empty-add')?.addEventListener('click', addEntry);
    return;
  }

  let html = '<div class="flex flex-col gap-6">';
  order.forEach(poNum => {
    const entries = groups[poNum];
    const startQty = parseNum(entries[0]?.starting_qty);           // original PO qty
    const lastEntry = entries[entries.length - 1];
    const lastBal = parseNum(lastEntry?.running_balance) || 0;
    const totalUsed = isNaN(startQty) ? 0 : startQty - lastBal;
    const pct = startQty > 0 ? Math.min(100, Math.round((totalUsed / startQty) * 100)) : 0;

    const thr = getThreshold(poNum);
    let status = 'ok';
    if (lastBal <= thr.danger) status = 'danger';
    else if (lastBal <= thr.warn) status = 'warn';

    const statColor = { ok: 'text-ok', warn: 'text-warn', danger: 'text-danger' }[status];
    const thCls = 'py-3 px-4 text-[10px] font-semibold text-txt-3 uppercase tracking-[0.6px] text-left border-b border-line bg-transparent whitespace-nowrap';

    html += `
    <div class="po-card bg-surface rounded-[28px] overflow-hidden anim-fadeUp transition-all duration-300 shadow-sm hover:border-line-lit hover:shadow-md" data-po="${esc(poNum)}">
      <div class="flex items-center justify-between py-6 px-7 flex-wrap gap-4 bg-gradient-to-br from-surface to-surface-2 border-b border-line">
        <div class="flex flex-col gap-1">
          <div class="text-xl font-bold tracking-tight text-txt flex items-center">
            <span class="text-xs text-txt-3 font-medium mr-3 bg-rose-400 px-2.5 py-1 rounded-full text-white">P.O. NUMBER</span>${esc(poNum)}
          </div>
          <div class="text-xs text-txt-3 font-medium flex items-center gap-3">
            <span>${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}</span>
            <button class="bg-transparent border-none text-rose-400 hover:text-rose-500 cursor-pointer flex items-center gap-1 text-[10px] uppercase font-bold tracking-wide transition-colors po-thr-btn" data-po="${esc(poNum)}">${I.cog} Set Threshold</button>
            <button class="bg-transparent border-none text-txt-3 hover:text-danger cursor-pointer flex items-center gap-1 text-[10px] uppercase font-bold tracking-wide transition-colors po-del-btn" data-po="${esc(poNum)}">${I.trash} Delete PO</button>
          </div>
        </div>
        <div class="flex gap-9">
          <div class="flex flex-col gap-[3px] text-right">
            <span class="text-[10px] font-semibold text-txt-3 uppercase tracking-[0.7px]">Starting Qty</span>
            <span class="po-stat-value text-[22px] font-bold tabular-nums tracking-tight">${isNaN(startQty) ? '--' : fmt(startQty)}</span>
          </div>
          <div class="flex flex-col gap-[3px] text-right">
            <span class="text-[10px] font-semibold text-txt-3 uppercase tracking-[0.7px]">Remaining</span>
            <span class="po-stat-value text-[22px] font-bold tabular-nums tracking-tight ${statColor}">${fmt(lastBal)}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3.5 py-3.5 px-7 bg-surface-2">
        <div class="flex-1 h-[7px] bg-surface-3 rounded-lg overflow-hidden"><div class="progress-${status} h-full rounded-lg transition-all duration-700" style="width:${pct}%"></div></div>
        <span class="text-[11px] font-semibold text-txt-3 whitespace-nowrap min-w-[64px] text-right">${pct}% hauled</span>
      </div>
      <div class="overflow-x-auto">
        <table class="po-table w-full border-collapse tabular-nums m-0">
          <thead><tr>
            <th class="${thCls} w-10 px-2 text-center">
              <label class="relative flex items-center justify-center shrink-0 cursor-pointer group mx-auto w-max">
                <input type="checkbox" data-master-po="${esc(poNum)}" onchange="window._checkMasterPO(this, '${esc(poNum)}')" class="cb-master peer appearance-none w-[16px] h-[16px] border-[1.5px] border-line rounded bg-surface checked:bg-accent checked:border-accent transition-all cursor-pointer group-hover:border-accent/[0.5]"/>
                <svg class="absolute inset-0 w-full h-full text-white pointer-events-none opacity-0 scale-50 peer-checked:opacity-100 peer-checked:scale-100 transition-all p-[2px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              </label>
            </th>
            <th class="${thCls} text-center w-11 min-w-[44px]">#</th>
            <th class="${thCls}">Hauling Date</th>
            <th class="${thCls} !text-right">Quantity</th>
            <th class="${thCls} !text-right">Running Balance</th>
            <th class="${thCls}">Invoice No.</th>
            <th class="${thCls}"></th>
          </tr></thead>
          <tbody>
            ${entries.map((e, ei) => {
              const bal = parseNum(e.running_balance);
              let rowCls = '';
              const thr = getThreshold(poNum);
              if (!isNaN(bal) && bal <= thr.danger) rowCls = 'row-danger';
              else if (!isNaN(bal) && bal <= thr.warn) rowCls = 'row-warn';
              const balColor = rowCls ? (rowCls === 'row-danger' ? 'text-danger' : 'text-warn') : (bal > 0 ? 'text-ok' : '');
              return `<tr class="${rowCls} transition-colors duration-200 hover:bg-surface-2" data-ri="${e._idx}">
                <td class="w-10 px-2 border-b border-line align-middle text-center">
                  <label class="relative flex items-center justify-center shrink-0 cursor-pointer group mx-auto w-max">
                    <input type="checkbox" data-ri="${e._idx}" data-po="${esc(poNum)}" class="cb-row peer appearance-none w-[16px] h-[16px] border-[1.5px] border-line rounded bg-surface checked:bg-accent checked:border-accent transition-all cursor-pointer group-hover:border-accent/[0.5]" onchange="window._checkRow(this)"/>
                    <svg class="absolute inset-0 w-full h-full text-white pointer-events-none opacity-0 scale-50 peer-checked:opacity-100 peer-checked:scale-100 transition-all p-[2px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </label>
                </td>
                <td class="text-txt-3 text-[11px] font-medium text-center w-11 min-w-[44px] border-b border-line">${ei + 1}</td>
                <td class="p-0 border-b border-line text-[13px] h-[46px] align-middle"><div class="cell-wrap py-2 px-4 min-h-[46px] flex items-center cursor-text transition-colors duration-200 border-2 border-transparent hover:bg-accent/[0.03]"><span class="date-cell cursor-pointer text-[13px] text-txt font-normal py-0.5 px-1 rounded-md transition-colors duration-150 whitespace-nowrap hover:bg-accent/[0.06] hover:text-accent-2" data-ri="${e._idx}" tabindex="0">${formatDateDisplay(e.hauling_date) || '<span class="text-txt-3">Pick date</span>'}</span></div></td>
                <td class="p-0 border-b border-line text-[13px] h-[46px] align-middle"><div class="cell-wrap py-2 px-4 min-h-[46px] flex items-center justify-end cursor-text transition-colors duration-200 border-2 border-transparent hover:bg-accent/[0.03]"><input class="cell-input bg-transparent border-none outline-none text-txt text-[13px] font-normal w-full tabular-nums text-right placeholder:text-txt-3" value="${numDisplay(e.quantity)}" data-ri="${e._idx}" data-col="quantity" placeholder="0" inputmode="decimal"/></div></td>
                <td class="p-0 border-b border-line text-[13px] h-[46px] align-middle"><div class="cell-wrap py-2 px-4 min-h-[46px] flex items-center justify-end cursor-text transition-colors duration-200 border-2 border-transparent"><span class="cell-readonly font-semibold text-[13px] ${balColor}" data-computed="balance" data-ri="${e._idx}">${isNaN(bal) ? '' : fmt(bal)}</span></div></td>
                <td class="p-0 border-b border-line text-[13px] h-[46px] align-middle"><div class="cell-wrap py-2 px-4 min-h-[46px] flex items-center cursor-text transition-colors duration-200 border-2 border-transparent hover:bg-accent/[0.03]"><input class="cell-input bg-transparent border-none outline-none text-txt text-[13px] font-normal w-full placeholder:text-txt-3" value="${esc(e.invoice_no || '')}" data-ri="${e._idx}" data-col="invoice_no" placeholder="Invoice #"/></div></td>
                <td class="w-11 text-center border-b border-line"><button class="row-del bg-transparent border-none text-txt-3 cursor-pointer p-[5px] rounded-lg transition-all duration-200 [&_.ico]:w-[15px] [&_.ico]:h-[15px] hover:text-danger hover:bg-danger/10" data-ri="${e._idx}" title="Delete">${I.trash}</button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
      <div class="py-3.5 px-7 flex justify-start">
        <button class="po-add-entry inline-flex items-center justify-center gap-1.5 px-3.5 py-2 border border-line rounded-[10px] font-semibold text-xs cursor-pointer transition-all duration-200 whitespace-nowrap bg-surface-2 text-txt-2 hover:bg-surface-3 hover:text-txt hover:border-line-lit [&_.ico]:w-4 [&_.ico]:h-4 [&_.ico]:align-[-2px]" data-po="${esc(poNum)}">${I.plus} Add hauling to this PO</button>
      </div>
    </div>`;
  });
  html += '</div>';
  section.innerHTML = html;

  // Bind events
  $$('.cell-input').forEach(inp => {
    inp.addEventListener('change', onCellChange);
    inp.addEventListener('blur', onCellBlur);
  });
  $$('.row-del').forEach(btn => { btn.onclick = () => deleteRow(Number(btn.dataset.ri)); });
  $$('.po-add-entry').forEach(btn => { btn.onclick = () => addEntryToPO(btn.dataset.po); });
  $$('.po-thr-btn').forEach(btn => { btn.onclick = () => openThresholdModal(btn.dataset.po); });
  $$('.po-del-btn').forEach(btn => { btn.onclick = () => deletePO(btn.dataset.po); });

  // Bind date cells to shared datepicker
  initTableDatepickers();

  // Ensure FAB resets on render
  if (window.updateFAB) window.updateFAB();
}

// ── Batch Delete Logic ──────────────────────────────────
window.updateFAB = () => {
  const count = document.querySelectorAll('.cb-row:checked').length;
  const fab = document.getElementById('fab-container');
  const countEl = document.getElementById('fab-count');
  if (!fab) return;
  if (count > 0) {
    countEl.textContent = count;
    fab.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    fab.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
  } else {
    fab.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
    fab.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
  }
};

window._checkRow = (cb) => {
  const po = cb.dataset.po;
  if (!cb.checked) {
    const master = document.querySelector(`.cb-master[data-po="${po}"]`);
    if (master) master.checked = false;
  } else {
    const allRows = document.querySelectorAll(`.cb-row[data-po="${po}"]`);
    const checkedRows = document.querySelectorAll(`.cb-row[data-po="${po}"]:checked`);
    const master = document.querySelector(`.cb-master[data-po="${po}"]`);
    if (master && allRows.length === checkedRows.length) master.checked = true;
  }
  window.updateFAB();
};

window._checkMasterPO = (masterCb, poStr) => {
  const childCbs = document.querySelectorAll(`.cb-row[data-po="${poStr}"]`);
  childCbs.forEach(cb => cb.checked = masterCb.checked);
  window.updateFAB();
};

document.addEventListener('DOMContentLoaded', () => {
  const btnFabDelete = document.getElementById('btn-fab-delete');
  if (btnFabDelete) {
    btnFabDelete.onclick = () => {
      const selectedCbs = document.querySelectorAll('.cb-row:checked');
      if (!selectedCbs.length) return;
      showConfirm('Delete Selected?', `Are you sure you want to completely remove ${selectedCbs.length} items? This cannot be undone.`, () => {
        const toDeleteIds = new Set(Array.from(selectedCbs).map(cb => Number(cb.dataset.ri)));
        // Filter out those indexes from cellData
        cellData = cellData.filter((_, idx) => !toDeleteIds.has(idx));
        
        recomputeAllBalances();
        renderDashboard();
        scheduleSave();
        checkAutoAlert();
        toast(`Deleted ${selectedCbs.length} items`, 'warn');
      });
    };
  }
});

function initTableDatepickers() {
  $$('.date-cell').forEach(el => {
    el.onclick = (e) => {
      e.stopPropagation();
      openSharedDatepicker(el, Number(el.dataset.ri));
    };
  });
}

// ── Cell handlers (targeted update, no full re-render) ───
function onCellChange(e) {
  const { ri, col } = e.target.dataset;
  const rowIdx = Number(ri);
  cellData[rowIdx][col] = e.target.value;
  recomputeAllBalances();
  updateComputedCells();
  scheduleSave();
  checkAutoAlert();
}

function onCellBlur(e) {
  const { ri, col } = e.target.dataset;
  const rowIdx = Number(ri);
  const c = columns.find(x => x.col_id === col);
  if (!c) return;
  let val = e.target.value.trim();
  if (c.type === 'number' && val) {
    const num = parseNum(val);
    if (!isNaN(num)) { cellData[rowIdx][col] = String(num); e.target.value = fmtNum(num); }
  } else {
    cellData[rowIdx][col] = val;
  }
  recomputeAllBalances();
  updateComputedCells();
  scheduleSave();
  checkAutoAlert();
}

// Update only the computed cells (amount + balance) without re-rendering
function updateComputedCells() {
  // Update balance displays
  $$('[data-computed="balance"]').forEach(el => {
    const ri = Number(el.dataset.ri);
    const bal = parseNum(cellData[ri]?.running_balance);
    const po = cellData[ri]?.po_number || '*';
    const thr = getThreshold(po);
    el.textContent = isNaN(bal) ? '' : fmt(bal);
    el.className = 'cell-readonly font-semibold text-[13px]';
    if (!isNaN(bal)) {
      if (bal <= thr.danger) el.classList.add('text-danger');
      else if (bal <= thr.warn) el.classList.add('text-warn');
      else if (bal > 0) el.classList.add('text-ok');
    }
    // Update row highlight
    const tr = el.closest('tr');
    if (tr) {
      tr.classList.remove('row-danger', 'row-warn');
      if (!isNaN(bal) && bal <= thr.danger) tr.classList.add('row-danger');
      else if (!isNaN(bal) && bal <= thr.warn) tr.classList.add('row-warn');
    }
  });
  // Update card header stats + progress
  updateCardHeaders();
}

function updateCardHeaders() {
  const { groups, order } = groupByPO();
  document.querySelectorAll('.po-card').forEach(card => {
    const po = card.dataset.po;
    const entries = groups[po];
    if (!entries) return;
    const startQty = parseNum(entries[0]?.starting_qty);
    const lastBal = parseNum(entries[entries.length - 1]?.running_balance) || 0;
    const totalUsed = isNaN(startQty) ? 0 : startQty - lastBal;
    const pct = startQty > 0 ? Math.min(100, Math.round((totalUsed / startQty) * 100)) : 0;
    const thr = getThreshold(po);
    let status = 'ok';
    if (lastBal <= thr.danger) status = 'danger';
    else if (lastBal <= thr.warn) status = 'warn';

    const statColor = { ok: 'text-ok', warn: 'text-warn', danger: 'text-danger' }[status];
    const statValues = card.querySelectorAll('.po-stat-value');
    if (statValues[0]) statValues[0].textContent = isNaN(startQty) ? '--' : fmt(startQty);
    if (statValues[1]) { statValues[1].textContent = fmt(lastBal); statValues[1].className = `po-stat-value text-[22px] font-bold tabular-nums tracking-tight ${statColor}`; }
    const fill = card.querySelector('[class*="progress-"]');
    if (fill) { fill.style.width = `${pct}%`; fill.className = `progress-${status} h-full rounded-lg transition-all duration-700`; }
    const pctEl = card.querySelector('span.text-right');
    if (pctEl) pctEl.textContent = `${pct}% hauled`;
  });
}

// ── Balance computation (per PO group) ───────────────────
function recomputeAllBalances() {
  const seen = {};
  cellData.forEach((row) => {
    const po = row.po_number || 'Unassigned';
    const qty = parseNum(row.quantity) || 0;
    if (!seen[po]) {
      let startBal = parseNum(row.starting_qty);
      if (isNaN(startBal)) {
        // legacy root-row: infer original starting amount
        startBal = (parseNum(row.running_balance) || 0) + qty;
      }
      row.starting_qty = String(startBal); // persist so re-runs don't lose it
      seen[po] = { initialBalance: startBal, runningTotal: qty };
      row.running_balance = String(startBal - qty);
    } else {
      seen[po].runningTotal += qty;
      row.running_balance = String(seen[po].initialBalance - seen[po].runningTotal);
    }
  });
}

// ── Row operations ───────────────────────────────────────
function addEntry() {
  showAddEntryModal('');
}

function addEntryToPO(poNum) {
  showAddEntryModal(poNum);
}

function showAddEntryModal(defaultPO) {
  const overlay = document.createElement('div');
  overlay.className = TW.overlay;
  overlay.innerHTML = `
  <div class="${TW.modal}">
    <h2 class="${TW.modalH2}">${I.plus} New Entry</h2>
    <p class="${TW.modalSub}">Add a new hauling entry${defaultPO ? ` for <strong>${esc(defaultPO)}</strong>` : ''}</p>
    <div class="${TW.field}"><label class="${TW.label}">P.O. No.</label><input id="ne-po" value="${esc(defaultPO)}" ${defaultPO ? 'readonly' : ''} placeholder="e.g. 21208720" class="${TW.input}"/></div>
    ${!defaultPO ? `<div class="${TW.field}"><label class="${TW.label}">Starting PO Quantity <span class="text-txt-3 normal-case font-normal">(first entry only — total qty on PO)</span></label><input id="ne-balance" type="text" placeholder="e.g. 200,000" inputmode="decimal" class="${TW.input}"/></div>` : ''}
    <div class="${TW.field}"><label class="${TW.label}">Hauling Date</label>
      <div class="c-datepicker relative" id="ne-dp">
        <div class="c-date-trigger w-full flex items-center gap-2.5 py-[11px] px-3.5 text-[13px] font-normal cursor-pointer rounded-xl border-[1.5px] border-line bg-surface-2 text-txt transition-colors duration-200 select-none has-value" id="ne-dp-trigger">
          <svg class="ico shrink-0 cursor-pointer text-txt-3 hover:text-accent transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>
          <input id="ne-dp-label" class="bg-transparent border-none outline-none w-full p-0 text-txt placeholder:text-txt-3" placeholder="MM-DD-YY or Select Date" value="${formatDateLong(new Date())}" />
        </div>
        <div class="c-cal" id="ne-dp-cal"></div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="${TW.field}"><label class="${TW.label}">Quantity Hauled</label><input id="ne-qty" type="text" placeholder="0" inputmode="decimal" class="${TW.input}"/></div>
      <div class="${TW.field}"><label class="${TW.label}">Invoice No.</label><input id="ne-invoice" placeholder="e.g. 193" class="${TW.input}"/></div>
    </div>
    <div class="${TW.modalActions}">
      <button class="${TW.ghostBtn}" id="modal-cancel">Cancel</button>
      <button class="${TW.primaryBtn}" id="modal-save">Add Entry</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#modal-cancel').onclick = () => overlay.remove();
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

  // Init custom datepicker on modal
  initDatepicker('ne-dp', false);
  const now = new Date();
  selectDay('ne-dp', now.getFullYear(), now.getMonth(), now.getDate());

  const neDateInp = overlay.querySelector('#ne-dp-label');
  const handleDateBlur = () => {
    const val = neDateInp.value.trim();
    if (!val) return;
    const parsed = parseFlexibleDate(val);
    if (parsed) {
      selectDay('ne-dp', parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
    } else {
      // Revert to current selected if invalid
      const s = dpState['ne-dp']?.selected || new Date();
      neDateInp.value = formatDateLong(s);
    }
  };
  neDateInp.onblur = handleDateBlur;
  neDateInp.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); handleDateBlur(); neDateInp.blur(); } };
  neDateInp.onfocus = () => neDateInp.select();

  // Trigger calendar open only on icon click or label click (but input focus is separate)
  overlay.querySelector('#ne-dp-trigger').onclick = (e) => {
    // If user clicked exactly the input, don't toggle the calendar (let them type)
    if (e.target.id === 'ne-dp-label') return;
    // Otherwise open/toggle
    if (window._toggleDp) window._toggleDp('ne-dp');
  };

  // Input formatters for thousands separator
  const fmtInput = (e) => {
    let val = e.target.value.replace(/[^0-9.]/g, '');
    const parts = val.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    e.target.value = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
  };
  const qtyInput = overlay.querySelector('#ne-qty');
  if (qtyInput) qtyInput.addEventListener('input', fmtInput);
  const balInput = overlay.querySelector('#ne-balance');
  if (balInput) balInput.addEventListener('input', fmtInput);

  overlay.querySelector('#modal-save').onclick = () => {
    const po = overlay.querySelector('#ne-po').value.trim();
    if (!po) { toast('P.O. No. is required', 'warn'); return; }
    
    const qtyStr = overlay.querySelector('#ne-qty').value.trim();
    if (!qtyStr) { toast('Quantity Hauled is required', 'warn'); return; }
    const qty = parseFloat(qtyStr.replace(/,/g, '')) || 0;
    if (qty <= 0) { toast('Please enter a valid quantity', 'warn'); return; }

    const dpS = dpState['ne-dp'];
    let selDate = '';
    if (dpS?.selected) {
      selDate = dpS.selected.getFullYear() + '-' + 
                String(dpS.selected.getMonth() + 1).padStart(2, '0') + '-' + 
                String(dpS.selected.getDate()).padStart(2, '0');
    } else {
      selDate = new Date().getFullYear() + '-' + 
                String(new Date().getMonth() + 1).padStart(2, '0') + '-' + 
                String(new Date().getDate()).padStart(2, '0');
    }

    const row = {
      po_number:       po,
      hauling_date:    selDate,
      quantity:        String(qty),
      running_balance: '',
      invoice_no:      overlay.querySelector('#ne-invoice').value.trim(),
    };

    // Determine initial balance (total PO quantity)
    const existing = cellData.filter(r => r.po_number === po);
    if (!existing.length) {
      // First entry for this PO — set starting quantity
      const initBalStr = overlay.querySelector('#ne-balance')?.value.trim() || '0';
      const initBal = parseFloat(initBalStr.replace(/,/g, '')) || 0;
      row.starting_qty = String(initBal);
      row.running_balance = String(initBal);
    }

    cellData.push(row);
    recomputeAllBalances();
    overlay.remove();
    renderDashboard();
    scheduleSave();
    checkAutoAlert();
    toast('Entry added', 'ok');
  };

  setTimeout(() => overlay.querySelector(defaultPO ? '#ne-qty' : '#ne-po')?.focus(), 100);
}

function deleteRow(ri) {
  showConfirm('Delete entry?', `Remove this hauling entry?`, () => {
    cellData.splice(ri, 1);
    recomputeAllBalances();
    renderDashboard();
    scheduleSave();
    checkAutoAlert();
    toast('Entry deleted', 'warn');
  });
}

function deletePO(poNum) {
  showConfirm('Delete PO completely?', `Are you sure you want to permanently delete PO ${esc(poNum)} and ALL of its hauling entries?`, () => {
    cellData = cellData.filter(r => r.po_number !== poNum);
    
    // Also cleanup threshold if it exists
    if (thresholds[poNum]) {
      delete thresholds[poNum];
      if (activeSheet) api.data.saveThreshold(activeSheet, { po_number: poNum, warn: 1000, danger: 0 }).catch(() => {});
    }
    
    recomputeAllBalances();
    renderDashboard();
    scheduleSave();
    checkAutoAlert();
    toast(`PO ${poNum} deleted`, 'warn');
  });
}

// ── Auto-save ────────────────────────────────────────────
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    if (!activeSheet) return;
    try { await api.data.saveRows(activeSheet, cellData); }
    catch (err) { toast(`Save failed: ${err.message}`, 'danger'); }
  }, 1500);
}

// ══════════════════════════════════════════════════════════
//  ALERTS
// ══════════════════════════════════════════════════════════
function getAlertRows() {
  const { groups } = groupByPO();
  const alerts = [];
  Object.keys(groups).forEach(po => {
    const entries = groups[po];
    if (!entries || !entries.length) return;
    const lastEntry = entries[entries.length - 1];
    const bv = parseNum(lastEntry.running_balance);
    if (isNaN(bv) || bv === 0) return;
    const thr = getThreshold(po);
    const ri = lastEntry._idx;

    const startingQty = parseNum(entries[0].starting_qty) || 0;
    const lastDate = lastEntry.hauling_date || 'N/A';
    const totalUsed = entries.reduce((sum, r) => sum + (parseNum(r.quantity) || 0), 0);
    const lastQty = parseNum(lastEntry.quantity) || 0;
    const alertData = { ri, bv, po, startingQty, lastDate, totalUsed, lastQty };

    if (bv <= thr.danger) alerts.push({ ...alertData, level: 'DANGER' });
    else if (bv <= thr.warn) alerts.push({ ...alertData, level: 'WARNING' });
  });
  return alerts;
}

let alertDebounce = null;
function checkAutoAlert() {
  clearTimeout(alertDebounce);
  alertDebounce = setTimeout(async () => {
    const al = getAlertRows();
    if (!al.length) { lastAlertKey = ''; return; }
    const key = al.map(a => `${a.po}:${a.level}:${a.bv}`).join('|');
    if (key === lastAlertKey) return;
    if (!emailCfg.to) return;
    lastAlertKey = key;
    await triggerEmail(al);
  }, 2000);
}

async function triggerEmail(al) {
  const sheetName = sheets.find(s => s.id === activeSheet)?.name || '';
  const payload = al.map(a => {
    const thr = getThreshold(a.po);
    return { 
      po: a.po || `Row ${a.ri + 1}`, 
      level: a.level, 
      balance: a.bv,
      startingQty: a.startingQty,
      lastQty: a.lastQty,
      lastDate: a.lastDate,
      totalUsed: a.totalUsed,
      threshold: { danger: thr.danger, warn: thr.warn },
    };
  });
  toast(`Sending alert for ${al.length} item(s)...`, 'warn');
  
  const levels = al.map(a => a.level);
  try {
    await api.email.sendAlert({
      to: emailCfg.to,
      subject: `${emailCfg.subj} — ${al.length} Item(s)`,
      alerts: payload,
      sheetName,
      senderName: emailCfg.name,
    });
    
    if (activeSheet) {
      await api.data.logAlert(activeSheet, { recipient: emailCfg.to, item_count: al.length, levels, status: 'sent' });
    }
    
    alertLog.unshift({ time: new Date().toLocaleString(), to: emailCfg.to, count: al.length, levels, status: 'sent' });
    renderAlertLog();
    toast(`Alert sent to ${emailCfg.to}`, 'ok');
  } catch (err) { 
    if (activeSheet) {
      await api.data.logAlert(activeSheet, { recipient: emailCfg.to, item_count: al.length, levels, status: 'failed', error_msg: err.message }).catch(console.error);
    }
    alertLog.unshift({ time: new Date().toLocaleString(), to: emailCfg.to, count: al.length, levels, status: 'failed' });
    renderAlertLog();
    toast(`Email failed: ${err.message}`, 'danger'); 
  }
}

// ══════════════════════════════════════════════════════════
//  ALERT LOG
// ══════════════════════════════════════════════════════════
function getUnreadAlertsCount() {
  const lastSeenStr = localStorage.getItem(`po_alert_seen_time_${activeSheet}`);
  if (!lastSeenStr) return alertLog.length;
  const lastSeen = parseInt(lastSeenStr, 10);
  return alertLog.filter(l => new Date(l.time).getTime() > lastSeen).length;
}

function renderAlertLog() {
  const btn = $('#btn-alerts');
  if (btn) {
    const unread = getUnreadAlertsCount();
    if (unread > 0) {
      btn.innerHTML = `${I.bellAlert} <span class="absolute top-0.5 right-0.5 text-[9px] py-0.5 px-1 w-5 h-5 rounded-full bg-danger text-white font-semibold">${unread}</span>`;
      btn.classList.add('has-alerts');
    } else {
      btn.innerHTML = `${I.bellAlert}`;
      btn.classList.remove('has-alerts');
    }
  }

  const popBody = $('#alert-popover-body');
  if (popBody) {
    if (!alertLog.length) {
      popBody.innerHTML = '<div class="text-center py-10 text-txt-3 text-[13px]"><p>No alerts yet.</p></div>';
    } else {
      const badgeCls = 'inline-block py-0.5 px-2 rounded-md text-[9px] font-semibold tracking-[0.5px] uppercase';
      popBody.innerHTML = alertLog.slice(0, 50).map(l => {
        const lvls = Array.isArray(l.levels) ? l.levels : [];
        let timeStr = l.time;
        try {
          const d = new Date(l.time);
          if (!isNaN(d.getTime())) {
            timeStr = d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
          }
        } catch(e) {}

        return `<div class="p-2.5 border-b border-line rounded-xl bg-surface-2 mb-1.5">
          <div class="flex justify-between items-start mb-1 gap-3">
            <div class="text-[13px] font-medium break-all">${esc(l.to || '')}</div>
            <div class="text-[11px] text-txt-3 whitespace-nowrap shrink-0">${timeStr}</div>
          </div>
          <div class="text-xs text-txt-2 mb-1.5">${l.count || 0} item(s) alerted</div>
          <div class="flex gap-1 flex-wrap">
            ${lvls.includes('DANGER') ? `<span class="${badgeCls} bg-danger/[0.15] text-danger">DANGER</span>` : ''}
            ${lvls.includes('WARNING') ? `<span class="${badgeCls} bg-warn/[0.15] text-warn">WARNING</span>` : ''}
            <span class="${badgeCls} ${l.status === 'sent' ? 'bg-ok/[0.15] text-ok' : 'bg-danger/[0.15] text-danger'}">${l.status}</span>
          </div>
        </div>`;
      }).join('');
    }
  }
}



// ══════════════════════════════════════════════════════════
//  MODALS
// ══════════════════════════════════════════════════════════
function showModal(title, label, defaultVal, onSave) {
  const overlay = document.createElement('div');
  overlay.className = TW.overlay;
  overlay.innerHTML = `
  <div class="${TW.modal}">
    <h2 class="${TW.modalH2}">${title}</h2>
    <div class="${TW.field} mt-5"><label class="${TW.label}">${label}</label><input id="modal-input" value="${esc(defaultVal || '')}" class="${TW.input}"/></div>
    <div class="${TW.modalActions}">
      <button class="${TW.ghostBtn}" id="modal-cancel">Cancel</button>
      <button class="${TW.primaryBtn}" id="modal-save">Save</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  const inp = overlay.querySelector('#modal-input');
  setTimeout(() => { inp.focus(); inp.select(); }, 100);
  overlay.querySelector('#modal-cancel').onclick = () => overlay.remove();
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  const save = async () => {
    const v = inp.value.trim(); if (!v) return;
    overlay.querySelector('#modal-save').disabled = true;
    try { await onSave(v); overlay.remove(); }
    catch (err) { toast(err.message, 'danger'); overlay.querySelector('#modal-save').disabled = false; }
  };
  overlay.querySelector('#modal-save').onclick = save;
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') save(); });
}

function showConfirm(title, text, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = TW.overlay;
  overlay.innerHTML = `
  <div class="${TW.modal}">
    <h2 class="${TW.modalH2}">${title}</h2>
    <p class="${TW.modalSub}">${text}</p>
    <div class="${TW.modalActions}">
      <button class="${TW.ghostBtn}" id="modal-cancel">Cancel</button>
      <button class="${TW.dangerBtn}" id="modal-confirm">Delete</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#modal-cancel').onclick = () => overlay.remove();
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  overlay.querySelector('#modal-confirm').onclick = async () => { overlay.remove(); await onConfirm(); };
}

function openThresholdModal(poNum = '*') {
  const overlay = document.createElement('div');
  overlay.className = TW.overlay;
  
  const isDefault = poNum === '*';
  const displayTitle = isDefault ? 'Default Threshold Settings' : `Threshold for ${poNum}`;
  const displaySub = isDefault ? 'Set fallback balance levels that trigger email alerts' : `Set custom balance levels that trigger alerts for ${poNum}`;
  
  if (!thresholds[poNum]) thresholds[poNum] = { warn: 1000, danger: 0 };
  const thr = thresholds[poNum];

  overlay.innerHTML = `
  <div class="${TW.modal}">
    <h2 class="${TW.modalH2}">${I.cog} ${esc(displayTitle)}</h2>
    <p class="${TW.modalSub}">${esc(displaySub)}</p>
    <div class="${TW.field}"><label class="${TW.label}">Warning Level (balance &le;)</label><input id="thr-warn" type="number" value="${thr.warn}" class="${TW.input}"/></div>
    <div class="${TW.field}"><label class="${TW.label}">Danger Level (balance &le;)</label><input id="thr-danger" type="number" value="${thr.danger}" class="${TW.input}"/></div>
    <div class="${TW.modalActions}">
      <button class="${TW.ghostBtn}" id="modal-cancel">Cancel</button>
      <button class="${TW.primaryBtn}" id="modal-save">Save</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#modal-cancel').onclick = () => overlay.remove();
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  overlay.querySelector('#modal-save').onclick = async () => {
    const w = parseFloat(overlay.querySelector('#thr-warn').value) || 1000;
    const d = parseFloat(overlay.querySelector('#thr-danger').value) || 0;
    thresholds[poNum].warn = w;
    thresholds[poNum].danger = d;
    lastAlertKey = '';
    if (activeSheet) await api.data.saveThreshold(activeSheet, { po_number: poNum, warn: w, danger: d });
    overlay.remove();
    updateComputedCells();
    checkAutoAlert();
    toast('Threshold updated', 'ok');
  };
}

function openEmailModal() {
  const overlay = document.createElement('div');
  overlay.className = TW.overlay;
  overlay.innerHTML = `
  <div class="${TW.modal}">
    <h2 class="${TW.modalH2}">${I.envelope} Email Settings</h2>
    <p class="${TW.modalSub}">Configure alert email recipients</p>
    <div class="${TW.field}"><label class="${TW.label}">Recipient Email(s)</label><input id="em-to" value="${esc(emailCfg.to)}" placeholder="team@example.com" class="${TW.input}"/></div>
    <div class="${TW.field}"><label class="${TW.label}">Sender Name</label><input id="em-name" value="${esc(emailCfg.name)}" class="${TW.input}"/></div>
    <div class="${TW.field}"><label class="${TW.label}">Subject</label><input id="em-subj" value="${esc(emailCfg.subj)}" class="${TW.input}"/></div>
    <div class="${TW.modalActions}">
      <button class="${TW.ghostBtn}" id="btn-test">Send Test</button>
      <button class="${TW.ghostBtn}" id="modal-cancel">Cancel</button>
      <button class="${TW.primaryBtn}" id="modal-save">Save</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#modal-cancel').onclick = () => overlay.remove();
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  overlay.querySelector('#btn-test').onclick = async () => {
    const to = overlay.querySelector('#em-to').value.trim();
    if (!to) return toast('Enter an email first', 'warn');
    try { await api.email.test(to); toast(`Test sent to ${to}`, 'ok'); } catch (err) { toast(err.message, 'danger'); }
  };
  overlay.querySelector('#modal-save').onclick = async () => {
    emailCfg = {
      to:   overlay.querySelector('#em-to').value.trim(),
      name: overlay.querySelector('#em-name').value.trim() || 'PO Tracker System',
      subj: overlay.querySelector('#em-subj').value.trim() || '[ALERT] PO Balance Warning',
    };
    if (activeSheet) await api.data.saveEmail(activeSheet, emailCfg);
    overlay.remove();
    toast('Email settings saved', 'ok');
  };
}

async function openShareModal() {
  const sheetName = sheets.find(s => s.id === activeSheet)?.name || 'PO Data';
  const overlay = document.createElement('div');
  const uniquePOs = groupByPO().order;
  
  const poChecksHtml = uniquePOs.length ? `
    <div class="${TW.field} mb-4">
      <label class="${TW.label}">Included PO Numbers</label>
      <div class="max-h-[160px] overflow-y-auto bg-surface-2 border border-line rounded-xl p-3 grid grid-cols-2 gap-x-4 gap-y-1">
        ${uniquePOs.map(po => `
          <label class="flex items-center gap-2.5 cursor-pointer hover:bg-surface-3 p-1.5 rounded transition-colors w-full group">
            <div class="relative flex items-center shrink-0">
              <input type="checkbox" checked value="${esc(po)}" class="share-po-cb peer appearance-none w-[16px] h-[16px] border-[1.5px] border-line rounded bg-surface checked:bg-accent checked:border-accent transition-all cursor-pointer group-hover:border-accent/[0.5]"/>
              <svg class="absolute inset-0 w-full h-full text-white pointer-events-none opacity-0 scale-50 peer-checked:opacity-100 peer-checked:scale-100 transition-all p-[2px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <span class="text-[12px] font-medium text-txt-2 select-none truncate">${esc(po)}</span>
          </label>
        `).join('')}
      </div>
    </div>
  ` : '';

  overlay.className = TW.overlay;
  overlay.innerHTML = `
  <div class="${TW.modal} !max-w-[540px]">
    <h2 class="${TW.modalH2}">${I.share} Share Links</h2>
    <p class="${TW.modalSub}">Manage share links for this sheet</p>
    <div id="share-existing" class="mb-5"></div>
    <div class="border-t border-line pt-[18px]">
      <div class="flex items-center justify-between mb-3">
        <p class="text-[11px] font-bold text-txt-2 uppercase tracking-[0.5px] mb-0">Create New Link</p>
      </div>
      <div class="${TW.field}"><label class="${TW.label}">Link Label</label><input id="share-label" value="${esc(sheetName)}" class="${TW.input}"/></div>
      ${poChecksHtml}
      <div class="${TW.field}">
        <label class="${TW.label}">Expires After</label>
        <div id="share-expiry-wrap"></div>
      </div>
      <div id="share-result"></div>
      <div class="${TW.modalActions}">
        <button class="${TW.ghostBtn}" id="modal-cancel">Cancel</button>
        <button class="${TW.primaryBtn}" id="btn-generate">Generate Link</button>
      </div>
    </div>
  </div>`;
  document.body.appendChild(overlay);

  // Custom c-select dropdown for expiry
  overlay.querySelector('#share-expiry-wrap').innerHTML = `
    <div class="c-select relative" id="sel-expiry">
      <div class="c-select-trigger w-full flex items-center justify-between gap-2 py-[11px] px-3.5 text-[13px] font-normal cursor-pointer rounded-xl border-[1.5px] border-line bg-surface-2 text-txt transition-all duration-200 select-none hover:border-line-lit" onclick="document.getElementById('sel-expiry').classList.toggle('open')">
        <div class="flex items-center gap-2 [&_.ico]:w-4 [&_.ico]:h-4 [&_.ico]:text-txt-3">
          ${I.cog}
          <span id="sel-expiry-label">7 days</span>
        </div>
        <div class="c-chevron transition-transform duration-200 [&_.ico]:w-4 [&_.ico]:h-4 [&_.ico]:text-txt-3">${I.chevDown}</div>
      </div>
      <div class="c-select-menu">
        <div class="c-opt flex items-center gap-2.5 py-[9px] px-3 text-[13px] rounded-[9px] cursor-pointer text-txt-2 transition-colors duration-150 hover:bg-surface-2 hover:text-txt" data-val="1" onclick="window._selExpiry(this,'1 day')">1 day</div>
        <div class="c-opt flex items-center gap-2.5 py-[9px] px-3 text-[13px] rounded-[9px] cursor-pointer text-txt-2 transition-colors duration-150 hover:bg-surface-2 hover:text-txt bg-accent/[0.06] !text-accent-2 font-medium selected" data-val="7" onclick="window._selExpiry(this,'7 days')">7 days</div>
        <div class="c-opt flex items-center gap-2.5 py-[9px] px-3 text-[13px] rounded-[9px] cursor-pointer text-txt-2 transition-colors duration-150 hover:bg-surface-2 hover:text-txt" data-val="30" onclick="window._selExpiry(this,'30 days')">30 days</div>
        <div class="c-opt flex items-center gap-2.5 py-[9px] px-3 text-[13px] rounded-[9px] cursor-pointer text-txt-2 transition-colors duration-150 hover:bg-surface-2 hover:text-txt" data-val="0" onclick="window._selExpiry(this,'Never')">Never</div>
      </div>
    </div>`;
  let expiryVal = '7';
  window._selExpiry = (el, label) => {
    expiryVal = el.dataset.val;
    document.getElementById('sel-expiry-label').textContent = label;
    document.querySelectorAll('#sel-expiry .c-opt').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    document.getElementById('sel-expiry').classList.remove('open');
  };

  overlay.querySelector('#modal-cancel').onclick = () => overlay.remove();
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
    if (!e.target.closest('.c-select')) document.querySelectorAll('.c-select.open').forEach(s => s.classList.remove('open'));
  };

  // Load existing links
  async function loadExistingLinks() {
    const container = overlay.querySelector('#share-existing');
    try {
      const { links } = await api.share.list(activeSheet);
      if (!links || links.length === 0) {
        container.innerHTML = `<p class="text-xs text-txt-3 text-center py-3">No share links yet</p>`;
        return;
      }
      container.innerHTML = links.map(link => {
        const url = `${window.location.origin}/share.html?token=${link.token}`;
        const expired = link.expires_at && new Date(link.expires_at) < new Date();
        const expiryText = link.expires_at
          ? (expired ? '<span class="text-danger">Expired</span>' : `Expires ${new Date(link.expires_at).toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric'})}`)
          : '<span class="text-ok">Never expires</span>';
        return `
          <div class="flex items-center justify-between gap-2.5 py-3 px-3.5 bg-surface-2 border border-line rounded-xl mb-2">
            <div class="flex-1 min-w-0">
              <div class="text-[13px] font-medium mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">${esc(link.label || 'Untitled')}</div>
              <div class="text-[11px] text-txt-3">${expiryText}</div>
            </div>
            <div class="flex gap-1.5 shrink-0">
              <button class="${TW.ghostBtn} !min-w-0 !px-2.5 !py-1.5 share-copy-btn" data-url="${esc(url)}">${I.clipCopy}</button>
              <button class="${TW.ghostBtn} !min-w-0 !px-2.5 !py-1.5 share-edit-btn" data-token="${link.token}" data-label="${esc(link.label||'')}" data-expires="${esc(link.expires_at||'')}" data-polist='${JSON.stringify(link.po_list||null)}'>${I.cog}</button>
              <button class="${TW.dangerBtn} !min-w-0 !px-2.5 !py-1.5 share-del-btn" data-token="${link.token}">${I.trash}</button>
            </div>
          </div>`;
      }).join('');

      // Bind copy buttons
      container.querySelectorAll('.share-copy-btn').forEach(btn => {
        btn.onclick = () => {
          navigator.clipboard.writeText(btn.dataset.url).then(() => {
            toast('Link copied to clipboard', 'ok');
            btn.innerHTML = `${I.checkCircle}`;
            setTimeout(() => { btn.innerHTML = `${I.clipCopy}`; }, 2000);
          });
        };
      });
      // Bind edit buttons
      container.querySelectorAll('.share-edit-btn').forEach(btn => {
        btn.onclick = () => {
          let existingPOs = null;
          try { existingPOs = JSON.parse(btn.dataset.polist); } catch {}
          openEditShareModal(btn.dataset.token, btn.dataset.label, btn.dataset.expires, existingPOs, loadExistingLinks);
        };
      });
      // Bind delete buttons
      container.querySelectorAll('.share-del-btn').forEach(btn => {
        btn.onclick = async () => {
          try {
            await api.share.revokeOne(activeSheet, btn.dataset.token);
            toast('Link deleted', 'warn');
            loadExistingLinks();
          } catch (err) { toast(err.message, 'danger'); }
        };
      });
    } catch (err) {
      container.innerHTML = `<p class="text-xs text-danger">Failed to load links</p>`;
    }
  }
  loadExistingLinks();

  // Generate new link
  overlay.querySelector('#btn-generate').onclick = async () => {
    const btn = overlay.querySelector('#btn-generate');
    btn.disabled = true; btn.textContent = 'Generating...';
    try {
      const label = overlay.querySelector('#share-label').value.trim();
      const days = parseInt(expiryVal);
      const selectedPOs = Array.from(overlay.querySelectorAll('.share-po-cb:checked')).map(cb => cb.value);
      const res = await api.share.create(activeSheet, { label, expiresInDays: days || null, selectedPOs });
      const url = `${window.location.origin}/share.html?token=${res.token}`;
      overlay.querySelector('#share-result').innerHTML = `
        <div class="${TW.field} mt-4">
          <label class="${TW.label}">Share URL</label>
          <div class="flex gap-2 mt-3">
            <input value="${url}" readonly id="share-url-input" class="flex-1 text-xs bg-surface-2 border border-line rounded-xl py-[9px] px-3.5 text-txt outline-none"/>
            <button class="${TW.ghostBtn} !min-w-0 shrink-0" id="btn-copy">${I.clipCopy} Copy</button>
          </div>
        </div>`;
      btn.textContent = 'Generated';
      overlay.querySelector('#btn-copy').onclick = () => {
        navigator.clipboard.writeText(url).then(() => {
          toast('Link copied to clipboard', 'ok');
          overlay.querySelector('#btn-copy').innerHTML = `${I.checkCircle} Copied`;
        });
      };
      toast('Share link generated', 'ok');
      // Refresh the existing links list
      loadExistingLinks();
    } catch (err) { toast(err.message, 'danger'); btn.disabled = false; btn.textContent = 'Generate Link'; }
  };
}

// ══════════════════════════════════════════════════════════
//  EDIT SHARE LINK MODAL
// ══════════════════════════════════════════════════════════
function openEditShareModal(token, currentLabel, currentExpires, currentPOList, onSaved) {
  const uniquePOs = groupByPO().order;

  // Figure out current expiry selection
  let currentExpiryDays = '7';
  let currentExpiryLabel = '7 days';
  if (currentExpires) {
    const diff = Math.round((new Date(currentExpires) - Date.now()) / 86400000);
    if (diff <= 1) { currentExpiryDays = '1'; currentExpiryLabel = '1 day'; }
    else if (diff <= 7) { currentExpiryDays = '7'; currentExpiryLabel = '7 days'; }
    else { currentExpiryDays = '30'; currentExpiryLabel = '30 days'; }
  } else {
    currentExpiryDays = '0'; currentExpiryLabel = 'Never';
  }

  const poChecksHtml = uniquePOs.length ? `
    <div class="${TW.field}">
      <label class="${TW.label}">Included PO Numbers</label>
      <div class="max-h-[160px] overflow-y-auto bg-surface-2 border border-line rounded-xl p-3 grid grid-cols-2 gap-x-4 gap-y-1">
        ${uniquePOs.map(po => {
          const checked = !currentPOList || currentPOList.includes(po) ? 'checked' : '';
          return `
          <label class="flex items-center gap-2.5 cursor-pointer hover:bg-surface-3 p-1.5 rounded transition-colors w-full group">
            <div class="relative flex items-center shrink-0">
              <input type="checkbox" ${checked} value="${esc(po)}" class="edit-po-cb peer appearance-none w-[16px] h-[16px] border-[1.5px] border-line rounded bg-surface checked:bg-accent checked:border-accent transition-all cursor-pointer group-hover:border-accent/[0.5]"/>
              <svg class="absolute inset-0 w-full h-full text-white pointer-events-none opacity-0 scale-50 peer-checked:opacity-100 peer-checked:scale-100 transition-all p-[2px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <span class="text-[12px] font-medium text-txt-2 select-none truncate">${esc(po)}</span>
          </label>`;
        }).join('')}
      </div>
    </div>
  ` : '';

  const overlay = document.createElement('div');
  overlay.className = TW.overlay;
  overlay.innerHTML = `
  <div class="${TW.modal} !max-w-[520px]">
    <h2 class="${TW.modalH2}">${I.cog} Edit Share Link</h2>
    <p class="${TW.modalSub}">Update the label, included POs, or expiry for this link</p>
    <div class="${TW.field}"><label class="${TW.label}">Link Label</label><input id="edit-share-label" value="${esc(currentLabel)}" class="${TW.input}"/></div>
    ${poChecksHtml}
    <div class="${TW.field}">
      <label class="${TW.label}">Expires After</label>
      <div id="edit-expiry-wrap"></div>
    </div>
    <div class="${TW.modalActions}">
      <button class="${TW.ghostBtn}" id="edit-share-cancel">Cancel</button>
      <button class="${TW.primaryBtn}" id="edit-share-save">Save Changes</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);

  // Expiry dropdown
  overlay.querySelector('#edit-expiry-wrap').innerHTML = `
    <div class="c-select relative" id="sel-edit-expiry">
      <div class="c-select-trigger w-full flex items-center justify-between gap-2 py-[11px] px-3.5 text-[13px] font-normal cursor-pointer rounded-xl border-[1.5px] border-line bg-surface-2 text-txt transition-all duration-200 select-none hover:border-line-lit" onclick="document.getElementById('sel-edit-expiry').classList.toggle('open')">
        <div class="flex items-center gap-2 [&_.ico]:w-4 [&_.ico]:h-4 [&_.ico]:text-txt-3">${I.cog}<span id="sel-edit-expiry-label">${esc(currentExpiryLabel)}</span></div>
        <div class="c-chevron transition-transform duration-200 [&_.ico]:w-4 [&_.ico]:h-4 [&_.ico]:text-txt-3">${I.chevDown}</div>
      </div>
      <div class="c-select-menu">
        <div class="c-opt flex items-center gap-2.5 py-[9px] px-3 text-[13px] rounded-[9px] cursor-pointer text-txt-2 transition-colors duration-150 hover:bg-surface-2 hover:text-txt" data-val="1" onclick="window._selEditExpiry(this,'1 day')">1 day</div>
        <div class="c-opt flex items-center gap-2.5 py-[9px] px-3 text-[13px] rounded-[9px] cursor-pointer text-txt-2 transition-colors duration-150 hover:bg-surface-2 hover:text-txt" data-val="7" onclick="window._selEditExpiry(this,'7 days')">7 days</div>
        <div class="c-opt flex items-center gap-2.5 py-[9px] px-3 text-[13px] rounded-[9px] cursor-pointer text-txt-2 transition-colors duration-150 hover:bg-surface-2 hover:text-txt" data-val="30" onclick="window._selEditExpiry(this,'30 days')">30 days</div>
        <div class="c-opt flex items-center gap-2.5 py-[9px] px-3 text-[13px] rounded-[9px] cursor-pointer text-txt-2 transition-colors duration-150 hover:bg-surface-2 hover:text-txt" data-val="0" onclick="window._selEditExpiry(this,'Never')">Never</div>
      </div>
    </div>`;

  let editExpiryVal = currentExpiryDays;
  // Mark current selection
  overlay.querySelectorAll('#sel-edit-expiry .c-opt').forEach(o => {
    if (o.dataset.val === editExpiryVal) o.classList.add('bg-accent/[0.06]', '!text-accent-2', 'font-medium', 'selected');
  });
  window._selEditExpiry = (el, label) => {
    editExpiryVal = el.dataset.val;
    document.getElementById('sel-edit-expiry-label').textContent = label;
    overlay.querySelectorAll('#sel-edit-expiry .c-opt').forEach(o => o.classList.remove('bg-accent/[0.06]', '!text-accent-2', 'font-medium', 'selected'));
    el.classList.add('bg-accent/[0.06]', '!text-accent-2', 'font-medium', 'selected');
    document.getElementById('sel-edit-expiry').classList.remove('open');
  };

  overlay.querySelector('#edit-share-cancel').onclick = () => overlay.remove();
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
    if (!e.target.closest('.c-select')) document.querySelectorAll('.c-select.open').forEach(s => s.classList.remove('open'));
  };

  overlay.querySelector('#edit-share-save').onclick = async () => {
    const saveBtn = overlay.querySelector('#edit-share-save');
    saveBtn.disabled = true; saveBtn.textContent = 'Saving…';
    try {
      const label = overlay.querySelector('#edit-share-label').value.trim();
      const days = parseInt(editExpiryVal);
      const selectedPOs = Array.from(overlay.querySelectorAll('.edit-po-cb:checked')).map(cb => cb.value);
      await api.share.update(activeSheet, token, { label, expiresInDays: days || 0, selectedPOs });
      toast('Share link updated', 'ok');
      overlay.remove();
      if (onSaved) onSaved();
    } catch (err) {
      toast(err.message, 'danger');
      saveBtn.disabled = false; saveBtn.textContent = 'Save Changes';
    }
  };
}

// ══════════════════════════════════════════════════════════
//  EXPORT CSV
// ══════════════════════════════════════════════════════════
function exportCSV() {
  const headers = ['P.O. No.','Hauling Date','Quantity','Running Balance','Invoice No.'];
  const keys = ['po_number','hauling_date','quantity','running_balance','invoice_no'];
  const rows = cellData.map(row => keys.map(k => `"${String(row[k] ?? '').replace(/"/g, '""')}"`).join(','));
  const csv = [headers.map(h => `"${h}"`).join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `po-data-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  toast('CSV exported', 'ok');
}

// ══════════════════════════════════════════════════════════
//  UTILITIES
// ══════════════════════════════════════════════════════════
function esc(s) { const d = document.createElement('div'); d.textContent = s ?? ''; return d.innerHTML; }
function parseNum(v) { return parseFloat(String(v ?? '').replace(/,/g, '')); }
function fmt(n) { return Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtNum(n) { return isNaN(n) ? '' : fmt(n); }
function numDisplay(v) { const n = parseNum(v); return isNaN(n) || n === 0 ? '' : fmtNum(n); }

function dateToInput(val) {
  if (!val) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(val)) return val.slice(0, 10);
  const d = parseFlexibleDate(val);
  if (d) return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  return '';
}

function parseFlexibleDate(str) {
  if (!str) return null;
  const s = str.trim();
  if (!s) return null;

  // Try ISO first
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const [y, m, d] = s.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return isNaN(date.getTime()) ? null : date;
  }

  // Common delimiters: / - . space
  const m = s.match(/^(\d{1,2})[\/\-\.\s](\d{1,2})(?:[\/\-\.\s](\d{2,4}))?$/);
  if (m) {
    let month = parseInt(m[1]);
    let day = parseInt(m[2]);
    let year = m[3] ? parseInt(m[3]) : new Date().getFullYear();

    if (m[3] && m[3].length === 2) {
      year = year < 50 ? 2000 + year : 1900 + year;
    }
    const d = new Date(year, month - 1, day);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function formatDateLong(date) {
  if (!date || isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatDateDisplay(val) {
  if (!val) return '';
  const iso = dateToInput(val);
  if (!iso) return val;
  const [y, m, day] = iso.split('-').map(Number);
  const d = new Date(y, m - 1, day);
  if (isNaN(d.getTime())) return val;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// ══════════════════════════════════════════════════════════
//  CUSTOM DATEPICKER (ported from room-details)
// ══════════════════════════════════════════════════════════
const dpState = {};
const DP_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DP_MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DP_DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const calIcon = `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>`;
const chevLeftIcon = `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>`;
const chevRightIcon = `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>`;

function initDatepicker(id, minToday = false) {
  const now = new Date();
  dpState[id] = { year: now.getFullYear(), month: now.getMonth(), selected: null, minToday, view: 'day' };
  renderCal(id);
}

function renderCal(id) {
  const s = dpState[id];
  if (!s) return;
  const cal = document.getElementById(id + '-cal');
  if (!cal) return;
  if (s.view === 'month') { renderMonthPicker(id, cal); return; }
  if (s.view === 'year')  { renderYearPicker(id, cal); return; }

  const y = s.year, m = s.month;
  const today = new Date(); today.setHours(0,0,0,0);
  const firstDay = new Date(y, m, 1).getDay();
  const daysInM  = new Date(y, m + 1, 0).getDate();

  const navBtn = 'w-7 h-7 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-txt-3 transition-colors duration-150 hover:bg-surface-2 hover:text-txt [&_.ico]:w-4 [&_.ico]:h-4';
  const hBtn = 'flex items-center gap-1 py-1 px-2 rounded-lg border-none bg-transparent cursor-pointer text-[13px] font-semibold text-txt transition-colors duration-150 hover:bg-surface-2 [&_.ico]:w-3.5 [&_.ico]:h-3.5 [&_.ico]:text-txt-3';
  const footerCls = 'mt-2.5 pt-2.5 border-t border-line flex gap-1.5';
  const todayBtn = 'flex-1 py-[7px] text-xs font-medium rounded-[9px] border-[1.5px] border-line bg-transparent cursor-pointer text-txt-2 transition-all duration-150 hover:border-accent hover:bg-accent hover:text-white [&_.ico]:w-3.5 [&_.ico]:h-3.5';
  const clearBtn = 'py-[7px] px-3 text-xs rounded-[9px] border-none bg-transparent cursor-pointer text-txt-3 transition-colors duration-150 hover:text-danger';

  let html = `
    <div class="flex items-center justify-between mb-2.5 gap-1">
      <button class="${navBtn}" onclick="calNav('${id}',-1)">${chevLeftIcon}</button>
      <div class="flex gap-0.5">
        <button class="${hBtn}" onclick="dpSetView('${id}','month')">${DP_MONTHS[m]}${I.chevDown}</button>
        <button class="${hBtn}" onclick="dpSetView('${id}','year')">${y}${I.chevDown}</button>
      </div>
      <button class="${navBtn}" onclick="calNav('${id}',1)">${chevRightIcon}</button>
    </div>
    <div class="grid grid-cols-7 gap-0.5">`;
  DP_DAYS.forEach(d => { html += `<div class="text-[10px] font-semibold text-center py-1 text-txt-3 uppercase tracking-[0.04em]">${d}</div>`; });
  for (let i = 0; i < firstDay; i++) html += `<div class="c-cal-day empty"></div>`;
  for (let d = 1; d <= daysInM; d++) {
    const date = new Date(y, m, d); date.setHours(0,0,0,0);
    const isToday    = date.getTime() === today.getTime();
    const isSelected = s.selected && date.getTime() === s.selected.getTime();
    const isDisabled = s.minToday && date < today;
    let cls = 'c-cal-day w-[34px] h-[34px] rounded-lg border-none bg-transparent text-xs cursor-pointer flex items-center justify-center mx-auto text-txt-2 transition-colors duration-150 hover:bg-surface-2 hover:text-txt';
    if (isToday) cls += ' today font-bold !text-txt relative';
    if (isSelected) cls += ' selected';
    if (isDisabled) cls += ' disabled !text-txt-3 cursor-not-allowed pointer-events-none opacity-30';
    html += `<button class="${cls}" onclick="selectDay('${id}',${y},${m},${d})">${d}</button>`;
  }
  html += `</div>
    <div class="${footerCls}">
      <button class="${todayBtn}" onclick="goToday('${id}')">${calIcon} Today</button>
      <button class="${clearBtn}" onclick="clearDate('${id}')">Clear</button>
    </div>`;
  cal.innerHTML = html;
}

function renderMonthPicker(id, cal) {
  const s = dpState[id];
  const navBtn = 'w-7 h-7 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-txt-3 transition-colors duration-150 hover:bg-surface-2 hover:text-txt [&_.ico]:w-4 [&_.ico]:h-4';
  const hBtn = 'flex items-center gap-1 py-1 px-2 rounded-lg border-none bg-transparent cursor-pointer text-[13px] font-semibold text-txt transition-colors duration-150 hover:bg-surface-2 [&_.ico]:w-3.5 [&_.ico]:h-3.5 [&_.ico]:text-txt-3';
  let html = `
    <div class="flex items-center justify-between mb-2.5 gap-1">
      <button class="${navBtn}" onclick="calYearNav('${id}',-1)">${chevLeftIcon}</button>
      <button class="${hBtn}" onclick="dpSetView('${id}','year')">${s.year}${I.chevDown}</button>
      <button class="${navBtn}" onclick="calYearNav('${id}',1)">${chevRightIcon}</button>
    </div>
    <div class="grid grid-cols-3 gap-1.5 py-1">`;
  DP_MONTHS_SHORT.forEach((mn, i) => {
    html += `<button class="py-2 px-1 text-xs font-medium rounded-[9px] border-none bg-transparent cursor-pointer text-txt-2 transition-colors duration-150 text-center hover:bg-surface-2 hover:text-txt${i===s.month?' !bg-accent !text-white !font-semibold':''}" onclick="selectMonth('${id}',${i})">${mn}</button>`;
  });
  html += `</div>
    <div class="mt-2.5 pt-2.5 border-t border-line flex gap-1.5">
      <button class="flex-1 py-[7px] text-xs font-medium rounded-[9px] border-[1.5px] border-line bg-transparent cursor-pointer text-txt-2 transition-all duration-150 hover:border-accent hover:bg-accent hover:text-white [&_.ico]:w-3.5 [&_.ico]:h-3.5" onclick="goToday('${id}')">${calIcon} Today</button>
      <button class="py-[7px] px-3 text-xs rounded-[9px] border-none bg-transparent cursor-pointer text-txt-3 transition-colors duration-150 hover:text-danger" onclick="clearDate('${id}')">Clear</button>
    </div>`;
  cal.innerHTML = html;
}

function renderYearPicker(id, cal) {
  const s = dpState[id];
  const base = Math.floor(s.year / 12) * 12;
  const navBtn = 'w-7 h-7 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-txt-3 transition-colors duration-150 hover:bg-surface-2 hover:text-txt [&_.ico]:w-4 [&_.ico]:h-4';
  let html = `
    <div class="flex items-center justify-between mb-2.5 gap-1">
      <button class="${navBtn}" onclick="calYearPageNav('${id}',-12)">${chevLeftIcon}</button>
      <span class="text-[13px] font-semibold">${base} – ${base+11}</span>
      <button class="${navBtn}" onclick="calYearPageNav('${id}',12)">${chevRightIcon}</button>
    </div>
    <div class="mb-2">
      <input class="w-full py-2 px-3 text-sm rounded-[10px] border-[1.5px] border-line bg-surface-2 text-center font-semibold text-txt outline-none transition-colors duration-200 focus:border-accent" type="number" value="${s.year}" min="1900" max="2100"
        oninput="manualYear('${id}',this.value)" onkeydown="if(event.key==='Enter')manualYearConfirm('${id}',this.value)" placeholder="Type year…" />
    </div>
    <div class="grid grid-cols-4 gap-1">`;
  for (let y = base; y < base + 12; y++) {
    html += `<button class="py-[7px] px-1 text-xs rounded-lg border-none bg-transparent cursor-pointer text-txt-2 transition-colors duration-150 text-center hover:bg-surface-2 hover:text-txt${y===s.year?' !bg-accent !text-white !font-semibold':''}" onclick="selectYear('${id}',${y})">${y}</button>`;
  }
  html += `</div>
    <div class="mt-2.5 pt-2.5 border-t border-line flex gap-1.5">
      <button class="flex-1 py-[7px] text-xs font-medium rounded-[9px] border-[1.5px] border-line bg-transparent cursor-pointer text-txt-2 transition-all duration-150 hover:border-accent hover:bg-accent hover:text-white [&_.ico]:w-3.5 [&_.ico]:h-3.5" onclick="goToday('${id}')">${calIcon} Today</button>
      <button class="py-[7px] px-3 text-xs rounded-[9px] border-none bg-transparent cursor-pointer text-txt-3 transition-colors duration-150 hover:text-danger" onclick="clearDate('${id}')">Clear</button>
    </div>`;
  cal.innerHTML = html;
}

// Expose to onclick handlers in HTML
window.dpSetView = (id, view) => { dpState[id].view = view; renderCal(id); };
window.calNav = (id, dir) => {
  const s = dpState[id]; s.month += dir;
  if (s.month > 11) { s.month = 0; s.year++; }
  if (s.month < 0)  { s.month = 11; s.year--; }
  renderCal(id);
};
window.calYearNav = (id, dir) => { dpState[id].year += dir; renderCal(id); };
window.calYearPageNav = (id, dir) => { dpState[id].year += dir; renderCal(id); };
window.selectMonth = (id, m) => { dpState[id].month = m; dpState[id].view = 'day'; renderCal(id); };
window.selectYear = (id, y)  => { dpState[id].year = y; dpState[id].view = 'day'; renderCal(id); };
window.manualYear = (id, val) => {
  const y = parseInt(val);
  if (!isNaN(y) && y >= 1900 && y <= 2100) { dpState[id].year = y; renderCal(id); }
};
window.manualYearConfirm = (id, val) => { window.selectYear(id, parseInt(val)); };

window.selectDay = selectDay;
function selectDay(id, y, m, d) {
  const s = dpState[id];
  const date = new Date(y, m, d); date.setHours(0,0,0,0);
  s.selected = date; s.year = y; s.month = m; s.view = 'day';
  const label = formatDateLong(date);
  const labelEl = document.getElementById(id + '-label');
  if (labelEl) {
    if (labelEl.tagName === 'INPUT') labelEl.value = label;
    else labelEl.textContent = label;
  }
  const trigger = document.getElementById(id + '-trigger');
  if (trigger) trigger.classList.add('has-value');
  renderCal(id);
  // Close after short delay
  setTimeout(() => {
    const dpEl = document.getElementById(id);
    if (dpEl) dpEl.classList.remove('open');
  }, 200);
  // If this is the shared table datepicker, update the cell data
  if (id === '_shared-dp' && _sharedDpRow !== null) {
    const formattedDate = date.getFullYear() + '-' + 
                          String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(date.getDate()).padStart(2, '0');
    cellData[_sharedDpRow].hauling_date = formattedDate;
    const cellEl = document.querySelector(`.date-cell[data-ri="${_sharedDpRow}"]`);
    if (cellEl) cellEl.textContent = formatDateDisplay(formattedDate);
    scheduleSave();
  }
}

window.goToday = goToday;
function goToday(id) {
  const now = new Date();
  dpState[id].year = now.getFullYear();
  dpState[id].month = now.getMonth();
  dpState[id].view = 'day';
  selectDay(id, now.getFullYear(), now.getMonth(), now.getDate());
}

window.clearDate = clearDate;
function clearDate(id) {
  dpState[id].selected = null;
  const labelEl = document.getElementById(id + '-label');
  if (labelEl) labelEl.textContent = 'Select a date';
  const trigger = document.getElementById(id + '-trigger');
  if (trigger) trigger.classList.remove('has-value');
  renderCal(id);
  if (id === '_shared-dp' && _sharedDpRow !== null) {
    cellData[_sharedDpRow].hauling_date = '';
    const cellEl = document.querySelector(`.date-cell[data-ri="${_sharedDpRow}"]`);
    if (cellEl) cellEl.innerHTML = '<span style="color:var(--text-3)">Pick date</span>';
    scheduleSave();
  }
}

window._toggleDp = (id) => {
  const el = document.getElementById(id);
  if (!dpState[id]) initDatepicker(id, false);
  const isOpen = el.classList.contains('open');
  document.querySelectorAll('.c-datepicker.open').forEach(dp => dp.classList.remove('open'));
  if (!isOpen) { dpState[id].view = 'day'; el.classList.add('open'); }
};

// ── Shared floating datepicker for table cells ───────────
let _sharedDpRow = null;
let _sharedDpEl = null;

function openSharedDatepicker(cellSpan, rowIndex) {
  _sharedDpRow = rowIndex;
  // Create or reuse shared datepicker element
  if (!_sharedDpEl) {
    _sharedDpEl = document.createElement('div');
    _sharedDpEl.className = 'c-datepicker';
    _sharedDpEl.id = '_shared-dp';
    _sharedDpEl.style.position = 'absolute';
    _sharedDpEl.style.zIndex = '300';
    _sharedDpEl.innerHTML = `<div class="c-cal" id="_shared-dp-cal" style="position:relative;top:0;left:0;opacity:1;visibility:visible;transform:none;"></div>`;
    document.body.appendChild(_sharedDpEl);
    initDatepicker('_shared-dp', false);
  }

  // Pre-select current date if row has one
  const currentVal = cellData[rowIndex]?.hauling_date;
  if (currentVal) {
    const iso = dateToInput(currentVal);
    if (iso) {
      const d = new Date(iso + 'T00:00:00');
      if (!isNaN(d.getTime())) {
        dpState['_shared-dp'].selected = d;
        dpState['_shared-dp'].year = d.getFullYear();
        dpState['_shared-dp'].month = d.getMonth();
      }
    }
  } else {
    dpState['_shared-dp'].selected = null;
    const now = new Date();
    dpState['_shared-dp'].year = now.getFullYear();
    dpState['_shared-dp'].month = now.getMonth();
  }
  dpState['_shared-dp'].view = 'day';
  renderCal('_shared-dp');

  // Position near the clicked cell
  const rect = cellSpan.getBoundingClientRect();
  _sharedDpEl.style.display = 'block';
  _sharedDpEl.style.left = rect.left + 'px';
  _sharedDpEl.style.top = (rect.bottom + 4) + 'px';
}

// Close shared datepicker on outside mousedown (mousedown fires before onclick,
// so the target is still in the DOM even when renderCal replaces innerHTML)
document.addEventListener('mousedown', e => {
  // Close shared dp
  if (_sharedDpEl && _sharedDpEl.style.display !== 'none') {
    if (!_sharedDpEl.contains(e.target) && !e.target.closest('.date-cell')) {
      _sharedDpEl.style.display = 'none';
      _sharedDpRow = null;
    }
  }
  // Close c-datepicker dropdowns
  if (!e.target.closest('.c-datepicker')) {
    document.querySelectorAll('.c-datepicker.open').forEach(dp => dp.classList.remove('open'));
  }
  // Close c-select dropdowns
  if (!e.target.closest('.c-select')) {
    document.querySelectorAll('.c-select.open').forEach(s => s.classList.remove('open'));
  }
});

// ══════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════
if (localStorage.getItem('po_theme') === 'light') {
  document.body.classList.add('light');
}

const token = localStorage.getItem('po_token');
if (token) { boot(); } else { renderAuth(); }