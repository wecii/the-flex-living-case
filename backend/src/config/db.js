require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const db = new sqlite3.Database(':memory:');

// Schema dosyasını otomatik çalıştır
const schemaPath = path.join(__dirname, '../../sql/schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');
db.exec(schemaSql, (err) => {
	if (err) console.error('Schema creation error:', err);
});

function query(sql, params = []) {
	return new Promise((resolve, reject) => {
		const isSelect = /^\s*select/i.test(sql);
		if (isSelect) {
			db.all(sql, params, (err, rows) => {
				if (err) return reject(err);
				resolve({ rows });
			});
		} else {
			db.run(sql, params, function (err) {
				if (err) return reject(err);
				resolve({ lastID: this.lastID, changes: this.changes });
			});
		}
	});
}
module.exports = { query, db };