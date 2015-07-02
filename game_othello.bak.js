var Game_othello = function(){
}
Game_othello.prototype={
	 "board":null
	,"tds":[]
	,"turn":null
	,"divTrun":null
	,"history":[]
	,"tB":-1
	,"tW":-1
	,"turnAI":"n" //n:none , b:black , w:white
	,"init":function(board){
		if(!board){alert("잘못된테이블지정"); return false;}
		this.turn = 'b';
		this.divTrun = _M.$id('divTrun');
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
		this.turn = 'b';
		this.setDivTurn(this.turn);
		this.syncScore();
		var tds = this.tds;
		for(var i=0,m=tds.length;i<m;i++){
			tds[i].seq = i;
			tds[i].used = false;
			tds[i].className ='';
			//tds[i].innerHTML = '<div>'+i+'</div>';
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
		
		this.ableTd(this.turn);
		this.syncScore();
		this.actAI(this.turn);
	}
	,"setDivTurn":function(turn){
		this.divTrun.innerHTML = (turn=='b'?'흑':'백')
		this.divTrun.className = (turn=='b'?'labelBlack':'labelWhite')
		
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
			if(this.tds[i].className =='b'){
				tB++;
			}else if(this.tds[i].className =='w'){
				tW++;
			}
		}
		this.tB = tB;
		this.tW = tW;
		divBScore.innerHTML = tB;
		divWScore.innerHTML = tW;

	}
	,"setTbColor":function(td,c){
		this.history.push([td,c]);
		if(c==''){
			td.used=false;
			td.className='';
		}else if(c=='b' || c=='w'){
			td.used=true;
			td.className=c;			
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
	,"putTd":function(td,turn,test){
		var chTds = this.checkTds(td,turn);
		//-- 돌을 반전
		if(!test){
			if(chTds.length>0){
				this.setTbColor(td,turn);
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
			if(!rtds[0] || rtds[0].className != rturn){
				continue;
			}
			for(var i2 = 1,m2= rtds.length;i2<m2;i2++){
				if(rtds[i2].used==false){
					break;
				}else if(rtds[i2].className == turn){
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
	,"endGame":function(){
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



var Game_othello_AI = function(){
}
Game_othello_AI.posWeightings = {
0:10
,1:2
,2:5
,3:5
,4:5
,5:5
,6:2
,7:10
,8:2
,9:1
,10:5
,11:5
,12:5
,13:5
,14:1
,15:2
,16:5
,17:5
,18:8
,19:8
,20:8
,21:8
,22:5
,23:5
,24:5
,25:5
,26:8
,27:8
,28:8
,29:8
,30:5
,31:5
,32:5
,33:5
,34:8
,35:8
,36:8
,37:8
,38:5
,39:5
,40:5
,41:5
,42:8
,43:8
,44:8
,45:8
,46:5
,47:5
,48:2
,49:1
,50:5
,51:5
,52:5
,53:5
,54:1
,55:2
,56:10
,57:2
,58:5
,59:5
,60:5
,61:5
,62:2
,63:10
}
Game_othello_AI.prototype={
	 "game_othello":null
	,"AILevel":"2"
	,"init":function(game_othello){
		this.game_othello = game_othello;
	}
	,"act":function(turn,delay){
		var ableTds = this.ableTds(turn);
		if(delay==undefined) delay = 500
		var fn = function(game_othello,td) {
			return function(){
				game_othello.tdonclick(td);
			}
		}(this.game_othello,ableTds[0][0])
		//alert("위치:"+ableTds[0][2]+" , 가중치"+ableTds[0][3]+" , 뒤집힐갯수"+ableTds[0][1]);
		setTimeout(fn,delay);
	}
	,"ableTds":function(turn){
		var game_othello = this.game_othello
		var ableTds = [];
		var ts = [];
		var tds = game_othello.tds
		for(var i=0,m=tds.length;i<m;i++){
			t = 0;
			if(tds[i].used){continue;}
			tds[i].className='';
			ts = game_othello.checkTds(tds[i],turn);
			t = ts.length;
			if(t>0){
				ableTds.push([tds[i],t,tds[i].seq,Game_othello_AI.posWeightings[tds[i].seq],ts]);
				//td,뒤집힐갯수,위치번호,가중치,뒤집힐위치
			}
		}
		if(this.AILevel=="0"){
			ableTds.sort(this.sorfFnLevel0);
		}else if(this.AILevel=="1"){
			ableTds.sort(this.sorfFnLevel1);
		}else if(this.AILevel=="2"){
			ableTds.sort(this.sorfFnLevel2);
		}
		return ableTds;
	}
	,"sorfFnLevel0":function(a,b){
		if(a[1]==b[1]){
			return Math.round(Math.random()*10)-5
		}
		return b[1]-a[1];
	}
	,"sorfFnLevel1":function(a,b){
		var wg1 = Game_othello_AI.posWeightings[a[0].seq];
		var wg2 = Game_othello_AI.posWeightings[b[0].seq];
		if(wg1 != 0 && wg2 != 0){
			return wg2-wg1;
		}
		if(a[1]==b[1]){
			return Math.round(Math.random()*10)-5
		}
		return b[1]-a[1];
	}
	,"sorfFnLevel2":function(a,b){
		var wg1 = Game_othello_AI.posWeightings[a[0].seq];
		var wg2 = Game_othello_AI.posWeightings[b[0].seq];
		var va4 = 0;
		var vb4 = 0;
		for(var i=0,m=a[4].length;i<m;i++){
			va4 += Game_othello_AI.posWeightings[a[4][i].seq];
		}
		for(var i=0,m=b[4].length;i<m;i++){
			vb4 += Game_othello_AI.posWeightings[b[4][i].seq];
		}
		var v1 = (wg1+va4)/(a[1]+1);
		var v2 = (wg2+vb4)/(b[1]+1);
		if(v1==v2){
			return Math.round(Math.random()*10)-5
		}
		return v2-v1;
	}
}


