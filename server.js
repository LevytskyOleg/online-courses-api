const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json()); // Дозволяє серверу розуміти JSON

// Підключення до твоєї бази даних SQLite (вкажи правильний шлях до файлу БД)
const db = new sqlite3.Database('./online_courses.db', (err) => {
    if (err) {
        console.error('Помилка підключення до БД:', err.message);
    } else {
        console.log('Успішно підключено до бази даних SQLite.');
    }
});

// 1. READ (GET) - Отримати список усіх курсів [cite: 706, 675]
app.get('/courses', (req, res) => {
    db.all('SELECT * FROM courses', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 2. CREATE (POST) - Додати нового студента [cite: 716, 676]
app.post('/students', (req, res) => {
    const { first_name, last_name, email } = req.body;
    const sql = 'INSERT INTO students (first_name, last_name, email) VALUES (?, ?, ?)';

    db.run(sql, [first_name, last_name, email], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Студента успішно додано', id: this.lastID });
    });
});

// 3. UPDATE (PUT) - Оновити дані студента за його ID [cite: 725, 678]
app.put('/students/:id', (req, res) => {
    const { first_name, last_name, email } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE students SET first_name = ?, last_name = ?, email = ? WHERE student_id = ?';

    db.run(sql, [first_name, last_name, email, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Дані студента оновлено' });
    });
});

// 4. DELETE (DELETE) - Видалити студента за його ID [cite: 736, 679]
app.delete('/students/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM students WHERE student_id = ?';

    db.run(sql, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Студента видалено' });
    });
});

// Запуск сервера на порту 3000
app.listen(3000, () => console.log('Server started on port 3000'));