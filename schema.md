# Laporan Keuangan Masjid

## 🗄️ Data Schema

### Users Schema

```javascript
{
    id: string,
    username: string,
    password: string, // hashed
    name: string,
    createdAt: string
}
```

### Transactions Schema

```javascript
{
    id: string,
    date: string, // YYYY-MM-DD
    name: string, // nama donatur / nama keperluan
    type: 'pemasukan' | 'pengeluaran',
    amount: number,
    source?: string, // untuk pemasukan
    expenseType?: string, // untuk pengeluaran
    proof?: string, // base64 image
    createdBy: string,
    createdAt: string
    updatedAt: string
    deletedAt: string
}
```

---
