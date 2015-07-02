var Game_othello_AI = function(){
}
Game_othello_AI.posWeightings = {
0:100
,1:2
,2:5
,3:5
,4:5
,5:5
,6:2
,7:100
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
,18:5
,19:5
,20:5
,21:5
,22:5
,23:5
,24:5
,25:5
,26:5
,27:10
,28:10
,29:5
,30:5
,31:5
,32:5
,33:5
,34:5
,35:10
,36:10
,37:5
,38:5
,39:5
,40:5
,41:5
,42:5
,43:5
,44:5
,45:5
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
,56:100
,57:2
,58:5
,59:5
,60:5
,61:5
,62:2
,63:100
}
Game_othello_AI.pos2Weightings = {
0:10
,1:-2
,6:-1
,7:10
,8:-1
,9:-2
,14:-2
,15:-1
,48:-1
,49:-2
,54:-2
,55:-1
,56:10
,57:-1
,62:-1
,63:10
}
Game_othello_AI.prototype={
	 "game_othello":null
	,"AILevel":"6"
	,"timer":null
	,"init":function(game_othello){
		this.game_othello = game_othello;
	}
	,"act":function(turn,delay){
		var tds = this.game_othello.tds;
		var tdsV = this.game_othello.getTdsValue();
		var ableSeqs = this.ableSeqs(turn,tdsV);
		if(this.AILevel=="0"){
			ableSeqs.sort(this.sorfFnLevel0);
		}else if(this.AILevel=="1"){
			ableSeqs.sort(this.sorfFnLevel1);
		}else if(this.AILevel=="2"){
			ableSeqs.sort(this.sorfFnLevel2);
		}else if(this.AILevel=="3"){
			this.sortAbleSeqsLevel3(ableSeqs,tdsV,turn);
		}else if(this.AILevel=="4"){
			this.sortAbleSeqsLevel4(ableSeqs,tdsV,turn);
		}else if(this.AILevel=="5"){
			this.sortAbleSeqsLevel5(ableSeqs,tdsV,turn);
		}else if(this.AILevel=="6"){
			this.sortAbleSeqsLevel6(ableSeqs,tdsV,turn);
		}

		if(delay==undefined) delay = 500
		var fn = function(game_othello,td) {
			return function(){
				game_othello.tdonclick(td);
			}
		}(this.game_othello,tds[ableSeqs[0][0]])
		if(delay==0){
			fn();
		}else{
			if(this.timer != null){
				clearTimeout(this.timer);
			}
			this.timer = setTimeout(fn,delay);
		}
	}
	,"preAct":function(turn,delay){
		var tds = this.game_othello.tds;
		var tdsV = this.game_othello.getTdsValue();
		var ableSeqs = this.ableSeqs(turn,tdsV);
		if(this.AILevel=="0"){
			ableSeqs.sort(this.sorfFnLevel0);
		}else if(this.AILevel=="1"){
			ableSeqs.sort(this.sorfFnLevel1);
		}else if(this.AILevel=="2"){
			ableSeqs.sort(this.sorfFnLevel2);
		}else if(this.AILevel=="3"){
			this.sortAbleSeqsLevel3(ableSeqs,tdsV,turn);
		}else if(this.AILevel=="4"){
			this.sortAbleSeqsLevel4(ableSeqs,tdsV,turn);
		}else if(this.AILevel=="5"){
			this.sortAbleSeqsLevel5(ableSeqs,tdsV,turn);
		}else if(this.AILevel=="6"){
			this.sortAbleSeqsLevel6(ableSeqs,tdsV,turn);
		}

		document.title = "다음:"+ableSeqs[0][0]+"("+ableSeqs[0][2]+")";
	}
	,"ableSeqs":function(turn,tdsV){ //놓을 수 있는 SEQ알기
		var rArr = []; //중요도 배열정보
		var ts = []; //임시 배열
		for(var seq=0,m=tdsV.length;seq<m;seq++){
			if(tdsV[seq]){continue;} //이미 돌이 놓여있다면 스킵
			//--- 해당 칸을 기준으로 가능한지 체크.
			ts = this.checkSeqs(seq,tdsV,turn);
			if(ts.length<=0){
				continue;
			}
			rArr.push([seq,ts]);// seq,뒤집히는위치들
			//--- 가능하면 중요도 정보 배열에 넣기
		}
		return rArr;
	}
	,"checkSeqs":function(seq,tdsV,turn){ //SEQ에 놓았을 때 변화량
		var seqss = this.getRelSeqss(seq);
		var rturn = turn=='b'?'w':'b';
		var chSeqs = [];
		var lineCnt = Math.sqrt(tdsV.length);
		for(var i=0,m=lineCnt;i<m;i++){
			var rseqs = seqss[i];
			if(!tdsV[rseqs[0]] || tdsV[rseqs[0]] != rturn){
				continue;
			}
			for(var i2 = 1,m2= rseqs.length;i2<m2;i2++){
				if(!tdsV[rseqs[i2]]){
					break;
				}else if(tdsV[rseqs[i2]] == turn){
					for(var i3 = i2-1;i3>=0;i3--){
						chSeqs.push(rseqs[i3]); //뒤집어지는 위치
					}
					break;
				}
			}
		}
		return chSeqs;
	}
	,"getRelSeqss":function(seq){ //8반향의 배열 가져옴.
		if(isNaN(seq)){ alert("getRelSeqss 로 잘못된 seq가 입력됨");return }
		var rseq = []; //디버깅 힘들어서 분리
		var ts = [],tss = [];
		var t = null
		var c_seq = seq;
		for(var i=0,m=8;i<m;i++){
			ts = [];
			tss = [];
			c_seq = seq;

			while((t = this.getDirSeq(c_seq,i))!=null){
				ts.push(t);
				c_seq = t;
			}
			rseq.push(ts);
		}
		return rseq;
	}
	,"getDirSeq":function(seq,dir){ //해당 반향의 SEQ알아옴
		return this.game_othello.getDirSeq(seq,dir);
	}
	,"sortAbleSeqsLevel3":function(ableSeqs,tdsV,turn){
		var n_tdsV = null;
		var score = 0;
		var scores = [];
		for(var i=0,m=ableSeqs.length;i<m;i++){
			n_tdsV = this.nextTdsV(ableSeqs[i][0],tdsV,turn);
			score = this.scoreTdsV(n_tdsV,turn)
			scores.push(score);
			ableSeqs[i].push(score); //[2]에 가중치값을 넣음
		}
		ableSeqs.sort(function(a,b){
			var aV = a[2], bV = b[2];
			if(aV==bV){
				return Math.round(Math.random()*10)-5
			}
			return bV-aV;

		});
		return ableSeqs;
	}
	,"sortAbleSeqsLevel4":function(ableSeqs,tdsV,turn){
		var n_tdsV = null;
		var score = 0,seqScore=0,revSeqScore=0;
		var scores = [],revAbleSeqs=[];
		var revTurn = turn=='b'?'w':'b';
		for(var i=0,m=ableSeqs.length;i<m;i++){
			n_tdsV = this.nextTdsV(ableSeqs[i][0],tdsV,turn);
			seqScore = this.scoreSeq(ableSeqs[i][0],tdsV,turn);
			score = this.scoreTdsV(n_tdsV,turn); //자신의 점수

			//--상대의 동작 예측
			revAbleSeqs = this.ableSeqs(revTurn,n_tdsV);
			revSeqScore = 1;
			for(var i2=0,m2=revAbleSeqs.length;i2<m2;i2++){
				if(revAbleSeqs[i2][0] in Game_othello_AI.pos2Weightings
					&& Game_othello_AI.pos2Weightings[revAbleSeqs[i2][0]]>0){
					revSeqScore = score*-1*Game_othello_AI.pos2Weightings[revAbleSeqs[i2][0]];
				}
			}
			
//			document.title=seqScore;
			score *= seqScore;
			score += revSeqScore;
			scores.push(score);
			if(debug)  this.game_othello.tds[ableSeqs[i][0]].innerHTML = '<div>'+score+'</div>'; //디버깅용
			ableSeqs[i].push(score); //[2]에 가중치값을 넣음
		}
		ableSeqs.sort(function(a,b){
			var aV = a[2], bV = b[2];
			if(aV==bV){
				return Math.round(Math.random()*10)-5
			}
			return bV-aV;

		});
		return ableSeqs;
	}
	,"sortAbleSeqsLevel5":function(ableSeqs,tdsV,turn){
		var n_tdsV = null;
		var score = 0,seqScore=0,revSeqScore=0;
		var scores = [],revAbleSeqs=[];
		var revTurn = turn=='b'?'w':'b';
		for(var i=0,m=ableSeqs.length;i<m;i++){
			n_tdsV = this.nextTdsV(ableSeqs[i][0],tdsV,turn);
			seqScore = this.scoreSeq(ableSeqs[i][0],tdsV,turn);
			score = this.scoreTdsV(n_tdsV,turn); //자신의 점수

			//--상대의 동작 예측
			revAbleSeqs = this.ableSeqs(revTurn,n_tdsV);
			revSeqScore = 1;
			for(var i2=0,m2=revAbleSeqs.length;i2<m2;i2++){
				if(revAbleSeqs[i2][0] in Game_othello_AI.pos2Weightings
					&& Game_othello_AI.pos2Weightings[revAbleSeqs[i2][0]]>0){
					revSeqScore = score*-1*Game_othello_AI.pos2Weightings[revAbleSeqs[i2][0]];
				}
			}
			
//			document.title=seqScore;
			score *= seqScore;
			score += revSeqScore;
			scores.push(score);
			if(debug)  this.game_othello.tds[ableSeqs[i][0]].innerHTML = '<div>'+score+'</div>'; //디버깅용
			ableSeqs[i].push(score); //[2]에 가중치값을 넣음
		}
		ableSeqs.sort(function(a,b){
			var aV = a[2], bV = b[2];
			if(aV==bV){
				return Math.round(Math.random()*10)-5
			}
			return bV-aV;

		});
		return ableSeqs;
	}
	//놓는 위치에대한 가중치
	,"scoreSeq":function(seq,tdsV,turn){
		var rTurn = turn=="b"?"w":"b";
		if(seq==0 || seq==56|| seq==7|| seq==63){ //각 꼭지
			return Game_othello_AI.pos2Weightings[seq];
		}
		var seqss = this.getRelSeqss(seq);
		
		if(tdsV[0]==turn){if(seq==1 || seq==8 || seq==9){ return 2;}}
		if(tdsV[7]==turn){if(seq==6 || seq==14 || seq==15){ return 2;}}
		if(tdsV[56]==turn){if(seq==48 || seq==49 || seq==57){ return 2;}}
		if(tdsV[63]==turn){if(seq==54 || seq==55 || seq==62){ return 2;}}
		if(seq==8||seq==48){
			var t = 0;
			for(var i=0,m=seqss[0].length;i<m;i++){
				if(seqss[0][i]==rTurn){t++;}
			}
			for(var i=0,m=seqss[4].length;i<m;i++){
				if(seqss[4][i]==rTurn){t++;}
			}
			if(t==0){ return 1;}
		}
		if(seq==8||seq==48||seq==15||seq==55){
			var t = 0;
			for(var i=0,m=seqss[0].length;i<m;i++){
				if(tdsV[seqss[0][i]]==rTurn){t++;}
			}
			for(var i=0,m=seqss[4].length;i<m;i++){
				if(tdsV[seqss[4][i]]==rTurn){t++;}
			}
			if(t==0){ return 0;}
		}
		if(seq==1||seq==6||seq==57||seq==62){
			var t = 0;
			for(var i=0,m=seqss[2].length;i<m;i++){
				if(tdsV[seqss[2][i]]==rTurn){t++;}
			}
			for(var i=0,m=seqss[6].length;i<m;i++){
				if(tdsV[seqss[6][i]]==rTurn){t++;}
			}
			if(t==0){ return 0;}
		}

		if(seq in Game_othello_AI.pos2Weightings){
			return Game_othello_AI.pos2Weightings[seq];
		}
		return 1;
	}
	//현재 놓여있는 돌의 점수
	,"scoreTdsV":function(tdsV,turn){
		var score = 0;
		for(var i=0,m=tdsV.length;i<m;i++){
			if(tdsV[i]==turn){
				score+=Game_othello_AI.posWeightings[i]
			}
		}
		return score;
	}
	,"nextTdsV":function(seq,tdsV,turn){
		var c_tdsV = tdsV.slice(0);
		var cSeqs = this.checkSeqs(seq,tdsV,turn);
		c_tdsV[seq]=turn;
		for(var i=0,m=cSeqs.length;i<m;i++){
			c_tdsV[cSeqs[i]]=turn;
		}
		return c_tdsV;
	}

	,"sorfFnLevel0":function(a,b){
		return Math.round(Math.random()*10)-5
	}
	,"sorfFnLevel1":function(a,b){
		var wg1 = Game_othello_AI.posWeightings[a[0]];
		var wg2 = Game_othello_AI.posWeightings[b[0]];
		if(wg1==wg2){
			return Math.round(Math.random()*10)-5
		}
		if(wg1 != 0 && wg2 != 0){
			return wg2-wg1;
		}
		return wg2-wg1;
	}
	,"sorfFnLevel2":function(a,b){
		var wg1 = Game_othello_AI.posWeightings[a[0]];
		var wg2 = Game_othello_AI.posWeightings[b[0]];
		var va4 = 0;
		var vb4 = 0;

		for(var i=0,m=a[1].length;i<m;i++){
			va4 += Game_othello_AI.posWeightings[a[1][i]];
		}
		for(var i=0,m=b[1].length;i<m;i++){
			vb4 += Game_othello_AI.posWeightings[b[1][i]];
		}
		var v1 = (wg1+va4)/(a[1].length+1);
		var v2 = (wg2+vb4)/(b[1].length+1);
		if(v1==v2){
			return Math.round(Math.random()*10)-5
		}
		return v2-v1;
	}
	,"sortAbleSeqsLevel6":function(ableSeqs,tdsV,turn){
		var n_tdsV = null;
		var score = 0,seqScore=0,revSeqScore=0;
		var scores = [],revAbleSeqs=[];
		var maxRevSeqScore = 0;
		var revTurn = turn=='b'?'w':'b';
		for(var i=0,m=ableSeqs.length;i<m;i++){
			n_tdsV = this.nextTdsV(ableSeqs[i][0],tdsV,turn); //돌을 놓았을 때 판모양
			seqScore = this.scoreSeq(ableSeqs[i][0],tdsV,turn);
			score = this.scoreTdsV(n_tdsV,turn); //자신의 점수
			maxRevSeqScore = this.getMaxSeqScore(ableSeqs[i][0],tdsV,turn,1); //상대의 놓을 돌 위치의 점수
			seqScore-= maxRevSeqScore;
			//if(maxRevSeqScore>=10){ alert(ableSeqs[i][0]+'일 경우는 회피'); }

			//--상대의 동작 예측
			revAbleSeqs = this.ableSeqs(revTurn,n_tdsV); //생대편이 놓을 수 있는 위치
			revSeqScore = 1;
			for(var i2=0,m2=revAbleSeqs.length;i2<m2;i2++){
				if(revAbleSeqs[i2][0] in Game_othello_AI.pos2Weightings
					&& Game_othello_AI.pos2Weightings[revAbleSeqs[i2][0]]>0){
					revSeqScore = score*-1*Game_othello_AI.pos2Weightings[revAbleSeqs[i2][0]];
				}
			}
			
//			document.title=seqScore;
			score *= seqScore;
			score += revSeqScore;
			scores.push(score);
			if(debug)  this.game_othello.tds[ableSeqs[i][0]].innerHTML = '<div>'+score+'</div>'; //디버깅용
			ableSeqs[i].push(score); //[2]에 가중치값을 넣음
		}
		ableSeqs.sort(function(a,b){
			var aV = a[2], bV = b[2];
			if(aV==bV){
				return Math.round(Math.random()*10)-5
			}
			return bV-aV;

		});
		return ableSeqs;
	}
	,"getMaxSeqScore":function(seq,tdsV,turn,cnt){
		var n_tdsV = this.nextTdsV(seq,tdsV,turn); //돌을 놓았을 때 판모양
		var revTurn = turn=='b'?'w':'b';
		var ableSeqs = this.ableSeqs(revTurn,n_tdsV); //생대편이 놓을 수 있는 위치
		
		var maxRevSeqScore = -10;
		for(var i=0,m=ableSeqs.length;i<m;i++){
			var t = Game_othello_AI.pos2Weightings[ableSeqs[i][0]];
			t = t?t:0;
			maxRevSeqScore = Math.max(maxRevSeqScore,t); //위치 가중치중 최대값을 구한다.
			if(cnt>0){
				cnt--;
				n_tdsV  = this.nextTdsV(ableSeqs[i][0],n_tdsV,revTurn); //상대가 돌을 놓았을 때 판모양
				var ableSeqs2 = this.ableSeqs(turn,n_tdsV); //생대편이 놓을 수 있는 위치
				for(var i2=0,m2=ableSeqs2.length;i2<m2;i2++){
					var t = this.getMaxSeqScore(seq,n_tdsV,turn,cnt);
					maxRevSeqScore = Math.max(maxRevSeqScore,t);
				}
				
			}
		}
		return maxRevSeqScore;
	}
}