pragma solidity >=0.4.17;

contract Ballot {

    struct Voter {
        uint weight;
        bool voted;
        uint8 vote;
        // address delegate;
    }

    //modifer
    modifier onlyOwner () {
      require(msg.sender == chairperson);
      _;
    }

    /* struct Proposal {
        uint voteCount; // could add other data about proposal
    } */
    address public chairperson;

    //named array of struct Voter with key as the address of voter
    mapping(address => Voter) public voters;

    uint public numberOfProposals;

    uint[] public proposals;

    
    constructor() public {
        chairperson = msg.sender;
        voters[chairperson].weight = 2;
        numberOfProposals = 0;
    }


    function updateProposals(uint number) public onlyOwner{
        numberOfProposals += 1;
        proposals.push(0);
        //proposals.pop();
    }


    /// Give $(toVoter) the right to vote on this ballot.
    /// May only be called by $(chairperson).
    function register(address toVoter) public onlyOwner{
        if(voters[toVoter].weight != 0) revert();
        voters[toVoter].weight = 1;
        voters[toVoter].voted = false;
    }

    /// Give a single vote to proposal $(toProposal).
    function vote(uint8 toProposal) public {
        Voter storage sender = voters[msg.sender];
        if (sender.voted || toProposal >= 4 || sender.weight == 0) revert();
        sender.voted = true;
        sender.vote = toProposal;
        proposals[toProposal] += sender.weight;
    }

    function winningProposal() public view returns (uint8 _winningProposal) {
        uint256 winningVoteCount = 0;
        for (uint8 prop = 0; prop < numberOfProposals; prop++)
            if (proposals[prop] > winningVoteCount) {
                winningVoteCount = proposals[prop];
                _winningProposal = prop;
            }
    }

    function getCount() public view returns (uint[] memory) {
        return proposals;
    }
}
