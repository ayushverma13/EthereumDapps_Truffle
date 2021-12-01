// Creates tokens that can be exchanged for assets , only the owner or the person who deploys the contract on the chain can mint tokens 
pragma solidity >=0.4.17;
contract TokenCreateDist {

    address public minter;
    mapping (address => uint) public balances;

    // Events allow light clients to react on
    // changes efficiently.
    event Sent(address from, address to, uint amount);

    modifier onlyOwner () {
      require(msg.sender == minter);
      _;
    }
    address public chairperson;


    constructor() public {
        minter = msg.sender;
    }

    function mint(address receiver, uint amount) public onlyOwner{
        if (msg.sender != minter)
          revert();
        balances[receiver] += amount;
    }

    function transfer(address receiver, uint amount) public {
        if (balances[msg.sender] < amount)
          revert();
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Sent(msg.sender, receiver, amount);
    }
}
