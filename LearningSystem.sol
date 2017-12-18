pragma solidity ^0.4.0;
contract LearningSystem{
    //student structure
    struct Student{
        address id;
        string name;
        string password;
    }
    //evaluator structure
    struct Evaluator{
        address id;
        string name;
        string password;
        bytes32 technology;
        uint miles;
    }
    //structure of tasks to be submitted and evaluated
    struct Task{
        address student_id;
        string task;
        bytes32 technology;
        uint upvotes;
        string[] mentors;
    }
    //structure of certificates
    struct Certificate{
        address student_id;
        string name;
        bytes32 technology;
        uint timestamp;
        string[] mentors;
    }
    //Mappings
    
    mapping(address=>Student) student;
    mapping(address=>Evaluator) evaluator;
    Task[] tasks;
    Certificate[] certificates;
    //function for registering registering student
    function registerStudent(address _id, string _name,string _pass) payable returns  (bool success){
        student[_id].id=_id;
        student[_id].name=_name;
        student[_id].password=_pass;
        return true;
    }
    //function for registering evaluator
    function registerEvaluator(address _id,string _name, bytes32 _technology, uint _miles,string _pass)payable returns (bool){
        evaluator[_id].id=_id;
        evaluator[_id].name=_name;
        evaluator[_id].technology=_technology;
        evaluator[_id].miles=_miles;
        evaluator[_id].password=_pass;
        return true;
    }
    //function for student submit tasks
    
    function submitTask(address _student_id,string _tasks,bytes32 _technology)payable returns(bool){
        Task memory ts;
        ts.student_id=_student_id;
        ts.task=_tasks;
        ts.technology=_technology;
        tasks.push(ts);
        Certificate memory cert;
        cert.student_id=_student_id;
        cert.name=student[_student_id].name;
        cert.technology=_technology;
        certificates.push(cert);
        return true;
    }
    //function for evaluator
    function upvoteTask(address _student_id,uint _task_id) payable returns(bool){
        string name=evaluator[msg.sender].name;
        if(evaluator[msg.sender].miles>=1000 && evaluator[msg.sender].technology==tasks[_task_id].technology){
            tasks[_task_id].upvotes=tasks[_task_id].upvotes+1;
            tasks[_task_id].mentors[tasks[_task_id].mentors.length++]=name;
            certificates[_task_id].mentors[certificates[_task_id].mentors.length++]=name;
            
            if(tasks[_task_id].upvotes==5){
                certificates[_task_id].timestamp=now;
            }
            return true;
        }
        return false;
    }
    
    //__________________________________________
    //getting details
    //__________________________________________
    function getStudent(address _student_id) returns (string name,string password){
        name=student[_student_id].name;
        password=student[_student_id].password;
    }
    function getEvaluator(address _eval_id) returns (string name, bytes32 technology, uint miles,string password){
        name=evaluator[_eval_id].name;
        technology=evaluator[_eval_id].technology;
        miles=evaluator[_eval_id].miles;
        password=evaluator[_eval_id].password;
    }
   function getCert(uint id) returns(bool isready,uint time,address sid,string name,bytes32 tech){
        if(certificates[id].timestamp!=0){
            isready=true;
            time=certificates[id].timestamp;
            sid=certificates[id].student_id;
            name=certificates[id].name;
            tech=certificates[id].technology;

        }
        
    }
    function getTask(uint id) returns (address student_id, string task, bytes32 technology,uint upvotes){
        Task ts=tasks[id];
        student_id=ts.student_id;
        task=ts.task;
        technology=ts.technology;
        upvotes=ts.upvotes;
    }
    function getlengthMentors(uint id)returns (uint l){
        l=tasks[id].mentors.length;
    }
    function getMentors(uint id, uint index) returns(string name){
        name=certificates[id].mentors[index];
    }
    function getEvaluatorSig(uint id, uint index) returns(string name){
        name=tasks[id].mentors[index];
    }
        function getlengthTask()returns(uint l){
        l=tasks.length;
    }
}