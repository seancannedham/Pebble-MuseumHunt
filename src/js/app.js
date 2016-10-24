/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

//all the questions, correct answers, whether user answered or not is here
var artifact = [];
artifact[0] = {question:"The name of the stitches that hang off the bottom of the artifact are called ears", answer:1, useranswer:-1};
artifact[1] = {question:"The collar was filled with sugar pine, sage, or dandelion", answer:0, useranswer: -1};
artifact[2] = {question:"The drum has a dragon on it", answer:0, useranswer: -1};
artifact[3] = {question:"Once sharpened, the  bone hide scraper would not wear out", answer:0, useranswer: -1};
artifact[4] = {question:"moccasins were constructed of deer or antelope hide", answer:1, useranswer: -1};
artifact[5] = {question:"The hide was folded while dry", answer:0, useranswer: -1};
artifact[6] = {question:"The roach was used by men for camouflage", answer:1, useranswer: -1};

var UI = require('ui');
var Vector2 = require('vector2');

/*
definitions are in the following order
-> each window or menu or card definition. Followed by all variable, function and events used by that window and which depend on some future window
-> definition of things which depended on future windows
-> Main code

All the logic is embedded inside the events for each window. Main just starts the app
*/

//------- welcome definition
var welcome = new UI.Card({
  title: 'Museum Hunt',
  icon: 'images/menu_icon.png',
  subtitle: 'Welcome!!!',
  body: 'Press center button to begin'
});

var wcm_score = 0;


//----------home definition
var home = new UI.Window({
  clear:true,
  action: {
    up: 'images/plus.png',
    down: 'images/minus.png',
    backgroundColor: 'white'
  }
});
var hme_values = [0,0,0];
var hme_positioncounter = 2;
var hme_IDvalue;
var hme_font = 'bitham-42-bold';


var hme_eachfield = [new UI.Text({
    position: new Vector2(0, 50),
    size: new Vector2(30, 30),
    font: 'bitham-42-bold',
    text: hme_values[0],
    textAlign: 'center'
  }),
  new UI.Text({
    position: new Vector2(40, 50),
    size: new Vector2(30, 30),
    //font: 'gothic-24-bold',
    font: 'bitham-42-bold',
    text: hme_values[1],
    textAlign: 'center'
  }),
  new UI.Text({
    position: new Vector2(80, 50),
    size: new Vector2(30, 30),
    //font: 'gothic-24-bold',
    font: 'bitham-42-bold',
    text: hme_values[2],
    textAlign: 'center'
    })];
var hme_lpress = new UI.Text({
  position: new Vector2(0, 100),
    size: new Vector2(100, 40),
    //font: 'gothic-24-bold',
    font: 'gothic-18-bold',
    text: "long press to select",
    textAlign: 'center'
});


function hme_incrementcounter()
{
  hme_positioncounter = (hme_positioncounter + 1) % 3;
  return;
}

function hme_setinitialscreen1()
{
  hme_positioncounter = 2;
  for(var i = 0; i<3; i++)
  {
    home.add(hme_eachfield[hme_positioncounter]);
    hme_incrementcounter();
  }
  home.add(hme_lpress);
} 

function hme_modadd(value)
{
  return ((value + 1) % 10);
}

function hme_modsub(value)
{
  value = ((value - 1) % 10);
  if (value < 0)
  {
    value += 10;
  }
  return value;
}

home.on('click', 'up', function(e)
{
  hme_values[hme_positioncounter] = hme_modadd(hme_values[hme_positioncounter]);
  hme_eachfield[hme_positioncounter].text(hme_values[hme_positioncounter]);
  console.log("up click");
});
home.on('click', 'down', function(e) {
 hme_values[hme_positioncounter] = hme_modsub(hme_values[hme_positioncounter]);
hme_eachfield[hme_positioncounter].text(hme_values[hme_positioncounter]);
});

home.on('click', 'select', function(e) {
  hme_eachfield[hme_positioncounter].font('bitham-42-bold');  
  hme_incrementcounter();
    
});

function hme_getIDValue()
{
  hme_IDvalue = ((hme_values[0] * 100) + (hme_values[1] * 10) + hme_values[2]);
  //console.log("completed getIDValue");
}

function hme_validid(value_id)
{
  if ((value_id >= 0) && (value_id < artifact.length))
    {
      return true;
    }
  else
    {
      return false;
    }
}



