// Javascript app that talks to the blockchain
//the first thing we'll do is actually create an app object , we'll create a load function and actually call this async.
//we're going to use a lot of async ,using a lot of async/await pattern when loading data from the blockchain it seems to be pretty helpful
//so we'll fill this in and then in order to load the app let's actually do this console.log app loading

//the first thing we want to do inside this load function ,is actually load web 3 ,we want to load the web 3 library in order to connect to the blockchain .

//Now when we load web 3 I'm actually just going to use the configuration that's specified by meta mask themselves right what we're doing is creating a way to talk to the blockchain,
// we want meta mask which is going to be the browser extension that we use to connect to our dapp
App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8

  //this application is backed by blockchain and we want to actually connect to the blockchain to use it ,so a
//few things have to happen, we have to connect our browser to the blockchain, and it's what we use meta mask for right,
// and then our client-side application needs to actually connect to the blockchain ,and that's what web 3 J S is for.
//So inside of our project we'll use the web 3 J's library to talk to the etherium blockchain , through metamask ,it'll actually allow us to connect to it and you know read
//and write data from the blockchain inside of the app, and then meta mask will allow us to you know communicate that to the blockchain network.

  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

// Show the account on the app, connected to the blockchain nw on ganache 
//now let's take that account from ganache and let's show it in our application ,to prove that we're actually connected to the blockchain
// create load account function say load account this would be async ,and I'll say app.account equals web three , web three here was set by load web three ,
//and it has this eth object that's going to contain all the accounts which will be an array when you get the first one.
// which will be the account that we're connected with inside a meta mask and

//inside of the index.html file you'll see that we have a place for the account here this will be the place where we can actually add the account


  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0]
    console.log(App.account)
    console.log(web3.eth.accounts)
  },
