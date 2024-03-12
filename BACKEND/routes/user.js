const express = require('express');
const jwt = require('jsonwebtoken');

const conn = require('../connection');
const router = express.Router();

const nodeMailer = require('nodemailer');
const { text } = require('body-parser');

// Create transporter fom mail
const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: "khadgishubham7@gmail.com",
        pass: "123456"
    }
});

// router.get('/', (req, res) => {
//     console.log("GetApi");
//     return res.send("Hello");
// });


router.post('/signup', (req, res) => {
    let user = req.body;
    query = "select email, password, role, status from user where email = ?";

    conn.query(query, [user.email], (err, result) => {
        if (!err) {
            if (result.length <= 0) {
                query = "insert into user (name, contactNumber, email, password, status, role) values(?,?,?,?,'false','user')";
                conn.query(query, [user.name, user.contactNumber, user.email, user.password], (err, result) => {
                    if (!err) {
                        return res.status(200).json({ message: "Successfully Registerd." });
                    } else {
                        console.log(err);
                        return res.status(500).json(err);
                    }
                });
            } else {
                return res.status(400).json({ message: "Email already exist.." })
            }
        } else {
            console.log(err);
            return res.status(500).json(err);
        }
    });
});




router.post('/login', (req, res) => {
    const user = req.body;
    loginQuery = "select email, password, role, status from user where email = ?";
    conn.query(loginQuery, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {

                return res.status(401).json({ message: "Incorrect username or password..." });

            } else if (results[0].status == 'false') {

                return res.status(401).json({ message: "Wait for Admin Approval..." });

            } else if (results[0].password != user.password) {

                const response = { email: results[0].email, role: results[0].role };
                const accessToken = jwt.sign(response, process.env.SECRET_KEY, { expiresIn: '8h' });
                res.status(200).json({ token: accessToken });

            } else {

                return res.status(400).json({ message: "Something went wrong. Please try again later." });

            }
        } else {

            return res.status(500).json({ message: "Internal server error..." });

        }
    });
});




router.post('/forgotPassword', (req, res) => {
    const user = req.body;
    getUser = "select email, password from user where email = ?";
    conn.query(getUser, [user.email], (err, result) => {
        if (!err) {
            if (result.length <= 0) {

                return res.status(200).json({ message: "Password sent successfull to your email." });

            } else {

                mailOptions = {
                    from: "abc@gmail.com",
                    to: result[0].email,
                    subject: "demo",
                    html: `<p><b> Your Login Details: </b> <br> <br>
                            <b> Email: </b> ${result[0].email} <br>
                            <b> Password: </b> ${result[0].password}
                        </p>`
                }

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });

                return res.status(200).json({ message: "Password sent successfull to your email." });

            }
        } else {
            return res.status(500).json({ message: "Server Error..." });
        }
    });
});

module.exports = router;