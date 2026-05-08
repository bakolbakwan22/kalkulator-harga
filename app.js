'use strict';

const STORAGE_KEY = 'hhj_state_v1';
const MARKETPLACE_FEES = {
  shopee: 8,
  tokopedia: 6.5,
  tiktok: 7.5,
  lazada: 6,
  custom: 0,
};

const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
const numberFmt = new Intl.NumberFormat('id-ID');

const icons = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z"/></svg>',
  calculator: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12v8H4v-8M2 7h20v5H2zM12 22V7M12 7H7.5A2.5 2.5 0 1 1 10 4.5L12 7Zm0 0h4.5A2.5 2.5 0 1 0 14 4.5L12 7Z"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>',
  help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c-.9 1.5-2.9 1.3-2.9 3M12 17h.01"/></svg>',
  trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>',
  zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2 3 14h8l-1 8 11-14h-8l1-6Z"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
  package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21 16-9 5-9-5V8l9-5 9 5v8Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4v15.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5"/></svg>',
  wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 7V4H5a2 2 0 0 0 0 4h15v12H5a2 2 0 0 1-2-2V6"/><path d="M16 13h.01"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
};

const navMain = [
  ['dashboard', 'Dashboard', 'dashboard'],
  ['calculator', 'Kalkulator', 'calculator'],
  ['history', 'Riwayat', 'clock'],
  ['payment', 'Pembayaran', 'card'],
  ['affiliate', 'Afiliasi & Komisi', 'gift'],
];
const navOther = [
  ['profile', 'Profil & Pengaturan', 'user'],
  ['help', 'Bantuan', 'help'],
];

const defaultState = {
  user: { name: 'Morena', email: 'jualsenter22@gmail.com' },
  plan: 'Free',
  planLabel: 'Warung Plan',
  calculations: [],
};
let state = loadState();
let currentPage = 'dashboard';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : structuredClone(defaultState);
  } catch (_) {
    return structuredClone(defaultState);
  }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function $(id) { return document.getElementById(id); }
function icon(name, className = 'nav-icon') { return `<span class="${className}" aria-hidden="true">${icons[name] || icons.dashboard}</span>`; }
function money(value) { return rupiah.format(Math.max(0, Math.round(Number(value) || 0))); }
function pct(value) { return `${numberFmt.format(Number(value) || 0)}%`; }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c])); }

function buildLayout() {
  document.getElementById('app').innerHTML = `
    <div class="app-shell">
      <div id="overlay" class="overlay"></div>
      <aside id="sidebar" class="sidebar">
        <div class="brand"><div class="brand-icon">${icons.calculator}</div><span>HitungHargaJual</span></div>
        <nav class="nav">
          <section class="nav-section"><p class="nav-title">Menu Utama</p>${navMain.map(navButton).join('')}</section>
          <section class="nav-section"><p class="nav-title">Lainnya</p>${navOther.map(navButton).join('')}</section>
        </nav>
        <div class="user-box">
          <div class="user-card">
            <div class="avatar">${escapeHtml(state.user.name.charAt(0) || 'U')}</div>
            <div class="user-info"><p class="user-name">${escapeHtml(state.user.name)}</p><p class="user-email">${escapeHtml(state.user.email)}</p></div>
            <span class="nav-icon">${icons.logout}</span>
          </div>
        </div>
      </aside>
      <main class="main">
        <header class="mobile-header">
          <div class="mobile-header-inner">
            <div class="brand" style="height:auto;border:0;padding:0"><div class="brand-icon">${icons.calculator}</div><span>HitungHargaJual</span></div>
            <button id="menuToggle" class="menu-toggle" aria-label="Buka menu">${icons.menu}</button>
          </div>
        </header>
        <div class="content" id="content"></div>
      </main>
    </div>`;

  document.querySelectorAll('[data-page]').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.page)));
  $('menuToggle')?.addEventListener('click', toggleMenu);
  $('overlay').addEventListener('click', closeMenu);
}
function navButton([page, label, iconName]) {
  return `<button class="nav-item ${currentPage === page ? 'active' : ''}" data-page="${page}">${icon(iconName)}<span>${label}</span></button>`;
}
function toggleMenu() { $('sidebar').classList.toggle('open'); $('overlay').classList.toggle('show'); }
function closeMenu() { $('sidebar').classList.remove('open'); $('overlay').classList.remove('show'); }
function navigate(page) { currentPage = page; closeMenu(); render(); }