// This is where we load the smart contract data from the blockchain. 
//We create a JavaScript representation of the smart conract wit the Truffle Contract library. 
//Then we load the smart contract data with web3. This will allow us to list the tasks in the todo list.

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const todoList = await $.getJSON('TodoList.json')
    const catalogue = await $.getJSON('catalogue.json')
    const Ballot = await $.getJSON('Ballot.json')
    const Coin = await $.getJSON('Coin.json')

    //Truffle contract is a javascript version of the smart contract that allows us to call the functions on it and stuff
    
    // To Do List
    App.contracts.TodoList = TruffleContract(todoList)
    App.contracts.TodoList.setProvider(App.web3Provider)

    // Catalogue
    App.contracts.catalogue = TruffleContract(catalogue)
    App.contracts.catalogue.setProvider(App.web3Provider)

    // Ballot
    App.contracts.Ballot = TruffleContract(Ballot)
    App.contracts.Ballot.setProvider(App.web3Provider)

    // Coin
    App.contracts.Coin = TruffleContract(Coin)
    App.contracts.Coin.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.todoList = await App.contracts.TodoList.deployed()
    App.catalogue = await App.contracts.catalogue.deployed()
    App.Ballot = await App.contracts.Ballot.deployed()
    App.Coin = await App.contracts.Coin.deployed()

    console.log(App.todoList)
    console.log(App.catalogue)
    console.log(App.Ballot)
    console.log(App.Coin)
  },

  render: async () => {
    $('#Html1').show()
    $('#Html2').hide()
    $('#Html3').hide()
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(App.account)

    // Render Tasks
    await App.renderTasks()

    // Update loading state
    App.setLoading(false,2)
  }, 

  // This is where we actually list the tasks in the todo list. 
  //Notice that we create a for loop to access each task individually. 
  //That is because we cannot fetch the entire tasks mapping from the smart contract. We must first determine the taskCount and fetch each task one-by-one.
  
  renderTasks: async () => {
    
    //await App.TODO_Tasks()
    await App.Catalogue_Tasks()

    
  },

  //////////////////////////////////// - Catalogue - ///////////////////////////////////////////////////
  Catalogue_Tasks: async () => {
    console.log("Entered catalogue")
    App.setLoading(true)
    const CatalogueHTML = $('#CatalogueHTML')
    CatalogueHTML.show();
    // Load the total task count from the blockchain
    const itemCount = await App.catalogue.itemCount()
    console.log("item count")
    console.log(itemCount.toNumber())
    const $itemTemplate = $('.itemTemplate')
    $('#DetailViewItem').hide()
    // Render out each task with a new task template
    for (var i = 1; i <= itemCount; i++) {
      // Fetch the task data from the blockchain
      const item = await App.catalogue.itemsAvail(i)
      const itemPublisher = item[0]
      const itemName = item[1]
      //console.log(itemName)
      const item_desc = item[2]
      //console.log(item_desc)
      // const itemPinCode = item[3]
      // const base64QRandNutrition = item[4]
      const itemCount = item[5]
      // const itemVotes = item[6]

      // const Item_Detail_Check = $('#Item_Detail_Check').val()
      // console.log("Item detail Check")
      // console.log(Item_Detail_Check)

      // Create the html for the task
      const $newitemTemplate = $itemTemplate.clone()
      $newitemTemplate.find('.itemPublisher').html(itemPublisher)
      $newitemTemplate.find('.itemName').html(itemName)
      $newitemTemplate.find('#Item_Detail_Check')
                      .prop('itemName', itemName)
                      .prop('itemPublisher', itemPublisher)
                      .prop('itemCount', itemCount)
                      .prop('checked', false)
                      .on('click', App.displayDetail)

      // Put the Item in the  list
  
      $('#itemlist').append($newitemTemplate)
      

      // Show the task
      App.setLoading(false,2)
      $newitemTemplate.show()
    }

  },
  addItem: async () => {
    console.log("Entered add item");
    App.setLoading(true)
    console.log("setLoading(true)");
    const Item_Name = $('#ItemName').val()
    const description = $('#description').val()
    const QR = $('#QR').val()
    const PinCode = $('#PinCode').val()
    console.log(Item_Name)
    console.log(description)
    console.log(QR)
    console.log(PinCode)
    await App.catalogue.additem(Item_Name,description,QR,PinCode)
    // use this to guide to other htmls
    window.location.reload()
  },

  displayDetail: async (e) => {
    
    console.log("printing the input")
    console.log(e)
    console.log(e.target)
    console.log(e.target.itemName)

    //App.setLoading(true)
    const $itemTemplate = $('.itemDetailTemplate')
    const item = await App.catalogue.itemsAvail(e.target.itemCount)
    const $newitemTemplate = $itemTemplate.clone()

    $newitemTemplate.find('.itemPublisher').html("Item Publisher - "+item[0])
    $newitemTemplate.find('.itemName').html("item Name - "+item[1])
    $newitemTemplate.find('.item_desc').html("item_desc - "+item[2])
    $newitemTemplate.find('.itemPinCode').html("itemPinCode - "+item[3])
    $newitemTemplate.find('.base64QRandNutrition').html("base64QRandNutrition - "+item[4])
    $newitemTemplate.find('.itemCount').html("itemCount - "+item[5])
    $newitemTemplate.find('.itemVotes').html("itemVotes - "+item[6])
    $('#DetailViewItem').append($newitemTemplate)
    $('#DetailViewItem').show()

    //window.location.reload()
  },

  //////////////////////////////////// - Ballot - //////////////////////////////////////////////////////
  Ballot_Tasks: async () => {
    window.location.href = "./Users/ayushverma13yahoo.co.in/Desktop/SampleProjects /Blockchain Rohini Rao/Courera Ballot/tutorial/src/index3.html"
  },
  //////////////////////////////////// - COin - //////////////////////////////////////////////////////
  Coin_Tasks: async () => {
    window.location.href = "/Users/ayushverma13yahoo.co.in/Desktop/SampleProjects /Blockchain Rohini Rao/Courera Ballot/tutorial/src/index2.html"
  },
  //////////////////////////////////// - TO DO LIST - ///////////////////////////////////////////////////
  // create task function
  TODO_Tasks: async () => {
    // Load the total task count from the blockchain
    const taskCount = await App.todoList.taskCount()
    const $taskTemplate = $('.taskTemplate')

    // Render out each task with a new task template
    for (var i = 1; i <= taskCount; i++) {
      // Fetch the task data from the blockchain
      const task = await App.todoList.tasks(i)
      const taskId = task[0].toNumber()
      const taskContent = task[1]
      const taskCompleted = task[2]

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(taskContent)
      $newTaskTemplate.find('input')
                      .prop('name', taskId)
                      .prop('checked', taskCompleted)
                      .on('click', App.toggleCompleted)

      // Put the task in the correct list
      if (taskCompleted) {
        $('#completedTaskList').append($newTaskTemplate)
      } else {
        $('#taskList').append($newTaskTemplate)
      }

      // Show the task
      $newTaskTemplate.show()
    }
  },

  // create task function
  createTask: async () => {
    console.log("Entered create task");
    App.setLoading(true)
    console.log("setLoading(true)");
    const content = $('#newTask').val()
    console.log(content)
    await App.todoList.createTask(content)
    window.location.reload()
  },

  toggleCompleted: async (e) => {
    
    console.log("printing the input")
    console.log(e)

    App.setLoading(true)
    const taskId = e.target.name
    await App.todoList.toggleCompleted(taskId)
    window.location.reload()
  },

  menuOps : async () =>{

    console.log("Printing in menu ops")
    const ToDoCB = $('#ToDoCB').is(":checked")
    console.log(ToDoCB)
    const CatCB = $('#CatCB').is(":checked")
    console.log(CatCB)
    const BalCB = $('#BalCB').is(":checked")
    console.log(BalCB)
    if ($('#BalCB').is(":checked")){
      console.log("html 2 render")
      $('#Html1').hide()
      $('#Html2').show()

    }
    const CoinCB = $('#CoinCB').is(":checked")
    console.log(CoinCB)

  },

  setLoading: (boolean,uint) => {
    // console.log("Testing input")
    // console.log(e)
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    const CatalogueHTML = $('#CatalogueHTML')
    const BallotHTML = $('#BallotHTML')
    const CoinHTML = $('#CoinHTML')

    if (boolean) {
      loader.show()
      content.hide()
      CatalogueHTML.hide()
      BallotHTML.hide()
      CoinHTML.hide()
    } else {
      loader.hide()
      if (uint == 1){
        content.show()
        CatalogueHTML.hide()
        BallotHTML.hide()
        CoinHTML.hide()
      }else if (uint == 2){
        content.hide()
        CatalogueHTML.show()
        BallotHTML.hide()
        CoinHTML.hide()
      }else if (uint == 3){
        content.hide()
        CatalogueHTML.hide()
        BallotHTML.show()
        CoinHTML.hide()
      }else if (uint == 4){
        content.hide()
        CatalogueHTML.hide()
        BallotHTML.hide()
        CoinHTML.show()
      }
      
    }
  }
},


// initialise the app whenever the window loads 


$(() => {
  $(window).load(() => {
    App.load()
  })
})