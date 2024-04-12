const express = require('express');
const jwt = require('jsonwebtoken');

const conn = require('../connection');
const router = express.Router();

const nodeMailer = require('nodemailer');

var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

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


router.get('/get', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let getUser = "select id, name, email, contactNumber, status from user where role = 'user'";
    conn.query(getUser, (err, result) => {
        if (!err) {
            return res.status(200).json(result);
        } else {
            return res.status(500).json({ message: 'Internar server error.' });
        }
    })
});


router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let user = req.body;
    let updateUser = "update user set status = ? where id = ?";
    const params = [user.status, user.id];
    conn.query(updateUser, params, (err, result) => {
        if (!err) {
            if (result.affectedRows == 0) {
                return res.status(404).json({ message: "User id does not exist." })
            } else {
                return res.status(200).json({ message: "User updated successfully." })
            }
        } else {
            return res.status(500).json({ message: "Internal server error." })
        }
    });
});


router.get('/checkToken', auth.authenticateToken, (req, res) => {
    return res.status(200).json({ message: "true" });
})

router.post('/changePassword', auth.authenticateToken, (req, res) => {
    const user = req.body;
    const email = res.locals.email;

    const getUser = "select * from user where email = ? and password = ?";
    conn.query(getUser, [email, user.old_password], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(400).json({ message: "Incorrect old password" });
            } else if (results[0].password == user.old_password) {
                const updatePass = "update user set password = ? where email = ?";
                conn.query(updatePass, [user.new_password, email], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Password updated successfully." });
                    } else {
                        return res.status(500).json(err);
                    }
                });
            } else {
                return res.status(400).json({ message: "Something went wrong. please try again later." });
            }
        } else {
            return res.status(500).json({ message: "Internal server error." });
        }
    });
});


 

module.exports = router;