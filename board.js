PIECES = {
	NOTHING: -1,
	CHECKER_WHITE: 0,
	QUEEN_WHITE: 1,
	KING_WHITE: 2,
	ROOK_WHITE: 3,
	BISHOP_WHITE: 4,
	KNIGHT_WHITE: 5,
	PAWN_WHITE: 6,
	CHECKER_KING_WHITE: 7,
	CHECKER_BLACK: 8,
	QUEEN_BLACK: 9,
	KING_BLACK: 10,
	ROOK_BLACK: 11,
	BISHOP_BLACK: 12,
	KNIGHT_BLACK: 13,
	PAWN_BLACK: 14,
	CHECKERS_KING_BLACK: 15,
}

PIECE_ICONS = {
	'-1': nothing,
	0: checker_white,
	1: queen_white,
	2: king_white,
	3: rook_white,
	4: bishop_white,
	5: knight_white,
	6: pawn_white,
	7: checker_king_white,
	8: checker_black,
	9: queen_black,
	10: king_black,
	11: rook_black,
	12: bishop_black,
	13: knight_black,
	14: pawn_black,
	15: checker_king_black,
}


function Board(width,height,canvas,logDom){
	this.cells = [[]];
	this.width = width;
	this.height = height;
	this.hidden_whites = [];
	this.hidden_blacks = [];
	this.canvas = canvas;
	this.movePiece = -1;
	this.id=0;
	this.moveLog = [];
	this.logDom = logDom
	this.initCells = function(){
		this.cells = [];
		for(var x=0;x<this.width;x++){
			this.cells[x]=[];
			for(var y=0;y<this.height;y++){
				this.cells[x][y]=PIECES.NOTHING;
			}
		}
	}

	this.setMCBoard = function(){
		this.initCells();
		//Fill the top and bottom two rows with checker pieces
		for(var i=0;i<this.width;i++){
			if(!(i%2)){
				this.cells[i][0]=PIECES.CHECKER_WHITE;
				this.cells[i][2]=PIECES.CHECKER_WHITE;
				
				this.cells[i][this.height-2]=PIECES.CHECKER_BLACK;
			}else{
				this.cells[i][1]=PIECES.CHECKER_WHITE;
				this.cells[i][this.height-1]=PIECES.CHECKER_BLACK;
				this.cells[i][this.height-3]=PIECES.CHECKER_BLACK;
			}
		}
		this.hidden_whites = [1,2,3,3,4,4,5,5,6,6,6,6,6,6,6,6];
		this.hidden_blacks = [9,10,11,11,12,12,13,13,14,14,14,14,14,14,14,14];
		this.moveLog=[];
	}

	this.drawCell = function(x,y){
		var canvas = this.canvas;
		var cwidth = canvas.width;
		var cheight = canvas.height;
		var cellWidth = cwidth/this.width;
		var cellHeight = cheight/this.height;
		var top = x*cellWidth;
		var left = y*cellHeight;
		var ctx = canvas.getContext('2d');
		var image = PIECE_ICONS[this.cells[x][y]];
		if(!((y*this.width+x+y)%2)){
			//odd-even tiling for blank squares
			ctx.fillStyle="#404040";
		}else{
			ctx.fillStyle="#A0A0A0";
		}
		ctx.fillRect(top,left,cellWidth,cellHeight);
		if(this.movePiece==x+y*this.width){
			ctx.fillStyle="#0000FF80";
			ctx.fillRect(top,left,cellWidth,cellHeight);
		}
		if(this.mouseCellX==x && this.mouseCellY==y && this.movePiece!=PIECES.NOTHING){
			ctx.fillStyle="#00FF0080";
			ctx.fillRect(top,left,cellWidth,cellHeight);
		}
		ctx.drawImage(image,top,left,cellWidth,cellHeight);
	}

	this.draw = function(){
		var canvas = this.canvas;
		var ctx = canvas.getContext('2d');
		var cwidth = canvas.width;
		var cheight = canvas.height;
		var cellWidth = cwidth/this.width;
		var cellHeight = cheight/this.height;
		ctx.fillStyle="#808080";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		for(var x=0;x<this.width;x++){
			for(var y=0;y<this.height;y++){
				this.drawCell(x,y);
			}
		}
		if(this.moveLog.length){
			var x1 = (this.moveLog[this.moveLog.length-1].from % this.width)*cellWidth+cellWidth/2;
			var y1 = Math.floor(this.moveLog[this.moveLog.length-1].from / this.width)*cellHeight+cellHeight/2;
			var x2 = (this.moveLog[this.moveLog.length-1].to % this.width)*cellWidth+cellWidth/2;
			var y2 = Math.floor(this.moveLog[this.moveLog.length-1].to / this.width)*cellHeight+cellHeight/2;
			var a = Math.atan2(y1-y2,x1-x2);
			ctx.beginPath();
			ctx.moveTo(x1+Math.cos(a+Math.PI/2)*4,y1+Math.sin(a+Math.PI/2)*4);//Arrow base
			ctx.lineTo(x1+Math.cos(a-Math.PI/2)*4,y1+Math.sin(a-Math.PI/2)*4);
			ctx.lineTo(x2+Math.cos(a-Math.PI/2)*4,y2+Math.sin(a-Math.PI/2)*4);//Arrow neck
			ctx.lineTo(x2+Math.cos(a-Math.PI/2)*8,y2+Math.sin(a-Math.PI/2)*8);
			ctx.lineTo(x2+Math.cos(a+Math.PI)*8,y2+Math.sin(a+Math.PI)*8);//Arrow Point
			ctx.lineTo(x2+Math.cos(a+Math.PI/2)*8,y2+Math.sin(a+Math.PI/2)*8);
			ctx.lineTo(x2+Math.cos(a+Math.PI/2)*4,y2+Math.sin(a+Math.PI/2)*4);//Arrow neck
			ctx.lineTo(x1+Math.cos(a+Math.PI/2)*4,y1+Math.sin(a+Math.PI/2)*4);//Close
			ctx.fillStyle="#00A00080";
			ctx.fill();
		}
	}

	this.showMoves = function(){
		this.logDom.innerHTML = "Moves:";
		var cols = ['A','B','C','D','E','F','G','H'];
		for(var i=0;i<this.moveLog.length;i++){
			this.logDom.innerHTML += "<br/>";
			this.logDom.innerHTML += cols[this.moveLog[i].from%this.width];
			this.logDom.innerHTML += 8-Math.floor(this.moveLog[i].from/this.width);
			this.logDom.innerHTML += " to ";
			this.logDom.innerHTML += cols[this.moveLog[i].to%this.width];
			this.logDom.innerHTML += 8-Math.floor(this.moveLog[i].to/this.width);
		}
	}

	this.mouseMove = function(e){
		this.mouseCellX = Math.floor(this.width * e.offsetX/e.target.width);
		this.mouseCellY = Math.floor(this.height * e.offsetY/e.target.height);
		if(this.movePiece!=-1){
			this.draw(e.target);
		}
	}.bind(this);

	this.mouseUp = function(e){
		//not right mouse button
		if(e.button!=2){
			//if the "movePiece" doesn't exist, we're selecting a new one
			if(this.movePiece==-1){
				this.movePiece=this.mouseCellX+this.width*this.mouseCellY;
			}else{
				//make sure it's a legal move
				//TODO: seperate these into their own functions
				if(this.mouseCellX+this.mouseCellY*this.width!=this.movePiece && Math.floor(this.cells[this.mouseCellX][this.mouseCellY]/8)!=Math.floor(this.cells[this.movePiece%this.width][Math.floor(this.movePiece/this.width)]/8)){
					this.cells[this.mouseCellX][this.mouseCellY] = this.cells[this.movePiece%this.width][Math.floor(this.movePiece/this.width)];
					this.cells[this.movePiece%this.width][Math.floor(this.movePiece/this.width)] = PIECES.NOTHING;
					this.moveLog.push({from: this.movePiece, to: this.mouseCellX+this.width*this.mouseCellY});
				}
				this.movePiece=-1;
				this.sendBoardState();
			}
		}else{
			if(this.movePiece==-1){
				if(this.cells[this.mouseCellX][this.mouseCellY] == PIECES.CHECKER_WHITE || this.cells[this.mouseCellX][this.mouseCellY] == PIECES.CHECKER_BLACK){

					if(this.cells[this.mouseCellX][this.mouseCellY] < 8){
						var i = Math.floor(Math.random() * this.hidden_whites.length);
						this.cells[this.mouseCellX][this.mouseCellY] = this.hidden_whites[i];
						console.log(i+" "+this.cells[this.mouseCellX][this.mouseCellY]);
						this.hidden_whites.splice(i,1);
					}else{
						var i = Math.floor(Math.random() * this.hidden_blacks.length);
						this.cells[this.mouseCellX][this.mouseCellY] = this.hidden_blacks[i];
						console.log(i+" "+this.cells[this.mouseCellX][this.mouseCellY]);
						this.hidden_blacks.splice(i,1);
					}
					this.sendBoardState();
				}
			}
		}
		this.draw();
		e.preventDefault();
		return false;
	}.bind(this);

	this.sendBoardState = function(){
		$.post("save.php",{id:this.id, state: JSON.stringify({cells:this.cells,hw:this.hidden_whites,hb:this.hidden_blacks,ml:this.moveLog})});
	}
	this.gbsi = 0;
	this.getBoardState = function(){
		clearTimeout(this.gbsi);
		$.post("get.php",{id:this.id},function(data){
			try{
				var d = JSON.parse(data);
				this.cells = d.cells;
				this.hidden_whites = d.hw;
				this.hidden_blacks = d.hb;
				this.moveLog = d.ml;
				this.draw();
				this.showMoves();
			}catch(ex){

			}
			this.gbsi = setTimeout(this.getBoardState,2000);
		}.bind(this));
	}.bind(this);
}
