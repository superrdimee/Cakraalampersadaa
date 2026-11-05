// ===== PENANDA: script ini berhasil dimuat (dipakai pengaman di index.html) =====
window.__siteJsReady = true;

// ===== MENU MOBILE (HAMBURGER) =====
// Mendukung navbar lama (.nav-links + class "active")
// dan navbar baru Beranda (.nav-menu + class "open")
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links, .nav-menu');

if (menuToggle && navLinks) {
    const menuBaru = navLinks.classList.contains('nav-menu');
    const kelasBuka = menuBaru ? 'open' : 'active';

    const aturMenu = (buka) => {
        navLinks.classList.toggle(kelasBuka, buka);

        if (menuBaru) {
            menuToggle.setAttribute('aria-expanded', buka ? 'true' : 'false');
            menuToggle.setAttribute('aria-label', buka ? 'Tutup menu' : 'Buka menu');
        }
    };

    menuToggle.addEventListener('click', () => {
        aturMenu(!navLinks.classList.contains(kelasBuka));
    });

    // Tambahan khusus menu Beranda baru
    if (menuBaru) {
        // tutup menu setelah salah satu link diklik
        navLinks.addEventListener('click', (e) => {
            if (e.target.closest('a')) aturMenu(false);
        });

        // tutup dengan tombol Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') aturMenu(false);
        });

        // tutup jika klik di luar navbar
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#siteNav')) aturMenu(false);
        });

        // tutup otomatis saat layar melebar ke ukuran desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 960) aturMenu(false);
        });
    }
}

// ===== TOMBOL SWITCH BAHASA (ID/EN) =====
// Mendukung tombol tunggal lama (#langSwitch)
// dan saklar ID | EN di Beranda baru (.lang-pill button[data-lang])
const KUNCI_BAHASA = 'cakra-lang';
const langSwitch = document.getElementById('langSwitch');
const langPills = document.querySelectorAll('.lang-pill button[data-lang]');
let currentLang = 'id';

function bacaBahasaTersimpan() {
    try {
        return localStorage.getItem(KUNCI_BAHASA) === 'en' ? 'en' : 'id';
    } catch (e) {
        return 'id';
    }
}

function simpanBahasa(lang) {
    try {
        localStorage.setItem(KUNCI_BAHASA, lang);
    } catch (e) {
        // penyimpanan diblokir browser: abaikan, bahasa tetap berubah di halaman ini
    }
}

function terapkanBahasa(lang) {
    const elemenTeks = document.querySelectorAll('[data-id]');

    elemenTeks.forEach((el) => {
        const teks = el.getAttribute(lang === 'id' ? 'data-id' : 'data-en');
        if (teks !== null) {
            el.textContent = teks;
        }
    });

    document.documentElement.lang = lang;

    // tombol tunggal lama: tampilkan bahasa tujuan berikutnya
    if (langSwitch) {
        langSwitch.textContent = lang === 'id' ? 'EN' : 'ID';
    }

    // saklar ID | EN baru: tandai bahasa yang aktif
    langPills.forEach((btn) => {
        const aktif = btn.getAttribute('data-lang') === lang;
        btn.classList.toggle('active', aktif);
        btn.setAttribute('aria-pressed', aktif ? 'true' : 'false');
    });
}

if (langSwitch) {
    langSwitch.addEventListener('click', () => {
        currentLang = currentLang === 'id' ? 'en' : 'id';
        simpanBahasa(currentLang);
        terapkanBahasa(currentLang);
    });
}

langPills.forEach((btn) => {
    btn.addEventListener('click', () => {
        currentLang = btn.getAttribute('data-lang') === 'en' ? 'en' : 'id';
        simpanBahasa(currentLang);
        terapkanBahasa(currentLang);
    });
});

// pilihan bahasa diingat saat pindah halaman
currentLang = bacaBahasaTersimpan();
if (currentLang !== 'id') {
    terapkanBahasa(currentLang);
}

// ===== FADE-IN SAAT SCROLL =====
// .fade-in-section = halaman lama, .reveal = Beranda baru
const fadeElements = document.querySelectorAll('.fade-in-section, .reveal');

if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    fadeElements.forEach((el) => fadeObserver.observe(el));
} else {
    // browser lama tanpa IntersectionObserver: langsung tampilkan semuanya
    fadeElements.forEach((el) => el.classList.add('visible'));
}

// ===== NAVBAR BERUBAH SAAT SCROLL =====
// .navbar = halaman lama, .site-nav = Beranda baru
const navbar = document.querySelector('.navbar, .site-nav');

if (navbar) {
    const perbaruiNavbar = () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', perbaruiNavbar, { passive: true });
    perbaruiNavbar();
}

