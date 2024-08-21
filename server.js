const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'ecommerce'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected');
});


app.get('/products', (req, res) => {
    const sql = "SELECT * FROM products";
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


app.get('/cart', (req, res) => {
    const sql = `SELECT cart_items.*, products.name, products.price, products.image_url
                 FROM cart_items 
                 JOIN products ON cart_items.product_id = products.id`;
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/cart', (req, res) => {
    const { product_id, quantity } = req.body;
    const sql = "INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)";
    db.query(sql, [product_id, quantity], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, product_id, quantity });
    });
});


app.put('/cart/:id', (req, res) => {
    const { quantity } = req.body;
    const sql = "UPDATE cart_items SET quantity = ? WHERE id = ?";
    db.query(sql, [quantity, req.params.id], (err, result) => {
        if (err) throw err;
        res.json({ id: req.params.id, quantity });
    });
});

app.delete('/cart/:id', (req, res) => {
    const sql = "DELETE FROM cart_items WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json({ deletedId: req.params.id });
    });
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});
