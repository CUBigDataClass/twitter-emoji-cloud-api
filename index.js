const express = require('express');
const app = express();
const port = 3000;

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