const express = require('express')
const app = express()
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
app.use(express.json())
const path = require('path')
const dbpath = path.join(__dirname, 'todoApplication.db')
let db = null
const initializeServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`Error: ${e.messsage}`)
    process.exit(1)
  }
}
initializeServer()
app.get('/todos/', async (request, response) => {
  const {priority = '', status = '', search_q = ''} = request.query;
  
  let stat = status.replace('%20', ' ');
  
  switch(true){
    case (priority!=="" && status!==""){
         let ques =`SELECT * FROM todo WHERE priority="${priority}" AND status="${stat}";`;
         break;
    }
    case (priority!==""){
         let ques=`SELECT * FROM todo WHERE priority="${priority}";`;
         break;
    }
    case (status!==""){
         let ques=`SELECT * FROM todo WHERE status="${stat}";`;
         break;
    }
    case (search_q!==""){
         let ques=`SELECT * FROM todo WHERE todo LIKE "%${search_q}%";`;
         break;
    }
  }
  let dbresponse=await db.all(ques)
  response.send(dbresponse)
  
})
app.get("/todos/:todoId/", async (request,response)=>{
  const {todoId}=request.params
  let query=`SELECT * FROM todo WHERE id=${todoId};`
  let dbresponse=await db.get(query)
  response.send(dbresponse)
})
app.post("/todos/",async (request,response)=>{
  const body=request.body
  const {id,todo,priority,status}=body
  let query=`insert into todo(id,todo,priority,status) values (${id},"${todo}","${priority}","${status}");`
  let dbresponse=db.run(query)
  response.send("Todo Successfully Added")
}) 
app.put("/todos/:todoId/",async (request,response)=>{
   const {todoId}=request.params
   let query=`SELECT * FROM todo WHERE id=${todoId};`
   let dbresponse=await db.get(query)
   let {todo,priority,status}=dbresponse
   {todo,priority,status}=request.body
   let query2=`update todo SET todo="${todo}",priority="${priority}",status="${status}";`
   let res=await db.run(query2)
   response.send("Todo Updated")

})
app.delete("/todos/:todoId/",async (request,response)=>{
  const {todoId}=request.params
  let query=`DELETE FROM todo WHERE id=${todoId};`
  let dbresponse=await db.run(query)
  response.sed
})