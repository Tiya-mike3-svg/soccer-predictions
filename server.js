const express = require("express");
const path = require("path");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

app.use(express.json());

/* SERVE HTML FILES FROM PUBLIC FOLDER */
app.use(express.static(path.join(__dirname, "public")));

/* MYSQL CONNECTION */

const db = mysql.createConnection({
host: "localhost",
user: "root",
password: "",
database: "geekhub_predictions"
});

db.connect(err => {
if (err) {
console.error("Database connection failed:", err);
return;
}
console.log("Connected to MySQL");
});

/* GET MATCHES */

app.get("/matches",(req,res)=>{

const sql="SELECT * FROM matches ORDER BY match_date, match_time";

db.query(sql,(err,results)=>{

if(err){
console.log(err);
res.status(500).send("Database error");
return;
}

res.json(results);

});

});

/* ADD MATCH */

app.post("/add-match",(req,res)=>{

const {
league,
teamA,
logoA,
teamB,
logoB,
scoreA,
scoreB,
date,
time,
winOdds,
drawOdds,
loseOdds,
winPercent,
drawPercent,
losePercent
}=req.body;

const predicted_score=`${scoreA}-${scoreB}`;

const sql=`
INSERT INTO matches
(league,teamA,teamA_logo,teamB,teamB_logo,predicted_score,
match_date,match_time,odds_home,odds_draw,odds_away,
home_percentage,draw_percentage,away_percentage)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
`;

db.query(sql,[
league,
teamA,
logoA,
teamB,
logoB,
predicted_score,
date,
time,
winOdds,
drawOdds,
loseOdds,
winPercent,
drawPercent,
losePercent
],(err,result)=>{

if(err){
console.log(err);
res.status(500).send("Insert error");
return;
}

res.json({message:"Match added successfully"});

});

});

/* SERVER */

app.listen(PORT,()=>{
console.log(`Server running at http://localhost:${PORT}`);
});