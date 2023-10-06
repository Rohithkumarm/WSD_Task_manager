const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');
app.use(express.json());
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'task_manager'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database');
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/all_tasks.html');
});

  app.get('/Tasklist', (req, res) => {
    res.sendFile(__dirname + '/public/all_tasks.html');
});

app.get('/addtask', (req, res) => {
  res.sendFile(__dirname + '/public/add_task.html');
});

app.get('/edittask/:taskId', (req, res) => {
  res.sendFile(__dirname + '/public/update_task.html');
});

app.get('/tasks', (req, res) => {
  const query = 'SELECT * FROM tasks';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({ tasks: results });
    }
  });
});

app.post('/tasks', (req, res) => {
  const { title, description } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required and must be a string' });
  }

  const query = 'INSERT INTO tasks (title, description) VALUES (?, ?)';

  db.query(query, [title, description], (err, results) => {
    if (err) {
      console.error('Error creating task:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.affectedRows === 1) {
      const newTaskId = results.insertId;

      db.query('SELECT * FROM tasks WHERE id = ?', [newTaskId], (err, task) => {
        if (err) {
          console.error('Error fetching the new task:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(201).json({ task: task[0] });
      });
    } else {
      res.status(500).json({ error: 'Failed to create the task' });
    }
  });
});

app.get('/tasks/:id', (req, res) => {
  const taskId = req.params.id;

  const query = 'SELECT * FROM tasks WHERE id = ?';

  db.query(query, [taskId], (err, results) => {
    if (err) {
      console.error('Error fetching task by ID:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ task: results[0] });
  });
});

app.put('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const { title, description } = req.body;

  const query = 'UPDATE tasks SET title = ?, description = ?, updated_at = current_timestamp() WHERE id = ?';

  db.query(query, [title, description, taskId], (err, results) => {
    if (err) {
      console.error('Error updating task by ID:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task updated successfully' });
  });
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const query = 'DELETE FROM tasks WHERE id = ?';

  db.query(query, [taskId], (err, results) => {
    if (err) {
      console.error('Error deleting task by ID:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  });
});