//----------display_question

var display_question = new UI.Card({
  title: 'Question: not set till now',
  //subtitle: 'question',
  //body: 'Worth 1 point',
  subtitle : '',
  body : '',
  scrollable: true
});


//-----------wrong_ID
var wrong_ID = new UI.Card({
    title: 'ERROR',
    subtitle: 'invalid ID. Press select',
    body : '',
    scrollable: true
});

wrong_ID.on('click', 'select', function(e){
  wrong_ID.hide();
});

//------already answered
var already_answered = new UI.Card({
    title: 'Already Answered',
    subtitle: '',
    body : 'press center button to go back',
    scrollable: true
});

already_answered.on('click', 'select', function(e){
  already_answered.hide();
});

//-----------update_score
var update_score = new UI.Card({
  title: "Incorrect",
  icon: 'images/menu_icon.png',
  subtitle: "",
  body: 'Your current score is'
});

update_score.on('click', 'select', function(e) {
    update_score.hide();
});


//----------answer_window
var answer_window = new UI.Menu({
    sections: [{
      items: [{
        title: 'False',
        icon: 'images/Resized-FF.png',
        subtitle: 'False answer'
      },{
        title: 'True',
        icon: 'images/Resized-TTT.png',
        subtitle: 'True answer'
      }, {
        title: '<- Main Menu',
        icon: '',
      }]
    }]
});

function asw_increment_score(weight){
    wcm_score = wcm_score + weight;
  }

answer_window.on('select', function(e) {
    var answer = artifact[hme_IDvalue].answer;
    var weight = 1;
    //var validity, congrats;
    switch(e.itemIndex){
      case 0:
        if(answer === 0){
          update_score.title("Correct");
          update_score.body("Nice work detective!");
          update_score.icon("images/Correct.png");
          asw_increment_score(weight);
          
        }else{
          update_score.title("Incorrect");
          update_score.body("Try again next time!");
          update_score.icon("images/Wrong.png");
        }
        artifact[hme_IDvalue].useranswer = 0;
        hme_positioncounter = 2;
        update_score.body("Your current score is "+wcm_score.toString());
        update_score.show();
        answer_window.hide();
        display_question.hide();
        break;
        
      case 1:
        if(answer === 1){
          update_score.title("Correct");
          update_score.body("Nice work detective!");
          update_score.icon("images/Correct.png");
          asw_increment_score(weight);
        }else{
          update_score.title("Incorrect");
          update_score.body("Try again next time!");
          update_score.icon("images/Wrong.png");
        }
        artifact[hme_IDvalue].useranswer = 0;
        hme_positioncounter = 2;
        update_score.body("Your current score is "+wcm_score.toString());
        update_score.show();
        answer_window.hide();
        display_question.hide();
        break;
        
      case 2:
        hme_positioncounter = 2;
        answer_window.hide();
        display_question.hide();
        break;
      }
    });
  

//----------Things which depend on home
welcome.on('click', 'select', function(e){
  home.show();
  hme_setinitialscreen1();
  setInterval(function hme_changecolor() {
  if(hme_font == 'bitham-42-bold')
    {
      hme_eachfield[hme_positioncounter].font("gothic-24-bold");
      hme_font = "gothic-24-bold";
    }
  else
    {
      hme_eachfield[hme_positioncounter].font('bitham-42-bold');
      hme_font = 'bitham-42-bold';
    }  
}, 1000);
  //welcome.hide();
});

//-----------
function dsq_show_question(id_value)
{
  console.log("Started Show question");
  display_question.title('Question:');
  display_question.body(artifact[id_value].question);
  display_question.show();
  console.log("ended show question");
}

function dsq_showerror()
{
  wrong_ID.show();
}

//Things dependent on display question and before
home.on('longClick', 'select', function(e) {
    console.log("long click");
    hme_getIDValue();
    if(hme_validid(hme_IDvalue))
      {
        if(artifact[hme_IDvalue].useranswer === -1)
          {
            dsq_show_question(hme_IDvalue);
          }
        else
          {
            already_answered.show();
          }
      }
    else
      {
        dsq_showerror();
      }
   
});

//things dependent on answer window
display_question.on('click', 'select', function(e) {
    answer_window.show();
});
//----------home related defintions

//Main code
welcome.show();