// ===== CAROUSEL PRODUK (geser dengan tombol panah) =====
const productsTrack = document.getElementById('productsTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (productsTrack && prevBtn && nextBtn) {
    const scrollAmount = 295;

    prevBtn.addEventListener('click', () => {
        productsTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        productsTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
}

// ===== GALERI PRODUK (thumbnail + panah) =====
const pdThumbs = document.querySelectorAll('.pd-thumb');
const pdMainImg = document.getElementById('pdMainImg');
const pdPrev = document.getElementById('pdPrev');
const pdNext = document.getElementById('pdNext');

if (pdMainImg && pdThumbs.length > 0) {
    let pdIndex = 0;

    function tampilkanGambar(index) {
        pdIndex = (index + pdThumbs.length) % pdThumbs.length;
        pdMainImg.src = pdThumbs[pdIndex].getAttribute('data-full');
        pdThumbs.forEach((t) => t.classList.remove('active'));
        pdThumbs[pdIndex].classList.add('active');
    }

    pdThumbs.forEach((thumb, i) => {
        thumb.addEventListener('click', () => tampilkanGambar(i));
    });

    if (pdPrev) pdPrev.addEventListener('click', () => tampilkanGambar(pdIndex - 1));
    if (pdNext) pdNext.addEventListener('click', () => tampilkanGambar(pdIndex + 1));
}

/* =========================================================
   DATA ARTIKEL — satu-satunya tempat yang perlu diedit
   saat menambah artikel baru. Dipakai oleh artikel.html
   dan bagian "Artikel Terbaru" di halaman depan (index.html).
   ========================================================= */
(function () {
    'use strict';

    /* ---------- DAFTAR ARTIKEL ----------
       Urutan tidak penting; website otomatis mengurutkan dari tanggal terbaru.
       cat: csr | lingkungan | pendidikan | perusahaan
       Tambahkan  featured: true  pada satu artikel jika ingin menyematkannya
       sebagai artikel utama (kalau tidak ada, artikel terbaru yang dipakai).

       ===== TEMPLATE ARTIKEL BARU (hapus tanda // di depan, ganti isinya,
       lalu tempel di bawah artikel terakhir. Jangan lupa koma di antara artikel) =====
       {
         href: "artikel-4.html", date: "2026-01-15", cat: "csr",
         img: "csr-cakrav4.png", alt: "Deskripsi foto",
         title:   { id: "Judul Indonesia", en: "English title" },
         excerpt: { id: "Ringkasan 1-2 kalimat.", en: "1-2 sentence summary." }
       }
    */
    var ARTIKEL = [
        {"href": "artikel-3.html", "date": "2025-01-18", "cat": "csr", "img": "csr-cakrav3.png", "alt": "Penyerahan bantuan kepada warga terdampak kebakaran di Desa Tumbang Danau", "title": {"id": "Salurkan Bantuan bagi Warga Terdampak Musibah Kebakaran di Desa Tumbang Danau", "en": "Aid Delivered to Residents Affected by the Fire Disaster in Tumbang Danau Village"}, "excerpt": {"id": "PT Cakra Alam Persada menyerahkan bantuan kepada warga Desa Tumbang Danau yang terdampak musibah kebakaran rumah, sebagai wujud kepedulian dan solidaritas terhadap masyarakat sekitar.", "en": "PT Cakra Alam Persada delivered aid to Tumbang Danau Village residents whose homes were affected by a fire, as an expression of care and solidarity with the surrounding community."}},
        {"href": "artikel-2.html", "date": "2025-03-22", "cat": "csr", "img": "csr-cakrav2.png", "alt": "Kegiatan bantuan pemasangan listrik bagi warga Desa Tumbang Danau", "title": {"id": "PT Cakra Alam Persada Dukung Peningkatan Akses Listrik bagi Warga Desa Tumbang Danau", "en": "PT Cakra Alam Persada Supports Improved Access to Electricity for Tumbang Danau Villagers"}, "excerpt": {"id": "PT Cakra Alam Persada melaksanakan kegiatan CSR berupa bantuan pemasangan listrik bagi warga Desa Tumbang Danau, Kabupaten Gunung Mas, sebagai wujud kepedulian terhadap kebutuhan dasar masyarakat.", "en": "PT Cakra Alam Persada carried out a CSR activity providing electrical installation assistance to residents of Tumbang Danau Village, Gunung Mas Regency, as an expression of care for the community's basic needs."}},
        {"href": "artikel-1.html", "date": "2025-12-10", "cat": "csr", "img": "csr-cakrav1.png", "alt": "Penyerahan bantuan dana Natal kepada Jemaat GBI Dahian Tambuk", "title": {"id": "Bantuan Dana Natal untuk Jemaat GBI Dahian Tambuk", "en": "Christmas Aid for the GBI Dahian Tambuk Congregation"}, "excerpt": {"id": "PT Cakra Alam Persada menyalurkan bantuan dana Natal kepada Jemaat GBI Dahian Tambuk di Desa Tumbang Danau sebagai bentuk kepedulian terhadap masyarakat sekitar.", "en": "PT Cakra Alam Persada delivered Christmas aid to the GBI Dahian Tambuk congregation in Tumbang Danau Village as an expression of care for the surrounding community."}}
    ];

    /* ---------- MESIN (tidak perlu diubah) ---------- */
    var MONTHS = {
        id: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'],
        en: ['January','February','March','April','May','June','July','August','September','October','November','December']
    };
    var CATS = {
        csr:        { id: 'CSR',                 en: 'CSR',               cls: 'pk-badge-brown' },
        lingkungan: { id: 'Lingkungan',          en: 'Environment',       cls: 'pk-badge-green' },
        pendidikan: { id: 'Pendidikan',          en: 'Education',         cls: 'pk-badge-green' },
        perusahaan: { id: 'Kegiatan Perusahaan', en: 'Company Activities', cls: 'pk-badge-brown' }
    };

    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function fmt(iso, l) {
        var p = iso.split('-');
        return parseInt(p[2], 10) + ' ' + MONTHS[l][parseInt(p[1], 10) - 1] + ' ' + p[0];
    }
    function lang() {
        var a = document.querySelector('.lang-pill .active');
        return a ? a.getAttribute('data-lang') : 'id';
    }
    function all() {
        return ARTIKEL.slice().sort(function (a, b) { return a.date < b.date ? 1 : (a.date > b.date ? -1 : 0); });
    }
    function bi(o, tag, extra) {   // elemen daun dua bahasa
        return '<' + tag + (extra || '') + ' data-id="' + esc(o.id) + '" data-en="' + esc(o.en) + '">' + esc(o.id) + '</' + tag + '>';
    }
    function badge(a) {
        var c = CATS[a.cat] || CATS.csr;
        return bi(c, 'span', ' class="pk-badge ' + c.cls + '"');
    }
    function dateP(a) {
        return '<p class="ar-date"><svg class="ic"><use href="#i-calendar"/></svg><time datetime="' + esc(a.date) +
            '" data-id="' + fmt(a.date, 'id') + '" data-en="' + fmt(a.date, 'en') + '">' + fmt(a.date, 'id') + '</time></p>';
    }
    function card(a) {
        return '<article class="pk-card ar-card" data-cat="' + esc(a.cat) + '">' +
            '<div class="pk-media">' + badge(a) +
            '<div class="pk-ph" aria-hidden="true"><svg class="ic"><use href="#i-camera"/></svg>' +
            bi({ id: 'Foto kegiatan menyusul', en: 'Activity photo coming soon' }, 'span') + '</div>' +
            '<img src="' + esc(a.img) + '" alt="' + esc(a.alt) + '" loading="lazy" onerror="this.remove()"></div>' +
            '<div class="pk-body">' + dateP(a) + bi(a.title, 'h3') + bi(a.excerpt, 'p', ' class="ar-excerpt"') +
            '<div class="pk-foot"><a href="' + esc(a.href) + '" class="pk-more" aria-label="' + esc(a.title.id) + '">' +
            bi({ id: 'Baca selengkapnya', en: 'Read more' }, 'span') +
            '<span class="pk-go"><svg class="ic"><use href="#i-arrow"/></svg></span></a></div></div></article>';
    }
    function featured(a) {
        return '<article class="ar-featured" data-cat="' + esc(a.cat) + '">' +
            '<a class="ar-feat-media" href="' + esc(a.href) + '" tabindex="-1" aria-hidden="true">' + badge(a) +
            '<img src="' + esc(a.img) + '" alt="' + esc(a.alt) + '" onerror="this.remove()"></a>' +
            '<div class="ar-feat-body">' + dateP(a) + bi(a.title, 'h2') + bi(a.excerpt, 'p', ' class="ar-excerpt"') +
            '<a href="' + esc(a.href) + '" class="ar-feat-btn" aria-label="' + esc(a.title.id) + '">' +
            bi({ id: 'Baca Selengkapnya', en: 'Read More' }, 'span') +
            '<svg class="ic"><use href="#i-arrow"/></svg></a></div></article>';
    }
    function translate(root) {
        var l = lang();
        root.querySelectorAll('[data-id]').forEach(function (el) {
            var v = el.getAttribute('data-' + l);
            if (v !== null) el.textContent = v;
        });
    }
    function retranslateAll() {
        document.querySelectorAll('[data-dyn]').forEach(translate);
    }

    window.CakraArtikel = { all: all, card: card, featured: featured, translate: translate, lang: lang };

    document.addEventListener('DOMContentLoaded', function () {
        // Bagian "Artikel Terbaru" di halaman depan
        var home = document.getElementById('homeArtikel');
        if (home) {
            var n = parseInt(home.getAttribute('data-count') || '3', 10);
            home.innerHTML = all().slice(0, n).map(card).join('');
            translate(home);
        }
        document.querySelectorAll('[data-lang]').forEach(function (b) {
            b.addEventListener('click', function () { setTimeout(retranslateAll, 0); });
        });
        setTimeout(retranslateAll, 0);
    });
})();