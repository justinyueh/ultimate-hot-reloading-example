import express from 'express';

const app = express.Router();

function getDataByParam(value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value * 2);
    }, 100);
  });
}

async function getData() {
  const data1 = await getDataByParam(1);
  const data2 = await getDataByParam(data1);
  return data2;
}

app.get('/whoami', (req, res, next) => {
  getData()
    .then((value) => {
      res.send(`You are a winner ${value}`);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = app;
