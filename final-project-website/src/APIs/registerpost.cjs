var express = require("express")
var mysql = require("mysql")
var app = express()
app.use(express.json())

const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'economic_center'
})

con.connect((err)=>{
    if(err)
    {
        console.log(err)
    }
    else
    {
        console.log("Connected !!!")
    }
})

app.post('/registerpost',(req,res)=>{
    const userid=req.body.userid;
    const username=req.body.username;
    const email=req.body.email;
    const pwrd=req.body.pwrd;
    const role=req.body.role;

    con.query('insert into register values(?,?,?,?,?)',[userid,username,email,pwrd,role],(err,result)=>{
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.send("POSTED !!!")
        }
    })
})

app.listen(3000,(err)=>{
    if(err)
    {
        console.log(err)
    }
    else
    {
        console.log("on port 3000")
    }
})