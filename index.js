const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/:year/:month/:day', (req, res) => {
    const { year, month, day } = req.params;
    console.log({ year, month, day});
    res.json([
        {
            text: "hello",
            count: 20
        },
        {
            text: "world",
            count: 10
        }
    ]);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});