const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('dist'));

//assuming app is express Object.
app.get('/',function(req,res){
  res.sendFile(path.resolve(__dirname, './index-build.html'));
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
