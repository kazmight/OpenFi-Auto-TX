## OpenFi Pharos Bot
## Bot otomatis untuk berinteraksi dengan protokol lending OpenFi di Pharos Testnet. Dirancang untuk membantu pengguna mensimulasikan aktivitas transaksi seperti supply, mint, borrow, dan withdraw token.

## Jangan lupa join telegram channel Dasar Pemulung untuk update seputar script/bot airdrop.
## Link telegram: https://t.me/dasarpemulung

## Fitur Utama
Multi-Wallet Support: Mendukung penggunaan banyak dompet yang dimuat dari file .env.
Interaksi DeFi: Melakukan aksi seperti:
Supply PHRS (token native testnet).
Mint token ERC-20 dari faucet (NVIDIA, USDT, USDC, GOLD, TSLA, BTC).
Supply token ERC-20 ke protokol lending.
Borrow token ERC-20 dari protokol lending.
Withdraw token ERC-20 dari protokol lending.
Transaksi Berulang: Menjalankan jumlah transaksi yang dapat dikonfigurasi per dompet untuk setiap aksi.
Penundaan Acak: Jeda acak antar transaksi untuk meniru perilaku manusia dan menghindari rate limiting.
Antarmuka Interaktif: Menu berbasis konsol yang mudah digunakan untuk memilih aksi.
Logging Visual: Menggunakan warna untuk output konsol agar lebih mudah dibaca.
Instalasi
Sebelum memulai, pastikan Anda memiliki Node.js terinstal di sistem Anda.

## 1. Clone Repository:
```Bash
git clone https://github.com/kazmight/OpenFi-Auto-TX.git
cd OpenFi-Auto-TX
```

## 2. Instal Dependensi:
```Bash
npm install
```

## 3. Konfigurasi:
Buka file .env atau nano .env
Buat file bernama .env di direktori root proyek Anda. File ini akan menyimpan private key dompet Anda. PENTING: Jangan pernah membagikan file .env Anda atau mengunggahnya ke repositori publik.

## Contoh file .env:
PRIVATE_KEY_1=0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b
PRIVATE_KEY_2=0xf1e2d3c4b5a67b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c
# Tambahkan lebih banyak PRIVATE_KEY_X= di sini untuk setiap dompet yang ingin Anda gunakan
Penggunaan
Setelah semua konfigurasi selesai, Anda dapat menjalankan bot dari terminal.

## 4. Running Script:
```Bash
node index.js
```

Disclaimer
Bot ini disediakan hanya untuk tujuan edukasi dan pengujian di testnet. Penggunaan di mainnet atau untuk tujuan farming airdrop yang melanggar ketentuan layanan platform mana pun adalah risiko Anda sendiri. Selalu berhati-hati dan pahami risiko yang terkait dengan penggunaan alat otomatis.
