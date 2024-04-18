const express = require('express');
const router = express.Router();
const conn = require('../connection');
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
var uuid = require('uuid');
var auth = require('../services/authentication');

router.post('/generateReport', (req, res) => {
    const generatedUuid = uuid.v1();
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);

    query = "insert into bill (name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy) values (?,?,?,?,?,?,?,?)";
    params = [orderDetails.name, generatedUuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email];

    conn.query(query, params, (err, result) => {
        if (!err) {
            templateData = {
                productDetails: productDetailsReport,
                name: orderDetails.name,
                email: orderDetails.email,
                contactNumber: orderDetails.contactNumber,
                paymentMethod: orderDetails.paymentMethod,
                totalAmount: orderDetails.totalAmount
            };

            ejs.renderFile(path.join(__dirname, '', 'report.ejs'), templateData, (err, results) => {
                if (!err) {
                    pdf.create(results).toFile('./generated_pdf/' + generatedUuid + ".pdf", (err, data) => {
                        if (!err) {
                            return res.status(200).json({ uuid: generatedUuid });
                        } else {
                            console.error(err);
                            return res.status(500).json(err);
                        }
                    })
                } else {
                    return res.status(500).json(err);
                }
            });
        } else {
            return res.status(500).json(err)
        }
    })
    console.log(generatedUuid);
});


router.post('/getPdf', auth.authenticateToken, (req, res) => {
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);
    const pdfPath = './generatedPdf/' + orderDetails.uuid + '.pdf';
    if (fs.existsSync(pdfPath)) {
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    } else {
        templateData = {
            productDetails: productDetailsReport,
            name: orderDetails.name,
            email: orderDetails.email,
            contactNumber: orderDetails.contactNumber,
            paymentMethod: orderDetails.paymentMethod,
            totalAmount: orderDetails.totalAmount
        };

        ejs.renderFile(path.join(__dirname, '', 'report.ejs'), templateData, (err, results) => {
            if (!err) {
                pdf.create(results).toFile('./generated_pdf/' + orderDetails.uuid + ".pdf", (err, data) => {
                    if (!err) {
                        res.contentType("application/pdf");
                        fs.createReadStream(pdfPath).pipe(res);
                    } else {
                        console.error(err);
                        return res.status(500).json(err);
                    }
                })
            } else {
                return res.status(500).json(err);
            }
        });
    }
});

router.get('/getBills', auth.authenticateToken, (req, res) => {
    const getBills = 'Select * from bills order by id DESC';
    conn.query(getBills, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.delete('/deleteBill/:id', auth.authenticateToken, (req, res) => {
    const id = req.params.id;
    let deleteBill = 'delete from bill where id = ?';
    conn.query(deleteBill, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Bill id does not found." });
            }
            return res.status(200).json({ message: "Bill Deleted Successfully." });
        } else {
            return res.status(500).json(err);
        }
    });
});

module.exports = router;