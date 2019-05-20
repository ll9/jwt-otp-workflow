const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const authRouter = require('./routes/auth').router;
const otpRouter = require('./routes/otp');

const PORT = 3000;

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/auth', authRouter);
app.use('/otp', otpRouter);

app.get('/', (req, res) => {
    res.send('OK');
})


app.listen(PORT, () => console.log('Listening on localhost:' + PORT));