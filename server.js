var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var Web3 = require('web3');
var cors=require('cors');
var web3 = new Web3('http://localhost:8545');
var abi =[{"constant":false,"inputs":[{"name":"_id","type":"address"},{"name":"_name","type":"string"},{"name":"_technology","type":"bytes32"},{"name":"_miles","type":"uint256"},{"name":"_pass","type":"string"}],"name":"registerEvaluator","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"getTask","outputs":[{"name":"student_id","type":"address"},{"name":"task","type":"string"},{"name":"technology","type":"bytes32"},{"name":"upvotes","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"address"},{"name":"_name","type":"string"},{"name":"_pass","type":"string"}],"name":"registerStudent","outputs":[{"name":"success","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_student_id","type":"address"},{"name":"_tasks","type":"string"},{"name":"_technology","type":"bytes32"}],"name":"submitTask","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"getlengthMentors","outputs":[{"name":"l","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_student_id","type":"address"},{"name":"_task_id","type":"uint256"}],"name":"upvoteTask","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_student_id","type":"address"}],"name":"getStudent","outputs":[{"name":"name","type":"string"},{"name":"password","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"index","type":"uint256"}],"name":"getEvaluatorSig","outputs":[{"name":"name","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"getCert","outputs":[{"name":"isready","type":"bool"},{"name":"time","type":"uint256"},{"name":"sid","type":"address"},{"name":"name","type":"string"},{"name":"tech","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"index","type":"uint256"}],"name":"getMentors","outputs":[{"name":"name","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getlengthTask","outputs":[{"name":"l","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_eval_id","type":"address"}],"name":"getEvaluator","outputs":[{"name":"name","type":"string"},{"name":"technology","type":"bytes32"},{"name":"miles","type":"uint256"},{"name":"password","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]; 
var async = require('async');


var contadd = "0x53dddb5418d72393361a7df910483c1848b0a0cf";
var evalcon =new web3.eth.Contract(abi,contadd);

// console.log(evalcon);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.post('/createstudent',function(req,res){
	var name=req.body.name;
	var passwd=req.body.password;
	var addr;
	
	try{
		web3.eth.personal.newAccount(passwd).then(function(resp){
			addr=resp;

		console.log(name,passwd,addr);
		var p = evalcon.methods.registerStudent(addr, name, passwd).send({from:"0xd922c672a58d5e18471ca2a3590a11cc703c5196",gas:500000}).then(function(receipt){
		res.send({"userid":addr});
	});
	});
	}

	catch(error){
		res.send("An Error occurred \n"+error);
	}

});


app.post('/createevaluator',function(req,res){
	var name=req.body.name;
	var tech=web3.utils.toHex(req.body.technology);
	var miles=parseInt(req.body.miles);
	var passwd=req.body.password;
	var addr;
	try{
		web3.eth.personal.newAccount(passwd).then(function(resp){
			addr=resp;
		;
		evalcon.methods.registerEvaluator(addr, name,tech,miles, passwd).send({from:"0xd922c672a58d5e18471ca2a3590a11cc703c5196",gas:600000}).then(function(receipt){
			console.log(receipt);
			web3.eth.sendTransaction({from:"0xd922c672a58d5e18471ca2a3590a11cc703c5196", to:addr, value: web3.utils.toWei(5, "ether")}).on('receipt', function(receipt){
 			res.send({"userid":addr});
 		});
		});
		})
		// web3.eth.sendTransaction({from:eth.coinbase, to:addr, value: web3.toWei(5, "ether")})
	}

	catch(error){
		res.send("An Error occurred \n"+error);
	}

});


app.post('/submittask',function(req,res){
	var _id=req.body.studentid;
	var task=req.body.task;
	var tech=web3.utils.toHex(req.body.technology);
	try{
		evalcon.methods.submitTask(_id,task,tech).send({from:"0xd922c672a58d5e18471ca2a3590a11cc703c5196",gas:500000}).then(function(receipt){
			res.send("Task Submitted");
		});
	}

	catch(error){
		res.send("An Error occurred \n"+error);
	}

});




app.post('/upvotetask',function(req,res){
	var _id=req.body.studentid;
	var tid=parseInt(req.body.taskid);
	var sender=req.body.sender;
	try{
		evalcon.methods.upvoteTask(_id,tid).call({from: sender}, function(error, result){
			console.log(result);
			console.log(result);
    		if(result==true){
				evalcon.methods.upvoteTask(_id,tid).send({from:sender,gas:600000}).then(function(receipt){
					res.send("Upvoted");
				});
			}
			else{
				res.send("Evaluator is not from same technology or dosen't have enough credit points");
			}
		});
		
	}

	catch(error){
		res.send("An Error occurred \n"+error);
	}

});

app.post('/loginstudent',function(req,res){
	var _id=req.body.id;
	var passwd=req.body.password;
	try{
		evalcon.methods.getStudent(_id).call({from:"0xd922c672a58d5e18471ca2a3590a11cc703c5196"},function(error,result){
			// console.log(result[1]);
			if(result[1]==passwd){
				web3.eth.personal.unlockAccount(_id,passwd,3600);
				res.send("true");
			}
			else{
				res.send("false");
			}	
		});
		
	}
	catch(e){
		res.send("An Error occurred \n"+e);
	}

});


app.post('/loginevaluator',function(req,res){
	var _id=req.body.id;
	var passwd=req.body.password;
	// console.log(web3.utils.isAddress(_id));
	try{
		evalcon.methods.getEvaluator(_id).call({from:"0xd922c672a58d5e18471ca2a3590a11cc703c5196"},function(error,result){;
			console.log(result);
			if(result[3]==passwd){
				web3.eth.personal.unlockAccount(_id,passwd,3600);
				res.send("true");
			}
			else{
				res.send("false");
			}	
		});
	}
	catch(e){
		res.send("An Error occurred \n"+e);
	}

});

// app.post('/getcert',function(req,res){
// 	var _id=parseInt(req.body.id);
	
// 	try{
// 		var p=evalcon.getCert.call(_id);
// 		if(p[0]=="true"){

// 		}
// 		else{
// 			res.send("Certificate is not generated");
// 		}
// 	}
// 	catch(e){
// 		res.send("An Error occurred \n"+e);
// 	}

// });
app.post('/gettask',function(req,res){
	var _id=parseInt(req.body.id);
	var task={};
    var t=[];
    task.t=t;
	try{
		var p=evalcon.methods.getTask(_id).call(function(error,result){
			var tr={
					"Student id": result[0],
					"Task": result[1],
					"Technology":result[2],
					"Upvotes":result[3]
			};
			task.t.push(tr);
			res.send(task);
		});
	}
	catch(e){
		res.send("An Error occurred \n"+e);
	}

});

app.post('/getalltask',function(req,res){

	var tasklist = [];

	try{
		evalcon.methods.getlengthTask().call(function(error,result){

			var counter = 0;

			for(var i=0;i<result;i++) {

				tasklist.push(function(cb) {
					evalcon.methods.getTask(counter++).call(function(error, subresult) {
						cb(null, {
							"Student id": subresult[0],
							"Task": subresult[1],
							"Technology":subresult[2],
							"Upvotes":subresult[3]
						});
					});
				});
			}

			async.parallel(tasklist, function(err, results) {
				res.send(results);
			});

		});

	}
	catch(e){
		res.send("An Error occurred \n"+e);
	}

});

app.post('/getcertificates',function(req,res){
	var add=req.body.id;
	var certlistTasks=[];
	try{
		evalcon.methods.getlengthTask().call(function(error,lengthResult){
			var certCounter=0;
			for(var i=0;i<lengthResult;i++){
				certlistTasks.push(function(cb){
					evalcon.methods.getCert(certCounter++).call(function(error,certResult){
						if(certResult[2]==add && certResult[0]==true) {

							var resultJson = {
								
							};
						
							var mentorFetchCounter = 0; // Required for ASYNC
							var mentorFetchTaskList = [];

							for(var j=0; j<5; j++) {
								mentorFetchTaskList.push(function(subCB) {
									evalcon.methods.getMentors((certCounter - 1), mentorFetchCounter++).call(function(error, mentorResults) {
										subCB(null, mentorResults);
									});
								});
							}

							async.parallel(mentorFetchTaskList, function(err, results) {

								cb(null, {
									"Name":certResult[3],
									"Student id": certResult[2],
									"Time Stamp":certResult[1],
									"Technology":certResult[4],
									"Mentors": results
								});

							});
						} else {
							cb(null, {});
						}
					});
				});
			}

			async.parallel(certlistTasks, function(err, results) {
				res.send(results);
			});
		
		});
	}
	catch(e){
		res.send("An Error occurred \n"+e);
	}

});


var server = app.listen(5555, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("Example app listening at http://%s:%s", host, port)

});
