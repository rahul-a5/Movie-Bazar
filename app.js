var express= require('express');
var path= require('path');
var logger= require('morgan');
const bodyParser = require('body-parser');
var neo4j=require('neo4j-driver');

var app=express();
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));


var driver=neo4j.driver('bolt://localhost:7687',neo4j.auth.basic('neo4j','neo4j1'));
var session =driver.session();
var act=[];
var all=[];
var director=[];
app.get('/',function(req,res){
    if(act.length==0){
    session

        .run('Match(n:Joker) return n ')
        .then(function(result){
            
            result.records.forEach(function(records){
                act.push(records._fields[0].properties.name);
                all.push(records._fields[0].properties.name);
            });
            session.run('Match(n:Director) return n ')
            .then(function(result){
            
                result.records.forEach(function(records){
                    director.push(records._fields[0].properties.Name);
                    all.push(records._fields[0].properties.Name);
                });
                console.log(act.length);
                console.log(director.length);
                res.render('render.ejs',{Actor:act,director:director,all:all});
            })
            })
        
        .catch(function(err){
            console.log(err);
        });}
    else{
        //console.log(mov.length);
        res.render('render.ejs',{Actor:act,director:director,all:all});}
});


app.post('/get_movie',function(req,res){
    var ty=req.body.type;
    var name=req.body.Movie;
    console.log(ty);
    console.log(name);
    
     if(ty=="A"){
        var data=[];
        session
                .run(' match(n:Joker{name:"'+name+'"})-[r]-(n1:Movie)  return n1 ')
                .then(function(result){
                    result.records.forEach(function(records){
                        data.push(records._fields[0].properties.Title);
                    });
                    session
                            .run(' match(n:Director{Name:"'+name+'"})-[r]-(n1:Movie)  return n1 ')
                            .then(function(result){
                                result.records.forEach(function(records){
                                    data.push(records._fields[0].properties.Title);
                                });
                                res.render('view.ejs',{data:data});
                            })
                            
                })
                .catch(function(err){
                    if(err)throw err;
                });
        
     }
     else if(ty=="B"){
         var data=[];
         session
                .run(' match(n:Director{Name:"'+name+'"})-[r]-(n1:Movie)  return n1 ')
                .then(function(result){
                    result.records.forEach(function(records){
                        data.push(records._fields[0].properties.Title);
                    });
                    res.render('view.ejs',{data:data});
                })
                .catch(function(err){
                    if(err)throw err;
                });

     }
     else{
        var data=[];
        session
               .run(' match(n:Joker{name:"'+name+'"})-[r]-(n1:Movie)  return n1 ')
               .then(function(result){
                   result.records.forEach(function(records){
                       data.push(records._fields[0].properties.Title);
                   });
                   res.render('view.ejs',{data:data});
               })
               .catch(function(err){
                   if(err)throw err;
               });
        

     }
});





app.listen(3000);