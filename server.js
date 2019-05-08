/* Include express framework */
const express = require('express')
/* Include main routes folder */
const routes = require('./routes')
/* Define Main app variable*/
let app = express()
/* Include defined routes */
app.use('/', routes);
/*  Main application port */
app.listen(3000)