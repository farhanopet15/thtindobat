# Mini-Indobat Inventory System

Mini-Indobat Inventory System adalah sistem manajemen stok sederhana untuk PBF Farmasi.  
Project ini dibuat sebagai **Take Home Test Fullstack Developer** dengan fokus pada **data integrity** dan **concurrency safety**.

---

## Tech Stack
- Backend: Go (Gin, GORM)
- Frontend: Next.js (TypeScript)
- Database: PostgreSQL

---

## Project Structure
.
├── backend
│ ├── config
│ ├── handler
│ ├── model
│ ├── repository
│ ├── routes
│ ├── service
│ ├── main.go
│ ├── go.mod
│ ├── go.sum
│ └── .env.example
│
├── frontend
│ ├── pages
│ ├── lib
│ ├── public
│ ├── styles
│ ├── package.json
│ ├── tsconfig.json
│ └── .env.local.example
│
└── README.md

yaml
Salin kode

---

## Setup Database
Buat database PostgreSQL:
```sql
CREATE DATABASE THTINDOBAT;
Run Backend
bash
Salin kode
cd backend
cp .env.example .env
# sesuaikan DB_PASSWORD dengan environment lokal
go mod tidy
go run main.go
Backend akan berjalan di:

arduino
Salin kode
http://localhost:8080
Tabel products dan orders dibuat otomatis menggunakan GORM AutoMigrate.

Run Frontend
bash
Salin kode
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
Frontend akan berjalan di:

arduino
Salin kode
http://localhost:3000
API Endpoints
GET /products
Menampilkan daftar produk obat.

POST /products
Menambahkan produk baru.

json
Salin kode
{
  "name": "Paracetamol",
  "stock": 10,
  "price": 5000
}
POST /order
Melakukan transaksi pembelian.

json
Salin kode
{
  "product_id": 1,
  "quantity": 1,
  "discount_percent": 10
}
Concurrency Safety
Endpoint POST /order diimplementasikan menggunakan:

Database Transaction

Row-level Locking (SELECT ... FOR UPDATE)

Jika stok barang tersisa 1 dan terdapat banyak request bersamaan:

Hanya 1 request yang berhasil

Request lainnya gagal

Stok tidak pernah minus

Testing
Manual testing menggunakan Postman

Concurrent testing menggunakan Postman Runner atau curl parallel

Verifikasi langsung ke PostgreSQL untuk memastikan stok dan transaksi valid

Notes
File .env dan .env.local tidak di-commit

Repository hanya menyertakan .env.example sebagai template environment
