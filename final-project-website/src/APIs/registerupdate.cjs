var express=require("express")
var mysql=require("mysql")
var app=express()
app.use(express.json())


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
    }else{
        console.log("connected !!!")
    }
})


app.put("/updateregister/:id",(req,res)=>{
    const id=req.params.id;
    const username=req.body.username;
    const email=req.body.email;
    const pwrd=req.body.pwrd;
    const role=req.body.role;

    con.query('UPDATE register SET username=?,email=?,pwrd=?,role=? WHERE userid=?',[username,email,pwrd,role,id],(err,result)=>{
        if(err)
            {
                console.log(err)
            }else{
                if(result.affectedRows==0)
                {
                    res.send("User Id not present")
                }
                else{
                    res.send("Updated")
                }
            }
    })
})

app.listen(3000,(err)=>{
    if(err)
        {
            console.log(err)
        }else{
            console.log("on port 3000")
        }
})
