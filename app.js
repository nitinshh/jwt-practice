const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = 3000;
const secretKey = "secretKey";

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: "a sample api"
    });
});

app.post('/login', (req, res) => {
    const user = {
        id: 1,
        name: "Nitin",
        email: "nitin@gmail.com"
    };
    jwt.sign(user, secretKey, { expiresIn: '1h' }, (err, token) => {
        res.json({
            token: `Bearer ${token}` //
        });
    });
});
    
app.post('/profile', verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) {
            res.send({ result: 'invalid token' });
        } else {
            res.json({
                message: "profile access",
                authData
            });
        }
    });
});
     
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token;  //
        next();
    } else {
        res.send({
            result: 'Token is not valid'
        });
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