function getStats() {
  const count = state.calculations.length;
  const month = new Date().toISOString().slice(0, 7);
  const monthCount = state.calculations.filter(x => x.date.startsWith(month)).length;
  const avgProfit = count ? state.calculations.reduce((a, b) => a + b.targetProfit, 0) / count : 0;
  return [
    ['Total Perhitungan', numberFmt.format(count), `${numberFmt.format(monthCount)} bulan ini`, 'calculator', 'blue'],
    ['Rata-rata Target Profit', money(avgProfit), count ? 'Berdasarkan semua data' : 'Belum ada data', 'trend', 'green'],
    ['Status Langganan', state.plan, state.planLabel, 'zap', 'orange', true],
    ['Kredit Digunakan', '0', 'Unlimited', 'wallet', 'purple'],
  ];
}

function render() {
  buildLayout();
  const content = $('content');
  const pages = {
    dashboard: renderDashboard,
    calculator: renderCalculator,
    history: renderHistory,
    payment: renderPayment,
    affiliate: renderAffiliate,
    profile: renderProfile,
    help: renderHelp,
  };
  content.innerHTML = pages[currentPage]();
  bindPageEvents();
}

function pageHeader(title, subtitle) { return `<section><h1 class="page-title">${title}</h1><p class="page-subtitle">${subtitle}</p></section>`; }
function statCard([title, value, caption, iconName, tone, pill]) {
  return `<article class="card stat-card"><div><p class="stat-title">${title}</p><h3 class="stat-value">${value}</h3>${pill ? `<span class="stat-pill">${caption}</span>` : `<p class="stat-caption">${caption}</p>`}</div><div class="icon-badge ${tone}">${icons[iconName]}</div></article>`;
}
function renderDashboard() {
  const recent = state.calculations.slice(0, 5);
  return `
    ${pageHeader('Dashboard', `Selamat datang kembali, ${escapeHtml(state.user.name)} !`)}
    <section class="stats-grid">${getStats().map(statCard).join('')}</section>
    <section class="card panel">
      <div class="panel-header"><h2 class="panel-title">Perhitungan Terbaru</h2><button class="btn secondary" data-page="history">${icon('eye')} Lihat Semua</button></div>
      ${recent.length ? tableHistory(recent) : emptyState('calculator', 'Belum Ada Perhitungan', 'Mulai hitung harga jual produk Anda sekarang', '<button class="btn" data-page="calculator">Mulai Hitung</button>')}
    </section>
    <section style="margin-top:30px"><h2 class="panel-title">Alat & Fitur Seller</h2><div class="tools-grid">
      ${toolCard('Hitung Harga Jual', 'Hitung harga jual optimal untuk produk Anda', 'calculator', 'orange', 'Mulai', 'calculator', true)}
      ${toolCard('Cek Sisa Cuan', 'Hitung estimasi profit bersih Anda', 'trend', 'green', 'Mulai', 'calculator')}
      ${toolCard('Daftar Produk & Biaya Admin', 'Cek referensi biaya admin marketplace terbaru', 'package', 'blue', 'Lihat', 'help')}
      ${toolCard('Pusat Edukasi Seller', 'Panduan dan tips bisnis khusus seller', 'book', 'purple', 'Belajar', 'help')}
    </div></section>`;
}
function toolCard(title, desc, iconName, tone, action, page, primary) {
  return `<article class="card tool-card"><div class="tool-main"><div class="icon-badge ${tone}">${icons[iconName]}</div><div><p class="tool-title">${title}</p><p class="tool-desc">${desc}</p></div></div><button class="btn ${primary ? '' : 'secondary'}" data-page="${page}">${action}</button></article>`;
}
function emptyState(iconName, title, text, action = '') {
  return `<div class="empty-state"><div><div class="empty-icon">${icons[iconName]}</div><h3 class="empty-title">${title}</h3><p class="empty-text">${text}</p><div style="margin-top:18px">${action}</div></div></div>`;
}
function renderCalculator() {
  return `
    ${pageHeader('Kalkulator Harga Jual', 'Masukkan biaya produk, target profit, dan biaya marketplace untuk menghitung harga jual optimal.')}
    <section class="card panel">
      <div class="panel-header"><h2 class="panel-title">Form Perhitungan</h2><span class="small-muted">Data tersimpan otomatis di browser Anda</span></div>
      <form id="calcForm" class="form-grid">
        ${field('Nama Produk', 'productName', 'text', 'Contoh: Senter LED Mini')}
        <div class="field"><label>Marketplace</label><select id="marketplace"><option value="shopee">Shopee</option><option value="tokopedia">Tokopedia</option><option value="tiktok">TikTok Shop</option><option value="lazada">Lazada</option><option value="custom">Custom</option></select></div>
        ${field('Modal Produk', 'cost', 'number', '50000')}
        ${field('Biaya Packing', 'packing', 'number', '3000')}
        ${field('Biaya Operasional Lain', 'operational', 'number', '2000')}
        ${field('Target Profit', 'profit', 'number', '15000')}
        ${field('Biaya Admin Marketplace (%)', 'fee', 'number', '8')}
        ${field('Diskon / Voucher Ditanggung Seller', 'discount', 'number', '0')}
        <div class="form-actions"><button class="btn" type="submit">${icon('calculator')} Hitung & Simpan</button><button class="btn ghost" type="button" id="resetCalc">Reset</button></div>
      </form>
      <div class="result-grid" id="resultGrid">${resultBoxes({ baseCost: 0, adminFee: 0, recommendedPrice: 0, netProfit: 0 })}</div>
    </section>`;
}
function field(label, id, type, placeholder) { return `<div class="field"><label for="${id}">${label}</label><input class="input" id="${id}" type="${type}" min="0" placeholder="${placeholder}" /></div>`; }
function resultBoxes(r) {
  return `<div class="result-box"><p class="result-label">Total Modal</p><p class="result-value">${money(r.baseCost)}</p></div><div class="result-box"><p class="result-label">Estimasi Admin</p><p class="result-value">${money(r.adminFee)}</p></div><div class="result-box"><p class="result-label">Harga Jual Rekomendasi</p><p class="result-value">${money(r.recommendedPrice)}</p></div><div class="result-box"><p class="result-label">Profit Bersih</p><p class="result-value">${money(r.netProfit)}</p></div>`;
}
function calculateFromForm() {
  const productName = $('productName').value.trim() || 'Produk Tanpa Nama';
  const marketplace = $('marketplace').value;
  const cost = +$('cost').value || 0;
  const packing = +$('packing').value || 0;
  const operational = +$('operational').value || 0;
  const targetProfit = +$('profit').value || 0;
  const feePercent = +$('fee').value || 0;
  const discount = +$('discount').value || 0;
  const baseCost = cost + packing + operational + discount;
  const denominator = Math.max(0.01, 1 - feePercent / 100);
  const recommendedPrice = Math.ceil((baseCost + targetProfit) / denominator / 100) * 100;
  const adminFee = recommendedPrice * (feePercent / 100);
  const netProfit = recommendedPrice - adminFee - baseCost;
  return { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), date: new Date().toISOString(), productName, marketplace, cost, packing, operational, targetProfit, feePercent, discount, baseCost, adminFee, recommendedPrice, netProfit };
}
function renderHistory() {
  return `
    ${pageHeader('Riwayat Perhitungan', 'Lihat, evaluasi, dan hapus hasil kalkulasi harga jual yang pernah Anda buat.')}
    <section class="card panel">
      <div class="panel-header"><h2 class="panel-title">Semua Riwayat</h2><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" data-page="calculator">Hitung Baru</button><button class="btn ghost" id="clearHistory">Hapus Semua</button></div></div>
      ${state.calculations.length ? tableHistory(state.calculations) : emptyState('clock', 'Riwayat Kosong', 'Belum ada kalkulasi yang tersimpan.', '<button class="btn" data-page="calculator">Mulai Hitung</button>')}
    </section>`;
}
function tableHistory(rows) {
  return `<div class="table-wrap"><table><thead><tr><th>Tanggal</th><th>Produk</th><th>Marketplace</th><th>Harga Jual</th><th>Profit</th><th>Admin</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${rows.map(row => `<tr><td>${new Date(row.date).toLocaleDateString('id-ID')}</td><td>${escapeHtml(row.productName)}</td><td>${escapeHtml(row.marketplace)}</td><td><strong>${money(row.recommendedPrice)}</strong></td><td>${money(row.netProfit)}</td><td>${pct(row.feePercent)}</td><td><span class="badge">Tersimpan</span></td><td><button class="btn ghost" data-delete="${row.id}">Hapus</button></td></tr>`).join('')}</tbody></table></div>`;
}
function renderPayment() {
  return `
    ${pageHeader('Pembayaran', 'Pilih paket yang sesuai dengan kebutuhan bisnis seller Anda.')}
    <section class="pricing-grid">
      ${priceCard('Warung', 'Rp 0', 'Gratis untuk mulai menghitung.', ['Kalkulator dasar', 'Riwayat lokal', 'Unlimited kredit lokal'], false)}
      ${priceCard('Toko', 'Rp 49rb', 'Untuk seller aktif yang butuh fitur lebih.', ['Export riwayat CSV', 'Template strategi harga', 'Prioritas fitur baru'], true)}
      ${priceCard('Grosir', 'Rp 149rb', 'Untuk tim dan volume produk besar.', ['Multi-user', 'Import produk massal', 'Dashboard analitik lanjutan'], false)}
    </section>
    <div class="notice">Integrasi payment gateway seperti Midtrans, Xendit, Stripe, atau Duitku membutuhkan backend. Versi ini sudah siap UI dan alur frontend-nya.</div>`;
}
function priceCard(name, price, desc, features, featured) {
  return `<article class="card price-card ${featured ? 'featured' : ''}"><h3 class="price-name">${name}</h3><p class="price">${price}<span>/bulan</span></p><p class="page-subtitle">${desc}</p><ul class="features">${features.map(f => `<li>✓ ${f}</li>`).join('')}</ul><button class="btn ${featured ? '' : 'secondary'}" style="width:100%">Pilih Paket</button></article>`;
}
function renderAffiliate() {
  return `${pageHeader('Afiliasi & Komisi', 'Bagikan aplikasi ini dan pantau potensi komisi Anda.')}<section class="card panel"><div class="panel-header"><h2 class="panel-title">Program Afiliasi</h2></div><div style="padding:24px"><p>Link referral Anda:</p><input class="input" readonly value="https://hitunghargajual.id/?ref=morena" /><div class="result-grid" style="padding:20px 0 0">${resultBoxes({ baseCost: 0, adminFee: 0, recommendedPrice: 0, netProfit: 0 }).replace('Total Modal','Total Klik').replace('Estimasi Admin','Referral Aktif').replace('Harga Jual Rekomendasi','Komisi Pending').replace('Profit Bersih','Komisi Cair')}</div></div></section>`;
}
function renderProfile() {
  return `${pageHeader('Profil & Pengaturan', 'Kelola nama dan email yang tampil di dashboard.')}<section class="card panel"><div class="panel-header"><h2 class="panel-title">Data Profil</h2></div><form id="profileForm" class="form-grid">${field('Nama', 'profileName', 'text', 'Nama Anda')}${field('Email', 'profileEmail', 'email', 'email@domain.com')}<div class="form-actions"><button class="btn" type="submit">Simpan Profil</button></div></form></section>`;
}
function renderHelp() {
  return `${pageHeader('Bantuan', 'Panduan singkat menggunakan aplikasi.')}<section class="card panel"><div class="panel-header"><h2 class="panel-title">Cara Pakai</h2></div><div style="padding:24px;display:grid;gap:16px"><p><strong>1.</strong> Buka menu Kalkulator dan masukkan modal, packing, biaya operasional, target profit, dan admin marketplace.</p><p><strong>2.</strong> Klik Hitung & Simpan untuk mendapatkan rekomendasi harga jual.</p><p><strong>3.</strong> Buka Riwayat untuk melihat hasil perhitungan sebelumnya.</p><p><strong>4.</strong> Untuk production penuh dengan login, database, dan pembayaran sungguhan, sambungkan backend.</p></div></section>`;
}

