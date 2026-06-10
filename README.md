# Esenef Tools V2 — Digital Seller Assistant

Esenef Tools V2 adalah web app static ringan untuk bantu pemula jualan dari HP bikin konten promosi tanpa blank. Versi ini dibuat seperti **compact AI assistant dashboard**: user isi nama produk, klik generate, lalu ringkasan utama langsung muncul dekat form.

## Fungsi Utama

Fitur utama tools ini adalah **Buat Paket Promosi**. Dari satu nama produk, tools akan membuat:

- Ringkasan cepat: target utama, angle terbaik, hook terbaik, dan CTA terbaik
- Tab **Strategi**: analisis produk, target audiens, dan angle terbaik
- Tab **Konten**: hook, caption, dan CTA siap copy
- Tab **Video**: script video pendek dan ide visual
- Tab **DM & Plan**: balasan DM calon pembeli dan rencana posting 5 hari

## Target Pengguna

- Pemula jualan online dari HP
- Affiliate Shopee dan TikTok Shop
- Reseller produk digital
- Kreator konten yang sering blank
- Seller kecil yang butuh promosi simpel dan rapi

## Cara Pakai

1. Buka `index.html` langsung di browser.
2. Isi **Nama produk**.
3. Opsional: pilih jenis produk, platform, dan gaya konten.
4. Klik **Generate Paket**.
5. Baca ringkasan cepat yang muncul tepat di bawah form.
6. Buka tab yang dibutuhkan: Strategi, Konten, Video, atau DM & Plan.
7. Klik tombol copy kecil untuk menyalin bagian tertentu, atau gunakan sticky action bar di HP.

## Fitur Utama

- Static web app tanpa backend dan tanpa framework.
- Form compact yang langsung terlihat di layar awal.
- Quick Result Preview setelah generate.
- Output dibagi dalam tab agar tidak memanjang ekstrem.
- Accordion/collapse untuk bagian panjang seperti caption, script tambahan, DM, dan posting plan.
- Tombol copy per tab dan per item penting.
- Hook dan CTA tampil 5 dulu, lalu bisa klik **Lihat 5 lagi**.
- Regenerate dan Ringkas untuk variasi output.
- Riwayat sederhana 5 hasil terakhir memakai `localStorage`.
- Sticky action bar mobile berisi Copy Semua, Regenerate, dan Ringkas.
- Tema dark navy/charcoal dengan aksen blue-violet, bukan hijau dominan.

## Teknologi

Project ini hanya memakai file static:

- `index.html`
- `style.css`
- `script.js`
- `README.md`

Tidak ada React, Vue, Next, build tool, file binary, gambar besar, video, atau font custom.

## Deploy ke GitHub Pages

1. Push repository ke GitHub.
2. Buka **Settings** repository.
3. Masuk ke **Pages**.
4. Pilih source dari branch utama `main`.
5. Pilih folder root `/`.
6. Klik **Save**.
7. Buka URL GitHub Pages yang muncul setelah deploy selesai.

Karena app ini static murni, tidak perlu konfigurasi server tambahan. Pastikan `index.html`, `style.css`, `script.js`, dan `README.md` tetap berada di root repository agar GitHub Pages bisa langsung membaca halaman utama.
