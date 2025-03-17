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
    }
    else{
        console.log("connected !!!")	
    }
})

app.delete('/deleteregister/:id',(req,res)=>{
    const delid=req.params.id;
    con.query('delete from register where userid=?',delid,(err,result)=>{
        if(err)
            {
                console.log(err)
            }
            else{
                if(result.affectedRows==0){
                    res.send("User id not present")
                }
                else{
                    res.send("deleted !!!")
                }
            }
    })
})

app.listen(3000,(err)=>{
    if(err)
        {
            console.log(err)
        }
        else{
            console.log("on port 3000 !!!")	
        }
})