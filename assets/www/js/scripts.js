var dimX = 15;
var dimY = 15;
var changeOfLiveCell = .5;
var table;
var cells;
var addCellsCount = dimX * dimY * .4;
var generationDelay = 250;
var gameStarted = false;
var mouseClicking = false;

$(document).ready(function() {
	table = $('#grid');
	disableRightClickMenuForGrid();
	initGame();
	cells = table.find('td');
	placeRandomCells(addCellsCount);
	mouseEventHandler();
	buttonClickHandler();
	initSpeedSlider();
});

function disableRightClickMenuForGrid() {
	$('#grid').on('contextmenu',function(){return false;});
}

function initSpeedSlider() {
	$("#slider").slider({
		value : 45,
		min : 1,
		max : 100,
		step : 5,
		slide : function(event, ui) {
			$("#slider-value").html(ui.value);
			generationDelay = $('#slider').slider('value') *10;
		}
	});
	$("#slider-value").html($('#slider').slider('value'));
}

function mouseEventHandler() {
	$("body").mousedown(function() {
		mouseClicking = true;
	});
	$("body").mouseup(function() {
		mouseClicking = false;
	});
	$("td#cell").mouseup(function() {
		mouseClicking = false;
		mouseButtonClickedHandler(this, event);
	});
	$("td#cell").mousemove(function(event) {
		if (mouseClicking == false)
			return;
		mouseButtonClickedHandler(this, event);
	});
}

function mouseButtonClickedHandler(targetCell, event) {
	switch (event.which) {
	case 1:// left click
    if ($(targetCell).hasClass('alive')){
      death($(targetCell));
    }
    else{
      life($(targetCell));
    }
		break;
	case 2: // middle mouse
		break;
	case 3:// right click
		death($(targetCell));
		break;
	default:// everything else
	}
}

function buttonClickHandler() {
	$('button#startButton').click(function() {
		startButtonHandler();
	});
	$('button#pauseButton').click(function() {
		pauseButtonHandler();
	});
	$('button#clearButton').click(function() {
		clearButtonHandler();
	});
	$('button#populateButton').click(function() {
		placeRandomCells(dimX * dimY * .1);
	});
}

function startButtonHandler() {
	playGame();
}

function pauseButtonHandler() {
	gameStarted = false;
}

function clearButtonHandler() {
	for (var y = 0; y < dimY; y++) {
		for (var x = 0; x < dimX; x++) {
			var cell = getCell(x,y);
			death(cell);
			cell.removeClass('naturalDeath');
		}
	}
	gameStarted = false;
	$("div#generation").html(function(i, val) {
		return 0;
	});
}

function playGame() {
	if (!gameStarted) {
		gameStarted = true;
		playGeneration();
	}
}

function initGame() {
	trHtml = [];
	for (var y = 0; y < dimY; y++) {
		trHtml.push('<tr>');
		for (var x = 0; x < dimX; x++) {
			trHtml.push('<td id="cell">&nbsp;</td>');
		}
		trHtml.push('</tr>');
	}
	trHtml = trHtml.join('');
	table.append($(trHtml));
}

function placeRandomCells(aliveCells) {
	var count = 0;
	while (count < aliveCells) {
		var x = Math.floor(Math.random() * (dimX + 1));
		var y = Math.floor(Math.random() * (dimY + 1));
		if (!isCellAlive(x, y)) {
			getCell(x, y).addClass('alive');
			count++;
		}
	}
}

function playGeneration() {
	if (gameStarted){
		prepareNextGeneration();
		renderNextGeneration();
		setTimeout('playGeneration()', generationDelay);
		$("div#generation").html(function(i, val) {
			return +val + 1;
		});
	}
}

function prepareNextGeneration() {
	for (var y = 0; y < dimY; y++) {
		for (var x = 0; x < dimX; x++) {
			var cell = getCell(x, y);
			var neighbours = getLiveNeighboursCount(x, y);

			cell.attr('isAlive', 'false');
			if (isCellAlive(x, y)) {
				if (neighbours === 2 || neighbours === 3) {
					cell.attr('isAlive', 'true');
				}
			} else if (neighbours === 3) {
				cell.attr('isAlive', 'true');
			}
		}
	}
}

function getLiveNeighboursCount(x, y) {
	var count = 0;
	if (isCellAlive(x, y - 1))
		count++;
	if (isCellAlive(x, y + 1))
		count++;
	if (isCellAlive(x - 1, y + 1))
		count++;
	if (isCellAlive(x - 1, y))
		count++;
	if (isCellAlive(x - 1, y - 1))
		count++;
	if (isCellAlive(x + 1, y + 1))
		count++;
	if (isCellAlive(x + 1, y))
		count++;
	if (isCellAlive(x + 1, y - 1))
		count++;
	return count;
}

function isCellAlive(x, y) {
	return getCell(x, y).attr('class') === 'alive';
}

function renderNextGeneration() {
	cells.each(function() {
		var cell = $(this);
		if (cell.attr('isalive') === 'true') {
			life(cell);
		} else {
			if(cell.attr('class')==='alive')
				cell.addClass('naturalDeath');
			death(cell);
		}
		cell.removeAttr('isalive');
	});
}

function life(cell) {
	cell.removeClass('naturalDeath');
	cell.addClass('alive');
}
function death(cell) {
	cell.removeClass('alive');
}

function getCell(x, y) {
	if (x >= dimX) {
		x = 0;
	}
	if (y >= dimY) {
		y = 0;
	}
	if (x < 0) {
		x = dimX - 1;
	}
	if (y < 0) {
		y = dimY - 1;
	}
	return $(cells[y * dimX + x]);
}