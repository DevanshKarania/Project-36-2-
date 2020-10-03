//Create variables here
var dog,happydog;
var database;
var food,foodstock;
var feed,addFood;
var fedTime,lastFed;
var Foodobj,feedDog,addFoods;
var bedroom,deadDog,garden,sleepingDog,livingRoom,washRoom;
var changegameState, readgameState;
var hungry,garden,washroom,currenttime;
var gameState = "hungry";


function preload(){
dog1 = loadImage("images/dogImg.png");
dogHappy = loadImage("images/dogImg1.png");
bedRoom = loadImage("images/Bed Room.png");
deadDog = loadImage("images/deadDog.png");
Garden = loadImage("images/Garden.png");
sleepingDog = loadImage("images/Lazy.png");
livingRoom = loadImage("images/Living Room.png");
washRoom = loadImage("images/Wash Room.png");
}

function setup() {
  database = firebase.database();
  
  createCanvas(1000, 600);

  FoodObj = new Food();
  
  foodstock=database.ref('Food');
  foodstock.on("value",readStock);
  
  dog = createSprite(700,250,50,50);
  dog.addImage(dog1);
  dog.scale = 0.3;
  
 
  feedPet = createButton("Feed The Dog");
  feedPet.position(700,95);
  feedPet.mousePressed(feedDog);

  addFood = createButton("Add Some Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  input = createInput('Name');
  input.position(430,450);

  button = createButton("ENTER");
  button.position(482.5,480);

  var dogName = createElement('h4');

  button.mousePressed(function()
  {
    var name = input.value();
    dogName.html("The name of the dog is " +name);
    dogName.position(700,350);
  })
  readgameState = database.ref('gameState');
  readgameState.on("value", function(data){
    gameState = data.val();
  })
}


function draw() {  
  background(46,139,87);
  currenttime = hour();
  if(currenttime==(lastFed+1)){
    update("Playing");
    FoodObj.garden();
  }else if(currenttime==(lastFed+2)){
    update("Sleeping");
    FoodObj.bedroom();
  }else if(currenttime==(lastFed+2) && currenttime<=(lastFed+4)){
    update("Bathing");
    FoodObj.washroom();
  }else {
    update("Hungry");
    FoodObj.display();
  }


console.log(gameState);
 
  feedTime = database.ref('FeedTime');
  feedTime.on("value", function(data){
    lastFed = data.val();
  })

  fill(255,255,254);
  textSize(15);

  if(lastFed >= 12)
  {
    text("Last Fed: " +lastFed%12+ "PM",460,30);
  }
  else if(lastFed == 0)
  {
    text("Last Fed: 12 AM",460,30);
  }
  else
  {
    text("Last Fed: " +lastFed+ "AM",460,30);
  } 

  if(gameState !== "hungry"){
   feedPet.hide();
   addFood.hide();
   dog.remove();
  }else{
    feedPet.show();
    addFood.show();
    dog.addImage(dog1);
  }

  drawSprites();
  textSize(20);
  fill("blue");
  text("Food: " + foodstock,250,100);
  
}
function readStock(data){
    foodstock = data.val();
    FoodObj.updateFoodStock(foodstock);
}

function feedDog()
{
  dog.addImage(dogHappy);

  FoodObj.updateFoodStock(FoodObj.getFoodStock()-1);
  database.ref('/').update
  ({
     Food: FoodObj.getFoodStock(),
     FeedTime: hour()
  })
}

function addFoods()
{
  foodstock++;
  database.ref('/').update
  ({
     Food: foodstock
  })
}
function update(state){
  database.ref('/').update({
    gameState:state
  });
}


