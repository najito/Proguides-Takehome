const express = require('express')
const app = express();
const path = require('path')
const PORT = 3000;

//serve html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'))
})

//404 handler
app.use('*', (req, res) => {
  res.sendStatus(404);
});
//global error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});