// This contract is for the addition of items to show on tha catalogue by a particu;lar seller  
pragma solidity >=0.4.0 ;

contract catalogue{

    struct item{
        address publisher; // seller 
        string itemName;
        string item_desc; // item description
        string itemPinCode;
        string base64QRandNutrition; // a base 64 encoded pdf containing info about the item , will get decoded before getting displayed on front end 
        uint itemCount;
        uint itemVotes; // voted recieved while bidding for the item
    }


    mapping(address => mapping(uint => item)) public itemsAvail;

    uint public itemCount=0;

    constructor() public{
        additem(" Medicine 1 ","description1 ","base64QRandNutrition","141012");
        additem(" Medicine 2 ","description1 ","base64QRandNutrition","576104");
    }

    function additem(string memory itemName,string memory description,string memory QR ,string memory PinCode ) public {
    itemCount++;
    itemsAvail[msg.sender][itemCount].publisher = msg.sender;
    itemsAvail[msg.sender][itemCount].itemName = itemName;
    itemsAvail[msg.sender][itemCount].item_desc = description;
    itemsAvail[msg.sender][itemCount].itemPinCode = PinCode;
    itemsAvail[msg.sender][itemCount].base64QRandNutrition = QR;
    itemsAvail[msg.sender][itemCount].itemCount = itemCount;
    itemsAvail[msg.sender][itemCount].itemVotes = 0;

    }

}


// for adding double mapping of class of drugs aswell

//   struct Struct {
//     uint timestamp;
//   }

//   // Mapping test
//   mapping(uint => mapping(uint => uint)) mymap;

//   mapping(address => mapping(uint => Struct[])) someName;

//   function testNestedMappings() {
//     //@log test nested mappings
//     mymap[1][2] = 42;
//     //@log mymap[1][2] = `uint mymap[1][2]`
//     //@log test struct array:
//     //@log someName[msg.sender][1].length = `uint someName[msg.sender][1].length`
//     //@log incrementing length
//     someName[msg.sender][1].length++;
//     //@log saving timestamp to last entry
//     someName[msg.sender][1][someName[msg.sender][1].length - 1].timestamp = block.timestamp;
//     //@log `uint someName[msg.sender][1][someName[msg.sender][1].length-1].timestamp`
//   }
// }