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

// app.get('/logincomment', async (req, res) => {
//     let qData = req.query
//     let data = await queryexecute("select * from comment where text=?", [qData.text]);


//     console.log(data)
//     res.send(data)
// })


app.post('/postcomment', async (req, res) => {
    let qData = await req.body;
    await queryexecute("insert into comment (text,id,password) values (?,?,?) ", [qData.text,qData.id,qData.password]);
    let data = await queryexecute("select * from comment");


    console.log(qData)
    res.send(data)
})

app.put('/updatecomment/:id', async(req,res) => {
    const {id} = req.params;
    let qData = await req.body;
    let comment = await queryexecute("select * from comment where num=?",[id]);
    if(comment.length > 0 && comment[0].password === qData.password){
        await queryexecute("update comment set text =?  where num =?", [qData.text,id]);
        let data = await queryexecute("select * from comment");
        res.send({ success: true, data });
    } else {
        res.send({ success: false, message: '비밀번호가 일치하지 않습니다.' });
    }

})


app.listen(3050)