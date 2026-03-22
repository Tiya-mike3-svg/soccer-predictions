const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

/* MIDDLEWARE */

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* JSON FILE */

const DATA_FILE = path.join(__dirname, "matches.json");

/* MEMORY STORAGE */

let matches = [];

/* LOAD DATA */

if(fs.existsSync(DATA_FILE)){
try{
matches = JSON.parse(fs.readFileSync(DATA_FILE));
}catch(err){
matches = [];
}
}

/* SAVE FUNCTION */

function saveMatches(){
fs.writeFileSync(DATA_FILE, JSON.stringify(matches,null,2));
}

/* GET MATCHES */

app.get("/matches",(req,res)=>{

const date = req.query.date;

if(date){

const filtered = matches.filter(m => m.match_date === date);

return res.json(filtered);

}

res.json(matches);

});

/* ADD MATCH */

app.post("/add-match",(req,res)=>{

const match = req.body;

match.id = Date.now();

matches.push(match);

saveMatches();

res.json({success:true});

});

/* CLEAR MATCHES */

app.delete("/clear-matches",(req,res)=>{

matches = [];

saveMatches();

res.json({success:true});

});

/* SERVER */

app.listen(PORT,()=>{

console.log("Server running on http://localhost:3000");

});