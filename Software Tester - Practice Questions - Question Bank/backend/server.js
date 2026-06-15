const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const userDb = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

const examDbPath = path.resolve(__dirname, 'exam.db');
const examDb = new sqlite3.Database(examDbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) console.error("Error opening exam DB:", err.message);
});

// Root route
app.get('/', (req, res) => {
    res.send('BetterExam Backend API is running correctly!');
});

// GET papers
app.get('/api/papers', (req, res) => {
    examDb.all("SELECT * FROM papers", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// GET questions by paper_id
app.get('/api/questions', (req, res) => {
    const { paper_id } = req.query;
    let query = `
        SELECT q.*, g.content as group_content, g.title as group_title 
        FROM questions q
        LEFT JOIN question_groups g ON q.group_id = g.id
    `;
    let params = [];
    if (paper_id) {
        query += " WHERE q.paper_id = ?";
        params.push(paper_id);
    }
    examDb.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Parse options JSON if necessary
        const questions = rows.map(q => {
            try {
                if (q.options) q.options = JSON.parse(q.options);
            } catch (e) {}
            return q;
        });
        res.json(questions);
    });
});

// POST mistake
app.post('/api/mistake', (req, res) => {
    const { question_id, paper_id } = req.body;
    userDb.run(
        `INSERT INTO mistakes (question_id, paper_id, error_count, last_error_time) 
         VALUES (?, ?, 1, CURRENT_TIMESTAMP)
         ON CONFLICT(question_id) DO UPDATE SET 
         error_count = error_count + 1,
         last_error_time = CURRENT_TIMESTAMP`,
        [question_id, paper_id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: this.lastID });
        }
    );
});

// GET mistakes
app.get('/api/mistakes', (req, res) => {
    userDb.all("SELECT * FROM mistakes ORDER BY last_error_time DESC", [], (err, mistakeRows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (mistakeRows.length === 0) return res.json([]);

        const qIds = mistakeRows.map(m => m.question_id).join(',');
        const query = `
            SELECT q.*, g.content as group_content, g.title as group_title 
            FROM questions q
            LEFT JOIN question_groups g ON q.group_id = g.id
            WHERE q.id IN (${qIds})
        `;
        examDb.all(query, [], (err, qRows) => {
             if (err) return res.status(500).json({ error: err.message });
             
             const qMap = {};
             qRows.forEach(q => {
                 try { if (q.options) q.options = JSON.parse(q.options); } catch (e) {}
                 qMap[q.id] = q;
             });

             const result = mistakeRows.map(m => ({
                 ...m,
                 question: qMap[m.question_id]
             }));
             res.json(result);
        });
    });
});

// DELETE mistake (when resolved)
app.delete('/api/mistake/:id', (req, res) => {
    userDb.run("DELETE FROM mistakes WHERE question_id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// POST favorite
app.post('/api/favorite', (req, res) => {
    const { question_id, paper_id } = req.body;
    userDb.run(
        `INSERT INTO favorites (question_id, paper_id) VALUES (?, ?) ON CONFLICT(question_id) DO NOTHING`,
        [question_id, paper_id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        }
    );
});

// GET favorites
app.get('/api/favorites', (req, res) => {
    userDb.all("SELECT * FROM favorites ORDER BY created_at DESC", [], (err, favRows) => {
        if (err) return res.status(500).json({ error: err.message });
        if (favRows.length === 0) return res.json([]);

        const qIds = favRows.map(f => f.question_id).join(',');
        const query = `
            SELECT q.*, g.content as group_content, g.title as group_title 
            FROM questions q
            LEFT JOIN question_groups g ON q.group_id = g.id
            WHERE q.id IN (${qIds})
        `;
        examDb.all(query, [], (err, qRows) => {
             if (err) return res.status(500).json({ error: err.message });
             
             const qMap = {};
             qRows.forEach(q => {
                 try { if (q.options) q.options = JSON.parse(q.options); } catch (e) {}
                 qMap[q.id] = q;
             });

             const result = favRows.map(f => ({
                 ...f,
                 question: qMap[f.question_id]
             }));
             res.json(result);
        });
    });
});

// DELETE favorite
app.delete('/api/favorite/:id', (req, res) => {
    userDb.run("DELETE FROM favorites WHERE question_id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// POST history
app.post('/api/history', (req, res) => {
    const { paper_id, score, total } = req.body;
    userDb.run(
        `INSERT INTO study_history (paper_id, score, total) VALUES (?, ?, ?)`,
        [paper_id, score, total],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: this.lastID });
        }
    );
});

// GET history
app.get('/api/history', (req, res) => {
    userDb.all("SELECT * FROM study_history ORDER BY study_time DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
