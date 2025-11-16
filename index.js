require('dotenv').config(); 
const express = require('express');

const app = express(); 
const apiRouter = require('./routes');
 
const cors = require('cors')
app.use(cors())

app.use(express.static('dist')); 
app.use(express.json()); 


app.use('/api', apiRouter);


const PORT = 3001; 

app.get('/', (req, res) => {
    res.json({ status: 'Server operational. Access API via /api' });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});