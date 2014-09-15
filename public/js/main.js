$(document).ready(function(){
  game.init();

});


var game = {
init: function(){
  var gameCount = 0;
  var winCount = 0;
  var loseCount = 0;

  $('#game-result').hide();

  $("#new-game").on("click","button",layGrid);

  $("#validate-game").on("click","button",validateGame);

  $("#cheat").on("click","button", showMines);

function layGrid(){
  //pick grid factor
  $('#game-result').hide();
  var gf = 8;
  var mineSquareCount = 0;
   gameCount+=1;
   $('#game-count').text('Game Count: '+gameCount);
   $('#grid-container').empty();
    console.log('clicked');
    var columnCount = 0;

    for(var i=0;i<gf;i++){

     $('#grid-container').append("<div class = 'grid-column' id = 'column-"+columnCount+"'></div>");
     columnCount+=1;
   }
   for(var i=0;i<columnCount;i+=1){
     for(var j=0;j<columnCount;j+=1){
         $('#column-'+j).append("<div class = 'mine-square' id ='mine-square-"+mineSquareCount+"' ><div class='unchecked-square'>"+mineSquareCount+"</div></div>");
         mineSquareCount += 1;
         console.log(mineSquareCount);
    }
   }
   //assign some mines
   assignMines(gf);

   /*find out how many mines are next to each
   cell*/
   enumerateMineAdjacency(gf);

$(".mine-square").on("click",".unchecked-square",function(event){
    event.preventDefault();
    event.stopPropagation();
    $(this).text('?');
});

$(".mine-square").on("click",".danger-square",function(event){
    event.preventDefault();
    event.stopPropagation();
    $(this).addClass('question-square');
    $(this).text('?');
});

$(".mine-square").on("dblclick",".unchecked-square",function(event){
    event.preventDefault();
    event.stopPropagation();
    var adjacentMines = $(this).data('adjacentMines');
    var squareIdNumber = $(this).parent().attr('id').split("-").pop();
    $(this).removeClass("unchecked-square");
    $(this).parent().addClass("cleared-square");
    $(this).text(adjacentMines);
    var squareIdNumber = parseInt($(this).parent().attr('id').split("-").pop());
    console.log('clearing mine number: ' + squareIdNumber);
    if(adjacentMines == '0'){
      openAdjacentMines(squareIdNumber,8);
    }
    $(this).addClass("opens-adjacents");

});

$(".mine-square").on("open",".unchecked-square",function(event){
    event.preventDefault();
    event.stopPropagation();
    var adjacentMines = $(this).data('adjacentMines');
    var squareIdNumber = $(this).parent().attr('id').split("-").pop();
    $(this).removeClass("unchecked-square");
    $(this).parent().addClass("cleared-square");
    $(this).text(adjacentMines);
    console.log('clearing mine number: ' + squareIdNumber);
    $(this).addClass("opens-adjacents");
});

$(".mine-square").on("dblclick",".danger-square",function(event){
    event.preventDefault();
    event.stopPropagation();
    $(this).text('boom');
    $('#game-result').html('Try Again!').slideDown();
    loseCount += 1;
    $(this).removeClass("danger-square");
    $(this).removeClass("cheat-square");
    $(this).parent().addClass("exploded-square");
});
$(".mine-square").on("dblclick",".opens-adjacents", function(event){
    event.preventDefault();
    event.stopPropagation();
    var adjacentMines = $(this).data('adjacentMines');
    var squareIdNumber = $(this).parent().attr('id').split("-").pop();
    console.log('clearing mine number: ' + squareIdNumber);
    if(adjacentMines == '0'){
      openAdjacentMines(squareIdNumber,8);
    }

});

}
function showMines(){
  var dangerMines = [];
  $.each($('.danger-square'),function(){
      dangerMines.push(parseInt($(this).parent().attr('id').split('-').pop()) );
  });
  console.log(dangerMines);
  for(var i=0;i<dangerMines.length;i+=1){
        $('#mine-square-'+dangerMines[i]).find('div').addClass('cheat-square');
      }
  }
function validateGame(){
   console.log('validating');
   console.log(checkMines());
   var mineCheck = checkMines();
   var clearCheck = checkCleared();
   if(mineCheck){
      console.log('all mines are marked');
      }else{
      console.log('not all mines are marked');
      }
   if(clearCheck){
      console.log('all the empty squares are cleared');
      }else{
        console.log('you\'ve got to mark or clear every square');
      }

    if(mineCheck && clearCheck){
      $('#game-result').html('You Won!').slideDown();
      winCount +=1;
    } else {
      $('#game-result').html('Try Again!').slideDown();
    }

}

var checkMines = function(){
    var dangerMines = [];
    $.each($('.danger-square'),function(){
      dangerMines.push($(this).parent().attr('id').split('-').pop() );
    })
    console.log('checking danger mines: ' + dangerMines);
    for(var i=0;i<dangerMines.length;i+=1){
        if($('#mine-square-'+dangerMines[i]).find('div').hasClass('question-square')!== true){
            return false;
      }
    }
    return true;
}

var checkCleared = function(){
    var clearedSquares = [];
    $.each($('.mine-square'),function(){
      clearedSquares.push($(this).attr('id').split('-').pop() );
    })
    console.log('checking squares that should be cleared: ' + clearedSquares);
    for(var i=0;i<clearedSquares.length;i+=1){
        if($('#mine-square-'+clearedSquares[i]).find('div').hasClass('danger-square')!== true){
            if($('#mine-square-'+clearedSquares[i]).find('div').hasClass('opens-adjacents')!== true){
            return false;
      }
    }
  }
    return true;
}

var assignMines = function(gf){
    var mine1 = getRandomInt(0,gf*gf);
    var mine2 = getRandomInt(0,gf*gf);
    if ( mine2 === mine1 ){
      while( mine2 === mine1 ){
      mine2 = getRandomInt(0,gf*gf);
      }
    }
    var mine3 = getRandomInt(0,gf*gf);
    if ( mine3 === mine2 || mine3 === mine1){
      while ( mine3 === mine2 || mine3 === mine1){
        mine3 = getRandomInt(0,gf*gf);
      }
    }
    var mine4 = getRandomInt(0,gf*gf);
    if ( mine4 === mine3 || mine4 === mine2 || mine4 === mine1){
      while ( mine4 === mine3 || mine4 === mine2 || mine4 === mine1){
        mine4 = getRandomInt(0,gf*gf);
      }
    }
    var mine5 = getRandomInt(0,gf*gf);
     if ( mine5 === mine4 || mine5 === mine3 || mine5 === mine2 || mine5 === mine1){
      while ( mine5 === mine4 || mine5 === mine3 || mine5 === mine2 || mine5 === mine1){
        mine5 = getRandomInt(0,gf*gf);
      }
    }
    var mine6 = getRandomInt(0,gf*gf);
     if ( mine6 === mine5 || mine6 === mine4 || mine6 === mine3 || mine6 === mine2 || mine6 === mine1){
      while ( mine6 === mine5 || mine6 === mine4 || mine6 === mine3 || mine6 === mine2 || mine6 === mine1){
        mine6 = getRandomInt(0,gf*gf);
      }
    }
    var mine7 = getRandomInt(0,gf*gf);
     if ( mine7 === mine6 || mine7 === mine5 || mine6 === mine4 || mine6 === mine3 || mine6 === mine2 || mine6 === mine1){
      while( mine7 === mine6 || mine7 === mine5 || mine6 === mine4 || mine6 === mine3 || mine6 === mine2 || mine6 === mine1){
        mine7 = getRandomInt(0,gf*gf);
      }
    }
    var mine8 = getRandomInt(0,gf*gf);
     if ( mine8 === mine7 || mine8 === mine6 || mine8 === mine5 || mine8 === mine4 || mine8 === mine3 || mine8 === mine2 || mine8 === mine1){
      while ( mine8 === mine7 || mine8 === mine6 || mine8 === mine5 || mine8 === mine4 || mine8 === mine3 || mine8 === mine2 || mine8 === mine1){
        mine8 = getRandomInt(0,gf*gf);
      }
    }
    var mine9 = getRandomInt(0,gf*gf);
     if ( mine9 === mine8 || mine9 === mine7 || mine9 === mine6 || mine9 === mine5 || mine9 === mine4 || mine9 === mine3 || mine9 === mine2 || mine9 === mine1){
      while ( mine9 === mine8 || mine9 === mine7 || mine9 === mine6 || mine9 === mine5 || mine9 === mine4 || mine9 === mine3 || mine9 === mine2 || mine9 === mine1){
        mine9 = getRandomInt(0,gf*gf);
      }
    }
    var mine10 = getRandomInt(0,gf*gf);
     if ( mine10 === mine9 || mine10 === mine8 || mine10 === mine7 || mine10 === mine6 || mine10 === mine5 || mine10 === mine4 || mine10 === mine3 || mine10 === mine2 || mine10 === mine1){
      while ( mine10 === mine9 || mine10 === mine8 || mine10 === mine7 || mine10 === mine6 || mine10 === mine5 || mine10 === mine4 || mine10 === mine3 || mine10 === mine2 || mine10 === mine1){
        mine10 = getRandomInt(0,gf*gf);
      }
    }
    console.log(mine1 + " " + mine2 + " " + mine3 + " " + mine4 + " " + mine5 + " " + mine6 + " " + mine7 + " " + mine8 + " " + mine9 + " " + mine10 );

    $('#mine-square-'+mine1).find("div").removeClass("unchecked-square");
    $('#mine-square-'+mine1).find("div").addClass("danger-square");

    $('#mine-square-'+mine2).find("div").removeClass("unchecked-square");
    $('#mine-square-'+mine2).find("div").addClass("danger-square");

    $('#mine-square-'+mine3).find("div").removeClass("unchecked-square");
    $('#mine-square-'+mine3).find("div").addClass("danger-square");

    $('#mine-square-'+mine4).find("div").removeClass("unchecked-square");
    $('#mine-square-'+mine4).find("div").addClass("danger-square");

    $('#mine-square-'+mine5).find("div").removeClass("unchecked-square");
    $('#mine-square-'+mine5).find("div").addClass("danger-square");

    $('#mine-square-'+mine6).find("div").removeClass("unchecked-square");
    $('#mine-square-'+mine6).find("div").addClass("danger-square");

    $('#mine-square-'+mine7).find("div").removeClass("unchecked-square");
    $('#mine-square-'+mine7).find("div").addClass("danger-square");

    $('#mine-square-'+mine8).find("div").removeClass("unchecked-square");
    $('#mine-square-'+mine8).find("div").addClass("danger-square");

    $('#mine-square-'+mine9).find("div").removeClass("unchecked-square");
    $('#mine-square-'+mine9).find("div").addClass("danger-square");

    $('#mine-square-'+mine10).find("div").removeClass("unchecked-square");
    $('#mine-square-'+mine10).find("div").addClass("danger-square");
  }

var enumerateMineAdjacency = function(gf){
    for(var i=0;i<(gf*gf);i+=1){
       countAdjacentMines(i,gf);
    }
};

var countAdjacentMines = function(i,gf){
  var mineCount = 0;
  //check top left corner
  if(i === 0){
      if (checkForDanger(1) === true){
         mineCount+=1;
      };
      if (checkForDanger(gf) === true){
         mineCount+=1;
      };
      if (checkForDanger(gf+1) === true){
         mineCount+=1;
      };
  }
  //check top right corner
  else if(i === (gf-1)) {
      if (checkForDanger(i-1) === true){
         mineCount+=1;
      };
      if (checkForDanger(i+gf-1) === true){
         mineCount+=1;
      };
      if (checkForDanger(i+gf) === true){
         mineCount+=1;
      };
  }
  //check bottom left corner
  else if(i === ( gf * (gf-1) ) ){
      if (checkForDanger(i-gf) === true){
         mineCount+=1;
      };
      if (checkForDanger(i-gf+1) === true){
         mineCount+=1;
      };
      if (checkForDanger(i+1) === true){
         mineCount+=1;
      };
  }
  //check bottom right corner
  else if(i === ( (gf * gf) - 1 ) ){
      if (checkForDanger(i-1) === true){
         mineCount+=1;
      };
      if (checkForDanger(i-gf) === true){
         mineCount+=1;
      };
      if (checkForDanger(i-gf-1) === true){
         mineCount+=1;
      };
  }
  //check left side
  else if( i % gf === 0){
      if (checkForDanger(i-gf) === true){
         mineCount+=1;
      };
      if (checkForDanger(i-gf+1) === true){
         mineCount+=1;
      };
      if (checkForDanger(i+1) === true){
         mineCount+=1;
      };
      if (checkForDanger(i+gf) === true){
         mineCount+=1;
      };
      if (checkForDanger(i+gf+1) === true){
         mineCount+=1;
      };
  }
  //check right side
  else if( (i+1) % gf === 0){
      if (checkForDanger(i-1) === true){
         mineCount+=1;
      };
      if (checkForDanger(i-gf-1) === true){
         mineCount+=1;
      };
      if (checkForDanger(i-gf) === true){
         mineCount+=1;
      };
      if (checkForDanger(i+gf-1) === true){
         mineCount+=1;
      };
      if (checkForDanger(i+gf) === true){
         mineCount+=1;
      };
  }
  //check top row
    else if( i > 0 && i< gf){
      if (checkForDanger(i-1) === true){
         mineCount+=1;
      };
      if (checkForDanger(i+1) === true){
         mineCount+=1;
      };
      if (checkForDanger(i+gf-1) === true){
         mineCount+=1;
      };
      if (checkForDanger(i+gf) === true){
         mineCount+=1;
      };
      if (checkForDanger(i+gf+1) === true){
         mineCount+=1;
      };
    }
  //check bottom row
    else if( i > (gf * (gf-1) ) && i < ((gf*gf)-1)){
      if (checkForDanger(i-1) === true){
         mineCount+=1;
      };
      if (checkForDanger(i-gf-1) === true){
         mineCount+=1;
      };
      if (checkForDanger(i-gf) === true){
         mineCount+=1;
      };
      if (checkForDanger(i-gf+1) === true){
         mineCount+=1;
      };
      if (checkForDanger(i+1) === true){
         mineCount+=1;
      };
    }
  //check the rest
    else{
      if (checkForDanger(i-1) === true){
         mineCount+=1;
      };
      if (checkForDanger(i-gf-1) === true){
         mineCount+=1;
      };
      if (checkForDanger(i-gf) === true){
         mineCount+=1;
      };
      if (checkForDanger(i-gf+1) === true){
         mineCount+=1;
      };
      if (checkForDanger(i+1) === true){
         mineCount+=1;
      };
      if (checkForDanger(i+gf+1) === true){
         mineCount+=1;
      };
      if (checkForDanger(i+gf) === true){
         mineCount+=1;
      };
      if (checkForDanger(i+gf-1) === true){
         mineCount+=1;
      };
    }
    console.log('mineCount for cell ' + i + ": " + mineCount);
  $('#mine-square-'+i).find("div").data('adjacent-mines',mineCount);
}

var checkForDanger = function(num){
  if($('#mine-square-'+num).children().hasClass('danger-square')){
    return true;
  };
  return false;
}

var openAdjacentMines = function(i,gf){
  //check top left corner
  if(i === 0){
      $('#mine-square-' + 1).find("div").trigger("open");
      $('#mine-square-' + gf).find("div").trigger("open");
      $('#mine-square-' + (gf + 1)).find("div").trigger("open");
  }
  //check top right corner
  else if(i === (gf-1)) {
      $('#mine-square-' + (i - 1)).find("div").trigger("open");
      $('#mine-square-' + (i + gf -1)).find("div").trigger("open");
      $('#mine-square-' + (i + gf)).find("div").trigger("open");
  }
  //check bottom left corner
  else if(i === ( gf * (gf - 1) ) ){
      $('#mine-square-' + (i - gf)).find("div").trigger("open");
      $('#mine-square-' + (i - gf + 1)).find("div").trigger("open");
      $('#mine-square-' + (i + 1)).find("div").trigger("open");
  }
  //check bottom right corner
  else if(i === ( (gf * gf) - 1 ) ){
      $('#mine-square-' + (i - 1)).find("div").trigger("open");
      $('#mine-square-' + (i - gf - 1)).find("div").trigger("open");
      $('#mine-square-' + (i - gf)).find("div").trigger("open");
  }
  //check left side
  else if( i % gf === 0){
      $('#mine-square-' + (i - gf)).find("div").trigger("open");
      $('#mine-square-' + (i - gf + 1)).find("div").trigger("open");
      $('#mine-square-' + (i + 1)).find("div").trigger("open");
      $('#mine-square-' + (i + gf + 1)).find("div").trigger("open");
      $('#mine-square-' + (i + gf)).find("div").trigger("open");
  }
  //check right side
  else if( (i + 1) % gf === 0){
      $('#mine-square-' + (i - 1)).find("div").trigger("open");
      $('#mine-square-' + (i - gf - 1)).find("div").trigger("open");
      $('#mine-square-' + (i - gf)).find("div").trigger("open");
      $('#mine-square-' + (i + gf)).find("div").trigger("open");
      $('#mine-square-' + (i + gf - 1)).find("div").trigger("open");
  }
  //check top row
    else if( i > 0 && i< gf){
      $('#mine-square-' + (i - 1)).find("div").trigger("open");
      $('#mine-square-' + (i + 1)).find("div").trigger("open");
      $('#mine-square-' + (i + gf + 1)).find("div").trigger("open");
      $('#mine-square-' + (i + gf)).find("div").trigger("open");
      $('#mine-square-' + (i + gf - 1)).find("div").trigger("open");
    }
  //check bottom row
    else if( i > (gf * (gf-1) ) && i < ((gf*gf)-1)){
      $('#mine-square-' + (i - 1)).find("div").trigger("open");
      $('#mine-square-' + (i - gf - 1)).find("div").trigger("open");
      $('#mine-square-' + (i - gf)).find("div").trigger("open");
      $('#mine-square-' + (i - gf + 1)).find("div").trigger("open");
      $('#mine-square-' + (i + 1)).find("div").trigger("open");
    }
  //check the rest
    else{
      $('#mine-square-' + (i - 1)).find("div").trigger("open");
      $('#mine-square-' + (i - gf - 1)).find("div").trigger("open");
      $('#mine-square-' + (i - gf)).find("div").trigger("open");
      $('#mine-square-' + (i - gf + 1)).find("div").trigger("open");
      $('#mine-square-' + (i + 1)).find("div").trigger("open");
      $('#mine-square-' + (i + gf + 1)).find("div").trigger("open");
      $('#mine-square-' + (i + gf)).find("div").trigger("open");
      $('#mine-square-' + (i + gf -1)).find("div").trigger("open");
    }
}

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


    }

}

