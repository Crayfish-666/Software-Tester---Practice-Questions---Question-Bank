const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'exam.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT id, paper_id, content, correct_answer FROM questions WHERE paper_id = 8 AND type = 'text'", [], (err, rows) => {
    if (err) throw err;
    console.log(JSON.stringify(rows.filter(r => r.content.includes('第1组测试数据')), null, 2));
});
