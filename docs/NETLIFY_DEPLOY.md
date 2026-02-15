# Panduan Deploy ke Netlify

Panduan lengkap untuk deploy aplikasi Vue.js + Vite + Supabase ke Netlify.

## 📋 Prasyarat

Sebelum memulai, pastikan Anda memiliki:

- [x] Akun GitHub
- [x] Akun Netlify (gratis)
- [x] Proyek sudah di-push ke GitHub
- [x] Environment variables Supabase (URL dan Anon Key)

## 🚀 Langkah 1: Persiapan Proyek

### 1.1 Build Proyek Lokal

Pastikan proyek bisa di-build dengan sukses:

```bash
# Install dependencies
npm install

# Build untuk production
npm run build
```

### 1.2 Push ke GitHub

Jika belum, push proyek ke GitHub:

```bash
# Inisialisasi git (jika belum)
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "Initial commit"

# Tambahkan remote repository
git remote add origin https://github.com/username/vue-laporan-keuangan.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

## 🌐 Langkah 2: Deploy ke Netlify

### 2.1 Login ke Netlify

1. Buka [netlify.com](https://www.netlify.com/)
2. Sign up atau login dengan akun GitHub Anda

### 2.2 Import Repository

1. Di dashboard Netlify, klik **"Add new site"** → **"Import an existing project"**
2. Pilih repository GitHub Anda (`vue-laporan-keuangan`)
3. Klik **"Import site"**

### 2.3 Konfigurasi Build

Netlify akan otomatis mendeteksi konfigurasi Vite. Pastikan setting berikut:

| Setting               | Value           |
| --------------------- | --------------- |
| **Build command**     | `npm run build` |
| **Publish directory** | `dist`          |
| **Branch to deploy**  | `main`          |

Klik **"Deploy site"** untuk memulai deployment.

## 🔧 Langkah 3: Konfigurasi Environment Variables

### 3.1 Tambahkan Environment Variables

1. Di dashboard Netlify, buka **Site settings**
2. Scroll ke **Build & deploy** → **Environment variables**
3. Klik **"Add a variable"** dan tambahkan:

| Variable                 | Value                              | Deskripsi                 |
| ------------------------ | ---------------------------------- | ------------------------- |
| `VITE_SUPABASE_URL`      | `https://your-project.supabase.co` | URL Supabase project Anda |
| `VITE_SUPABASE_ANON_KEY` | `your-anon-key-here`               | Supabase Anon Key         |

**Catatan:** Nilai-nilai ini bisa Anda dapatkan dari file `.env` lokal atau dashboard Supabase.

### 3.2 Redeploy

Setelah menambahkan environment variables:

1. Klik **"Deploys"** di menu Netlify
2. Scroll ke **Production deploys**
3. Klik **"Trigger deploy"** → **"Deploy site"**

## 📝 Langkah 4: Konfigurasi Router (Opsional)

Jika Anda mengalami masalah dengan Vue Router saat refresh halaman, tambahkan file `_redirects`:

### 4.1 Buat File `_redirects`

Buat file baru di `public/_redirects`:

```bash
# Buat file _redirects di folder public
touch public/_redirects
```

### 4.2 Isi File `_redirects`

```txt
/* /index.html 200
```

### 4.3 Push dan Redeploy

```bash
git add public/_redirects
git commit -m "Add _redirects for Vue Router"
git push
```

Netlify akan otomatis redeploy.

## 🎨 Langkah 5: Custom Domain (Opsional)

### 5.1 Gunakan Subdomain Netlify Gratis

1. Di dashboard Netlify, buka **Site settings**
2. Klik **"Change site name"**
3. Masukkan nama site baru, misalnya `vue-laporan-keuangan`
4. URL Anda akan menjadi: `https://vue-laporan-keuangan.netlify.app`

### 5.2 Gunakan Custom Domain Sendiri

Jika Anda punya domain sendiri:

1. Di **Site settings**, klik **"Domain management"**
2. Klik **"Add custom domain"**
3. Masukkan domain Anda, misalnya `laporan.yourdomain.com`
4. Ikuti instruksi DNS yang diberikan Netlify

## 🔄 Langkah 6: Continuous Deployment

Setiap kali Anda push ke GitHub, Netlify akan otomatis redeploy:

```bash
# Buat perubahan
git add .
git commit -m "Update features"
git push

# Netlify akan otomatis build dan deploy
```

## 📊 Monitoring Deployment

### 6.1 Cek Status Deployment

1. Buka **Deploys** di dashboard Netlify
2. Lihat log deployment untuk setiap commit
3. Jika ada error, log akan menampilkan detail error

### 6.2 Preview Deployments

Netlify menyediakan preview deployments untuk setiap Pull Request:

1. Buat branch baru dan push
2. Buat Pull Request di GitHub
3. Netlify akan otomatis deploy preview
4. Review preview sebelum merge ke main

## 🐛 Troubleshooting

### Masalah: Build Gagal

**Error:** `npm ERR! missing script: build`

**Solusi:** Pastikan `package.json` memiliki script build:

```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

### Masalah: Environment Variables Tidak Terbaca

**Error:** `Supabase client is not configured`

**Solusi:**

1. Pastikan environment variables ditambahkan di Netlify (bukan hanya lokal)
2. Pastikan nama variable menggunakan prefix `VITE_`
3. Redeploy setelah menambahkan environment variables

### Masalah: 404 saat Refresh Halaman

**Error:** Halaman 404 saat refresh di browser

**Solusi:** Tambahkan file `public/_redirects` (lihat Langkah 4)

### Masalah: CORS Error

**Error:** `Access to fetch at ... has been blocked by CORS policy`

**Solusi:**

1. Pastikan URL Supabase benar
2. Cek CORS settings di dashboard Supabase
3. Pastikan Anon Key benar

## 📚 Referensi Tambahan

- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/build.html)
- [Vue Router HTML5 History Mode](https://router.vuejs.org/guide/essentials/history-mode.html)
- [Supabase Client Setup](https://supabase.com/docs/guides/getting-started/quickstarts/vuejs)

## 🎉 Selesai!

Aplikasi Anda sekarang sudah live di Netlify! 🚀

**URL Default:** `https://your-site-name.netlify.app`

**Fitur yang aktif:**

- ✅ Continuous deployment dari GitHub
- ✅ SSL/HTTPS gratis
- ✅ CDN global
- ✅ Preview deployments untuk PR
- ✅ Custom domain support
- ✅ Form handling gratis (jika diperlukan)
- ✅ Serverless functions (jika diperlukan)

---

**Tips Tambahan:**

- Gunakan Netlify CLI untuk deploy lokal: `npm install -g netlify-cli`
- Cek bandwidth usage di dashboard Netlify
- Upgrade ke Netlify Pro jika butuh lebih banyak build time
