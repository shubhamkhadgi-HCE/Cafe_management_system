const express = require('express');

const conn = require('../connection');

const router = express.Router();

var auth = require('../services/authentication');

var checkRole = require('../services/checkRole');

router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let category = req.body;
    const addCat = "insert into category (name) values (?)";
    conn.query(addCat, category.name, (err, result) => {
        if (!err) {
            return res.status(200).json({ message: 'Category Added Successfully.' });
        } else {
            return res.status(500).json({ message: 'Internal server error.' });
        }
    });
});


router.get('/get', auth.authenticateToken, (req, res) => {
    const getCat = "select * from category order by name";
    conn.query(getCat, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json({ message: 'Internal server error.' });
        }
    });
});


router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let product = req.body;
    const updateProduct = 'update category set name = ? where id = ?';
    conn.query(updateProduct, [product.name, product.id], (err, result) => {
        if (!err) {
            if (result.affectedRows == 0) {
                return res.status(404).json({ message: 'Category id does not exist.' });
            }
            return res.status(200).json({ message: 'Category Updated Successfully.' });
        } else {
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
});


module.exports = router;