// src/config/db.js
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

let db;                // tek instance
let initPromise = null; // init sadece bir kez çalışsın

// -- Yardımcılar --
const toQ = (sql) => sql.replace(/\$\d+/g, '?'); // $1 -> ?

function openDb() {
  if (db) return db;

  // Dosya yolu verilmişse onu kullan, yoksa :memory:
  const dbFile = process.env.SQLITE_PATH || ':memory:';
  const mode =
    dbFile === ':memory:'
      ? sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
      : // Vercel'de dosya read-only olabilir; yazma gerekiyorsa localde çalıştır.
        (process.env.SQLITE_READONLY === '1'
          ? sqlite3.OPEN_READONLY
          : sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

  db = new sqlite3.Database(dbFile, mode);
  // Biraz daha stabil davranış için:
  db.serialize(() => {
    db.run('PRAGMA journal_mode = WAL;');
    db.run('PRAGMA synchronous = NORMAL;');
    db.run('PRAGMA foreign_keys = ON;');
    db.run('PRAGMA busy_timeout = 5000;');
  });

  return db;
}

function initOnce() {
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve) => {
    const instance = openDb();

    // Schema dosyasını bir kez çalıştır (varsa)
    const schemaPath =
      process.env.SQLITE_SCHEMA_PATH ||
      path.join(process.cwd(), 'sql', 'schema.sql'); // repo kökünde sql/schema.sql bekler

    // Schema yoksa sessizce geç (case'de preview endpoint'i için DB şart değil)
    let schemaSql = '';
    try {
      if (fs.existsSync(schemaPath)) {
        schemaSql = fs.readFileSync(schemaPath, 'utf8');
      }
    } catch (e) {
      // dosya okunamadıysa yine de init'i tamamla; query'ler tablo yoksa hata verir (görürüz)
      console.warn('[db] schema file read warning:', e.message);
    }

    if (!schemaSql) {
      return resolve(); // init bitti
    }

    instance.serialize(() => {
      instance.exec(schemaSql, (err) => {
        if (err) {
          console.error('[db] schema creation error:', err.message);
          // Şema hatası init'i kilitlemesin, resolve et ki time-out olmasın
        }
        resolve();
      });
    });
  });

  return initPromise;
}

// -- Dışa açık query API --
async function query(sql, params = []) {
  await initOnce(); // şema bir kez yüklensin

  const isSelect = /^\s*select/i.test(sql);
  const q = toQ(sql);
  const instance = openDb();

  return new Promise((resolve, reject) => {
    if (isSelect) {
      instance.all(q, params, (err, rows) => {
        if (err) return reject(err);
        resolve({ rows });
      });
    } else {
      instance.run(q, params, function (err) {
        if (err) return reject(err);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    }
  });
}

module.exports = { query, db: () => openDb() };