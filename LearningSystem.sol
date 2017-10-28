pragma solidity ^0.4.0;
contract LearningSystem{
    //student structure
    struct Student{
        address id;
        string name;
    }
    //evaluator structure
    struct Evaluator{
        address id;
        string name;
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
    function registerStudent(address _id, string _name) payable returns  (bool success){
        student[_id].id=_id;
        student[_id].name=_name;
        return true;
    }
    //function for registering evaluator
    function registerEvaluator(address _id,string _name, bytes32 _technology, uint _miles)payable returns (bool){
        evaluator[_id].id=_id;
        evaluator[_id].name=_name;
        evaluator[_id].technology=_technology;
        evaluator[_id].miles=_miles;
        return true;
    }
    //function for student submit tasks

    function submitTask(address _student_id,string _tasks,bytes32 _technology)payable returns(bool){
        Task ts;
        ts.student_id=_student_id;
        ts.task=_tasks;
        ts.technology=_technology;
        tasks.push(ts);
        Certificate cert;
        cert.student_id=_student_id;
        cert.name=student[_student_id].name;
    }
    //function for evaluator
    function upvoteTask(address _student_id,uint _task_id) payable returns(bool){
        string name=evaluator[msg.sender].name;
        tasks[_task_id].upvotes=tasks[_task_id].upvotes+1;
        tasks[_task_id].mentors[tasks[_task_id].mentors.length++]=name;




        // if(tasks[_task_id].upvotes==5){
        //     Certificate cert;
        //     cert.student_id=_student_id;
        //     cert.name=student[_student_id].name;
        //     cert.technology=tasks[_task_id].technology;

        // }
    }

}