function bindPageEvents() {
  document.querySelectorAll('[data-page]').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.page)));
  document.querySelectorAll('[data-delete]').forEach(btn => btn.addEventListener('click', () => {
    state.calculations = state.calculations.filter(x => x.id !== btn.dataset.delete);
    saveState(); render();
  }));
  $('clearHistory')?.addEventListener('click', () => {
    if (confirm('Hapus semua riwayat perhitungan?')) { state.calculations = []; saveState(); render(); }
  });
  const marketplace = $('marketplace');
  if (marketplace) marketplace.addEventListener('change', () => { $('fee').value = MARKETPLACE_FEES[marketplace.value] ?? 0; });
  $('resetCalc')?.addEventListener('click', () => { $('calcForm').reset(); $('fee').value = MARKETPLACE_FEES[$('marketplace').value] || 0; $('resultGrid').innerHTML = resultBoxes({ baseCost: 0, adminFee: 0, recommendedPrice: 0, netProfit: 0 }); });
  $('calcForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const result = calculateFromForm();
    $('resultGrid').innerHTML = resultBoxes(result);
    state.calculations.unshift(result);
    state.calculations = state.calculations.slice(0, 200);
    saveState();
  });
  if ($('calcForm') && !$('fee').value) $('fee').value = MARKETPLACE_FEES[$('marketplace').value] || 0;
  const profileForm = $('profileForm');
  if (profileForm) {
    $('profileName').value = state.user.name;
    $('profileEmail').value = state.user.email;
    profileForm.addEventListener('submit', e => {
      e.preventDefault();
      state.user.name = $('profileName').value.trim() || 'User';
      state.user.email = $('profileEmail').value.trim() || 'user@email.com';
      saveState(); render();
    });
  }
}

render();
