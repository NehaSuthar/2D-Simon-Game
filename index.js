
//----------------------Variable decalaration----------------------------//
const simonApp = {};
simonApp.buttonColours = ["red", "yellow", "green", "blue","pink","blueViolet","mediumAquaMarine","magenta","mediumVioletRed","tomato", "steelBlue", "goldenRod", "indigo","teal","maroon","white"];
simonApp.gamePattern = [];
simonApp.userClickedPattern = [];
simonApp.userSelectedMatrix = [];
simonApp.started = false;
simonApp.level = 0;
simonApp.selectedOption = 0;

//----------------------to start the game on any key pree-------------------//
$(document).on('keypress',()=> {
  if (!simonApp.started) {
    $(".game-title").text("Level " + simonApp.level);
    simonApp.started = true;
    simonApp.nextSequence(simonApp.selectedOption);
  }
});
//---------------to store and compare user pattern with game pattern----------//
$(".grid-container").on('click','.btn',function() {
  let userChosenColour = $(this).attr("id");
  simonApp.userClickedPattern.push(userChosenColour); 
  simonApp.playSound("green");
  simonApp.animatePress(userChosenColour); 
  simonApp.checkAnswer(simonApp.userClickedPattern.length-1);
});
//--------------to nullify all arrays and variable at the end of the game-----//
simonApp.startOver=()=>{
  simonApp.level = 0;
  simonApp.gamePattern = [];
  simonApp.userSelectedMatrix = [];
  simonApp.started = false;
  $('.game-title').text('Press any key to Start the Game');
}
//----------------------to play sound --------------------------//
simonApp.playSound = (color)=>{
  let audio = new Audio(`sounds/${color}.mp3`);
  audio.play();
}
//-----------------to animate key prssed and key release action------//
simonApp.animatePress = (currentColor)=>{
  $("#" + currentColor).addClass("pressed");
  setTimeout(()=>{
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}
//--------------to generate game pattern as per user selected difficulty level---//
//input argument for the function is matrix size eg for 2X2 matrix, 2 will be passed--//
simonApp.nextSequence = (matrixSize)=>{
  simonApp.userClickedPattern = [];
  simonApp.level++;
  $(".game-title").text("Level " + simonApp.level);
  let randomNumber = Math.floor(Math.random() * (matrixSize*matrixSize));
  let randomChosenColour = simonApp.userSelectedMatrix[randomNumber];
  simonApp.gamePattern.push(randomChosenColour);
  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
  simonApp.playSound("green");
}
//----------------for default 2X2 matrix load at the start of the game---------------//
simonApp.intialLoad =()=>{
  $('#select-matrix').find('option:first').attr('selected', 'selected');
  simonApp.selectedOption  = parseInt($('option:first').val());
  simonApp.loadMatrix(simonApp.selectedOption );
}
//----------------event is trigger on difficulty level selection by user---------//
$('#select-matrix').on('change',function(){
  simonApp.startOver();
  simonApp.selectedOption = parseInt($(this).val());
  simonApp.loadMatrix(simonApp.selectedOption );
});
//-----------------function is called to laod the matrix as per the difficulty level--//
//called from simonApp.intialLoad() and  $('#select-matrix').on('change',function()....//
//input argument for the function is matrix size eg for 2X2 matrix, 2 will be passed--//
simonApp.loadMatrix =(matrixSize)=>{
  simonApp.userSelectedMatrix = simonApp.buttonColours.slice(0,(matrixSize*matrixSize));
  $('.grid-container').empty();
  $('.grid-container').css('--row-num',matrixSize);
  $('.grid-container').css('--col-num',matrixSize);
  for(let i=0;i<simonApp.userSelectedMatrix.length;i++){
      const matrixDiv = $('<div>').addClass(`btn ${simonApp.userSelectedMatrix[i]}`).attr({"id":simonApp.userSelectedMatrix[i],"tabindex":i+3});
      $('.grid-container').append(matrixDiv);
    }
  if(matrixSize === 4){
    if(window.matchMedia('(max-width: 420px)').matches){
      $('.btn').css({"div-height":"70px","div-width":"70px"});
    }else{
      $('.btn').css({"div-height":"100px","div-width":"100px"});
    }
  }
  else if(matrixSize === 3){
    if(window.matchMedia('(max-width: 420px)').matches){
      $('.btn').css({"div-height":"90px","div-width":"90px"});
    }else{
      $('.btn').css({"div-height":"130px","div-width":"130px"});
    }
  }
}
//-------------function campare the user pattern with the game pattern----------//
//called from $(".grid-container").on('click','.btn',function() event-------//
simonApp.checkAnswer = (currentLevel) => {
  if (simonApp.gamePattern[currentLevel] === simonApp.userClickedPattern[currentLevel]) {
    if (simonApp.userClickedPattern.length === simonApp.gamePattern.length){
      setTimeout(()=>{
        simonApp.nextSequence(simonApp.selectedOption);
      }, 1000);
    }
  } else {
    simonApp.playSound("wrong");
    $("body").addClass("game-over");
    $(".game-title").text("Game Over, Press Any Key to Restart");

    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 200);
    simonApp.startOver();//to reset all the arrays and variables.
  }
}
//---------call from document ready to intialize the default matrix--//
simonApp.init = ()=>{
  simonApp.intialLoad();//load default color matrix on website load/reload.
}
//---------------------------document ready-------------------------//
$(()=>{
  simonApp.init();
});
