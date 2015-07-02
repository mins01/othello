var Game_othello = function(){
}
Game_othello.prototype={
	 "board":null
	,"tds":[]
	,"turn":null
	,"divTurn":null
	,"history":[]
	,"tB":-1
	,"tW":-1
	,"turnAI":"n" //n:none , b:black , w:white
	,"isPlay":false
	,"history":[]
	,"init":function(board){
		if(!board){alert("잘못된테이블지정"); return false;}
		this.turn = 'b';
		this.divTurn = _M.$id('divTurn');
		this.tds = _M.$tag('td',board);
		this.history = [];
		this.tB=0;
		this.tW=0;
		//board.parentNode.onclick = function(game){
		document.body.onclick = function(game){
			return function(event){
				if(game.boardonclick(event)){
					return false;
				}
				//_M.$id(btnStart).focus();
				return;
			}
		}(this)
		this.startGame();
	}
	,"set_game_othello_AI":function(game_othello_AI,turn){
		this.game_othello_AI = game_othello_AI;
		this.turnAI=turn;
	}
	,"actAI":function(turn){
		if(this.turnAI == turn){
			this.game_othello_AI.act(turn);
		}
	}
	,"startGame":function(){
		this.isPlay = true;
		this.turn = 'b';

		this.setDivTurn(this.turn);
		this.syncScore();
		var tds = this.tds;
		for(var i=0,m=tds.length;i<m;i++){
			tds[i].seq = i;
			tds[i].used = false;
			tds[i].className ='';
			tds[i].stone ='';
			if(debug) tds[i].innerHTML = '<div>'+i+'</div>';
		}
		this.setTbColor(tds[27],'w');
		this.setTbColor(tds[28],'b');
		this.setTbColor(tds[35],'b');
		this.setTbColor(tds[36],'w');
/* 테스트용 초기화위치		
		this.setTbColor(tds[42],'w');
		this.setTbColor(tds[21],'b');
		this.setTbColor(tds[14],'b');
*/
		this.resetHistory();
		this.ableTd(this.turn);
		this.syncScore();
		this.actAI(this.turn);
	}
	,"setDivTurn":function(turn){
		this.divTurn.innerHTML = (turn=='b'?'흑':'백')
		this.divTurn.className = (turn=='b'?'labelBlack':'labelWhite')
		
	}
	,"boardonclick":function(event){
		var evt = _M.EVENT.getEvent(event);
		var td = evt.target;
		if(td.tagName=='DIV'){
			td = td.parentNode;
		}
		if(td.tagName!='TD'){
			return false;
		}
		if(this.isPlay==false){
			alert("게임이 종료되었습니다.");
				return false;
		}
		if(this.turnAI==""){
			this.tdonclick(td);
		}else{
			if(this.turnAI==this.turn){
				alert('AI가 생각중입니다.');
				return false;
			}
			this.tdonclick(td);
		}
		return true;
	}
	,"tdonclick":function(td){
		//alert(td.seq+":"+td.used);
		if(td.used){
			return false;
		}
		if(!this.putTd(td,this.turn)){
			alert((this.turn=='b'?'흑이 ':'백이 ')+'놓을수 없는 위치입니다.');
			return false;
		}else{
			this.turn = this.turn=='b'?'w':'b';
			this.setDivTurn(this.turn);
		}
		this.syncScore();
		if(!this.ableTd(this.turn)){
			this.turn = this.turn=='b'?'w':'b';
			this.setDivTurn(this.turn);
			if(!this.ableTd(this.turn)){
				this.endGame();
			}else{
				alert((this.turn=='b'?'[백]이 ':'[흑]이 ')+'놓을 수 있는 위치가 없습니다. PASS됩니다.');
				this.actAI(this.turn);
			}
		}else{
			this.actAI(this.turn);
		}
		return true;
	}
	,"syncScore":function(){
		var divBScore = _M.$id('divBScore');
		var divWScore = _M.$id('divWScore');
		var tB=0,tW=0;
		for(var i=0,m=this.tds.length;i<m;i++){
			if(this.tds[i].stone =='b'){
				tB++;
			}else if(this.tds[i].stone =='w'){
				tW++;
			}
		}
		this.tB = tB;
		this.tW = tW;
		divBScore.innerHTML = tB;
		divWScore.innerHTML = tW;
	}
	//--- className중 n을 삭제
	,"clearTdsN":function(){
		for(var i=0,m=this.tds.length;i<m;i++){
			if(this.tds[i].stone != ''){
				this.tds[i].className = this.tds[i].stone;
			}
		}
	}
	,"setTbColor":function(td,c){
		if(c==''){
			td.used=false;
			td.className='';
			td.stone='';
		}else if(c=='b' || c=='w'){
			td.used=true;
			td.className=c;
			td.stone=c;
		}
	}
	,"ableTd":function(turn){
		var ableTds = this.ableTds(turn);
		return ableTds.length;
	}
	,"ableTds":function(turn){
		var ableTds = [];
		var tds = this.tds
		for(var i=0,m=tds.length;i<m;i++){
			if(tds[i].used){continue;}
			tds[i].className='';
			//if(this.putTd(tds[i],turn,true)>0){
			if(this.checkTds(tds[i],turn).length>0){
				ableTds.push(tds[i]);
				tds[i].className='c';
			}
		}
		return ableTds;
	}
	,"resetHistory":function(){
		this.history=[];
	}
	,"insertHistory":function(turn,tdsV){
		this.history.push([turn,tdsV]);
	}
	,"backHistory":function(num){
		if(isNaN(num) || num<1 ){
			return false;
		}
		if(this.history.length<=0 || this.history.length-num<0){
			alert("더 이상 되돌릴 수 없습니다");
			return false;
		}
		while(num>0){
			var arr = this.history.pop();
			num--;
		}
		this.turn = arr[0];
		var tdsV = arr[1];
		for(var i=0,m=tdsV.length;i<m;i++){
			this.setTbColor(this.tds[i],tdsV[i]?tdsV[i]:'');
		}
		this.ableTd(this.turn);
		this.setDivTurn(this.turn);
		this.syncScore();
		this.actAI(this.turn);
	}
	,"putTd":function(td,turn,test){
		//-- 히스토리 저장
		this.insertHistory(turn,this.getTdsValue());
		var chTds = this.checkTds(td,turn);
		//-- 돌을 반전
		if(!test){
			if(chTds.length>0){
				this.clearTdsN();
				this.setTbColor(td,turn);
				td.className += " n"
			}
			for(var i=0,m=chTds.length;i<m;i++){
				this.setTbColor(chTds[i],turn);
			}
		}
		return chTds.length;
	}
	,"checkTds":function(td,turn){
		var rtdss = this.getRelTdss(td);
		var rturn = turn=='b'?'w':'b';
		var chTds = [];
		for(var i=0,m=8;i<m;i++){
			var rtds = rtdss[i];
			if(!rtds[0] || rtds[0].stone != rturn){
				continue;
			}
			for(var i2 = 1,m2= rtds.length;i2<m2;i2++){
				if(rtds[i2].used==false){
					break;
				}else if(rtds[i2].stone == turn){
					for(var i3 = i2-1;i3>=0;i3--){
						chTds.push(rtds[i3]);
					}
					break;
				}
			}
		}
		return chTds;
	}
	,"getRelTdss":function(td){
		var rseq = []; //디버깅 힘들어서 분리
		var rtdss = [];
		var ts = [],tss = [];
		var t = null
		var seq = td.seq;
		for(var i=0,m=8;i<m;i++){
			ts = [];
			tss = [];
			seq = td.seq;
			while((t = this.getDirSeq(seq,i))!=null){
				ts.push(t);
				seq = t;
				tss.push(this.tds[t]);
			}
			rseq.push(ts);
			rtdss.push(tss);
		}
		return rtdss;
	}
	,"getDirSeq":function(seq,dir){
		//var seq = td.seq;
		var t0 = seq%8;
		var t1 = -1;
		var rtd = null;
		switch(dir){
			case 0:	t1=seq-8;	break;
			case 1:	if(t0!=7){t1=seq-8+1;}break;
			case 2:	if(t0!=7){t1=seq+1;}break;
			case 3:	if(t0!=7){t1=seq+8+1;}break;
			case 4:	t1=seq+8;break;
			case 5:	if(t0!=0){t1=seq+8-1;}break;
			case 6:	if(t0!=0){t1=seq-1;}break;
			case 7:	if(t0!=0){t1=seq-8-1;}break;
		}
		if(t1<0 || t1>=this.tds.length){
			return null;
		}
		//return this.tds[t1];
		return t1;
	}
	,"getTdsValue":function(){
		var arr = new Array(this.tds.length);
		for(var i=0,m=this.tds.length;i<m;i++){
			if(this.tds[i].stone=='b' 
				|| this.tds[i].stone=='w'){
				arr[i]=this.tds[i].stone;
			}
		}
		return arr;
	}
	,"endGame":function(){
		this.isPlay = false;
		var tB = this.tB;
		var tW = this.tW;
		var gap = tB-tW
		alert('#게임종료#\n더이상 놓을 곳이 없습니다.');
		if(gap>0){
			alert(Math.abs(gap)+"점 차이로 [흑]이 이겼습니다.");
		}else if(gap<0){
			alert(Math.abs(gap)+"점 차이로 [백]이 이겼습니다.");
		}else{
			alert("무승부입니다!");
		}
	}
}//END:game_othello.prototype



