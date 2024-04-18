const express = require('express');
const conn = require('../connection');
const auth = require('../services/authentication');
const checkRole = require('../services/checkRole');

const router = express.Router();

router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let product = req.body;
    var addProduct = 'insert into product (name, categoryId, description, price, status) values (?,?,?,?,true)';
    conn.query(addProduct, [product.name, product.categoryId, product.description, product.price], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Product Added Successfully." });
        } else {
            return res.status(500).json({ message: "Internal server error." });
        }
    });
});

router.get('/get', auth.authenticateToken, (req, res) => {
    var getProducts = 'select p.name, p.price, p.status, p.description, c.id as categoryId, c.name as categoryName from product as p INNER JOIN category as c on p.categoryId = c.id';
    conn.query(getProducts, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.get('/getByCategory/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var getProduct = 'select id, name from product where categoryId = ? and status = "true"';
    conn.query(getProduct, [id], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.get('/getById/:id', auth.authenticateToken, (req, res) => {
    const id = req.params.id;
    var getProd = 'select id, name, price, description from product where id = ?';
    conn.query(getProd, (err, results) => {
        if (!err) {
            return res.status(200).json(results[0]);
        } else {
            return res.status(500).json(err);
        }
    });
});


router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let product = req.body;
    var updateProd = 'update product set name = ?, price = ? , description = ?, status = ? where id = ?';
    conn.query(updateProd, [product.name, product.price, product.description, product.status, product.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Product id does not found." });
            } else {
                return res.status(200).json({ message: "Product Updated Successfully." });
            }
        } else {
            return res.status(500).json(err);
        }
    });
});

router.delete('/delete/:id', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    const id = req.params.id;
    var delProduct = 'delete from product where id = ?';
    conn.query(delProduct, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "product id does not found." });
            } else {
                return res.status(200).json({message: 'Product Deleted Successfully.'});
            }
        } else {
            return res.status(500).json(err);
        }
    })
})


module.exports = router;

module.exports = router;