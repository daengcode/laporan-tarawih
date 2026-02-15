# Laporan Keuangan Masjid

## 🗄️ Data Schema

### Users Schema

```javascript
{
    id: integer,
    username: string,
    password: string, // hashed
    name: string,
    created_at: timestamp
}
```

### Transactions Schema

```javascript
{
    id: integer,
    date: string, // YYYY-MM-DD
    name: string, // nama donatur / nama keperluan
    type: 'pemasukan' | 'pengeluaran',
    amount: number,
    source?: string, // untuk pemasukan
    expense_type?: string, // untuk pengeluaran
    proof?: string, // base64 image
    created_by: integer,
    created_at: timestamp
    updated_at: timestamp
    deleted_at: timestamp
}
```

---
