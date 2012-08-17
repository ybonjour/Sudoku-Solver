function Sudoku(){
	var field = [];
	var openCellPositions = [];
	
	this.solve = function (givenField){
		if(!initializeField(givenField)){
			return false;
		}
		return solveBacktracking(0);
	};
		
	this.solution = function(row, column){
		return field[row][column].value;
	};

	function initializeField(givenField){
		var value;
		constructField();
		for(var row=0; row < 9; row++){
			for(var column=0; column < 9; column++){
				value = givenField[row][column];
			  
				if((typeof value !== 'number') || value < 0 || value > 9)  return false;
			  
				if(value !== 0){
					setValue(row, column, value);
				} else {
					openCellPositions.push(new Position(row, column));
				}
			}
		}
		return true;
	}
		
	function solveBacktracking(currentIndex){
		var position;
		var value;
		//If we could assign a number to any open cell position, we have found a solution
		if(currentIndex === openCellPositions.length) return true;
		
		position = openCellPositions[currentIndex];
		
		for(var valueIndex = 0; valueIndex < 9; valueIndex++){
			if(!field[position.row][position.column].values[valueIndex].available()) continue;
			value = valueIndex + 1;
			setValue(position.row, position.column, value);
			if(solveBacktracking(currentIndex+1)){
				return true;
			} else {
				//backtracking
				removeValue(position.row, position.column, value);
			}
		}
		
		return false;
	}
	
	function constructField(){
		var row;
		for(var i=0; i < 9; i++){
			row = [];
			for(var j=0; j < 9; j++){
				row[j] = new Cell();
			}
			field[i] = row;
		}
	}
		
	function calculateBlockStartIndex(index){
		return index - (index % 3);
	}

	function claculateBlockEndIndex(index){
		return index - 1 + (3 - (index%3));
	}

	function setAvailability(row, column, value, availability){
		var valueIndex;
		
		//assert value <= 1
		valueIndex = value -1;
		
		//update cells on same column
		for(var currentRow = 0; currentRow < 9; currentRow++){
			if(currentRow === row) continue;
			
			if(availability){
			  field[currentRow][column].values[valueIndex].makeAvailable();
			} else {
			  field[currentRow][column].values[valueIndex].makeUnvailable();  
			}
		}
		
		//update cells on same row
		for(var currentColumn=0; currentColumn < 9; currentColumn++){
			if(currentColumn === column) continue;
			
			if(availability){
			  field[row][currentColumn].values[valueIndex].makeAvailable();
			} else {
			  field[row][currentColumn].values[valueIndex].makeUnvailable();  
			}
		}
		
		//update cells in same block
		for(var blockRow = calculateBlockStartIndex(row); blockRow <= claculateBlockEndIndex(row); blockRow++){
			for(var blockColumn = calculateBlockStartIndex(column); blockColumn <= claculateBlockEndIndex(column); blockColumn++){
				if(blockRow === row && blockColumn === column) continue;
				
				if(availability){
				  field[blockRow][blockColumn].values[valueIndex].makeAvailable();
				} else {
				  field[blockRow][blockColumn].values[valueIndex].makeUnvailable();  
				}
			}
		}
	}

	//pre: 1 <= value <= 9, 0 <= row <= 8, 0 <= column <= 8
	function setValue(row, column, value){
		field[row][column].value = value;	
		setAvailability(row, column, value, false);
	}

	//pre: 1 <= value <= 9, 0 <= row <= 8, 0 <= column <= 8
	function removeValue(row, column, value){
		field[row][column].value = 0;
		setAvailability(row, column, value, true);
	}
}

function Cell(){
	this.value = 0;

	this.values = [	new Availability(), new Availability(), new Availability(),
					new Availability(), new Availability(), new Availability(),
					new Availability(), new Availability(), new Availability()];
}

function Availability(){
	var availabilityCount = 0;
	this.available = function (){return availabilityCount === 0;};
	this.makeUnvailable = function (){ availabilityCount++ };
	this.makeAvailable = function (){ availabilityCount--; };
}

function Position(row, column){
	this.row = row;
	this.column = column;
}