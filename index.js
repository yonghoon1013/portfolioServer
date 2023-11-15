const express = require('express')
const app = express()
var cors = require('cors')
var bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'svc.sel5.cloudtype.app',
    user: 'root',
    password: '1234',
    database: 'test',
    port: "31431"
});

connection.connect();

async function queryexecute(str, value) {
    const data = await new Promise((resolve, reject) => {
        connection.query(str, value, function (error, results, fields) {
            resolve(results);
        });
    })
    return data;
}


app.get('/getcomment', async (req, res) => {
    let data = await queryexecute("select * from comment");

    console.log(data)
    res.send(data)
})

app.get('/logincomment', async (req, res) => {
    let qData = req.query
    let data = await queryexecute("select * from comment where text=?", [qData.text]);


    console.log(data)
    res.send(data)
})


app.post('/postcomment', async (req, res) => {
    let qData = await req.body;
    await queryexecute("insert into comment (text) values (?) ", [qData.text]);
    let data = await queryexecute("select * from comment");


    console.log(qData)
    res.send(data)
})


app.listen(3050)