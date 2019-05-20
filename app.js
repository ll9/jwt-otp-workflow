const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const PORT = 3000;

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('OK');
})


app.listen(PORT, () => console.log('Listening on localhost:' + PORT));