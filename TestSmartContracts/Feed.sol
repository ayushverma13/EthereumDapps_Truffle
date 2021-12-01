// This smart contract adds tasks , updates about the items added to the catalogue , items bidded for , and any other updates 

pragma solidity >=0.5.0;
contract Feed {
  uint public taskCount = 0;

  struct Task {
    uint id;
    string content;
    bool completed;
    address publisher;
  }

  mapping(uint => Task) public tasks;

  event TaskCreated(
    uint id,
    string content,
    bool completed,
    address publisher
  );

  event TaskCompleted(
    uint id,
    bool completed
  );

  constructor() public {
        createTask("Updated Stock and Pricing for today ");
      }

  function createTask(string memory _content ) public {
    taskCount ++;
    tasks[taskCount] = Task(taskCount, _content, false ,msg.sender);
    emit TaskCreated(taskCount, _content, false,msg.sender);
  }

  function toggleCompleted(uint _id) public {
    Task memory _task = tasks[_id];
    _task.completed = !_task.completed;
    tasks[_id] = _task;
    emit TaskCompleted(_id, _task.completed);
  }

}