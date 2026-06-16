const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'exam.db');
const db = new sqlite3.Database(dbPath);

db.all(`
    SELECT paper_id, content 
    FROM question_groups 
    WHERE content LIKE '%任务2.1%'
`, [], (err, rows) => {
    if (err) throw err;
    console.log(JSON.stringify(rows, null, 2));
});
