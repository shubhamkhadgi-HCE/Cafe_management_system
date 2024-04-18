const express = require('express');
const conn = require('../connection');
const router = express.Router();
const auth = require('../services/authentication');

router.get('/details', auth.authenticateToken, (req, res) => {
    let categoryCount;
    let productCount;
    let billCount;

    getCatCount = 'select count(id) as categoryCount from category';
    conn.query(getCatCount, (err, results) => {
        if (!err) {
            categoryCount = results[0].categoryCount;
        } else {
            return res.status(500).json(err);
        }
    });

    getProdCount = 'select count(id) as productCount from product';
    conn.query(getProdCount, (err, results) => {
        if (!err) {
            productCount = results[0].productCount;
        } else {
            return res.status(500).json(err);
        }
    });

    getBillCount = 'select count(id) as billCount from bill';
    conn.query(getBillCount, (err, results) => {
        if (!err) {
            billCount = results[0].billCount
            let data = {
                category: categoryCount,
                product: productCount,
                bill: billCount
            };

            return res.status(200).json(data);
        } else {
            return res.status(500).json(err);
        }
    });
});


module.exports = router;