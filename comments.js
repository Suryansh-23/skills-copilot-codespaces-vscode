// Create web server
// Load modules
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const mysql = require('mysql');
const config = require('../config/config.json');

// MySQL
const db = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});

// Connect to database
db.connect((err) => {
    if(err) throw err;
    console.log('MySQL connected');
});

// Get all comments
router.get('/', (req, res) => {
    let sql = 'SELECT * FROM comments';
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        res.json(results);
    });
});

// Get a single comment
router.get('/:id', (req, res) => {
    let sql = `SELECT * FROM comments WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        res.json(result);
    });
});

// Insert a comment
router.post('/', [
    check('name').isLength({ min: 2 }),
    check('comment').isLength({ min: 2 })
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    };
    let sql = 'INSERT INTO comments SET ?';
    let query = db.query(sql, req.body, (err, result) => {
        if(err) throw err;
        res.send('Comment added');
    });
});

// Update a comment
router.put('/:id', [
    check('name').isLength({ min: 2 }),
    check('comment').isLength({ min: 2 })
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    };
    let sql = `UPDATE comments SET name = '${req.body.name}', comment = '${req.body.comment}' WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        res.send('Comment updated');
    });
});

// Delete a comment
router.delete('/:id',