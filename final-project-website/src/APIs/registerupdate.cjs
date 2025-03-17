var expresss=require('express')
var mysql=require('mysql')
var app=expresss()
app.use(expresss.json())

const con=mysql.createConnection({
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
        console.log('Connected !!!')
    }
}
)

app.post('/registerupdate',(req,res)=>{
    const userid=req.body.userid;
    const username=req.body.username;
    const email=req.body.email;
    const pwrd=req.body.pwrd;
    const role=req.body.role;

    con.query('update register set username=?,email=?,pwrd=?,role=? where userid=?',[username,email,pwrd,role,userid],(err,result)=>{
        if(err)
        {
            console.log(err)
        }
        else
        {
            if(result.affectedRows==0)
            {
                res.send('Id not present !!!')
            }
            else
            {
                res.send('UPDATED !!!')     
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
            console.log('on port 3000')
        }
})
