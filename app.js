// app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = 3000;
app.use(bodyParser.json());

// Create
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send({ id: result.insertId, name, email });
  });
});

// Read
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(results);
  });
});

app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length === 0) {
      return res.status(404).send('User not found by id');
    }
    res.status(200).send(result[0]);
  });
});

//Nuevo endpoint para buscar por name -- then en postman debes usar la ruta usersbyname/guiru
app.get('/usersbyname/:name', (req, res) => {
  const { name } = req.params;
  db.query('SELECT * FROM users WHERE name = ?', [name], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length === 0) {
      return res.status(404).send('User not found by name');
    }
    res.status(200).send(result[0]);
  });
});

// Update
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send('User updated successfully');
  });
});

// Delete
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send('User deleted successfully');
  });
});

app.listen(port, () => {
  console.log('Server is running at http://localhost:'+port);
});