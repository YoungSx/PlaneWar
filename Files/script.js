	/*
	
		卡啊啊啊啊啊啊
		卡卡卡卡卡卡啊啊啊啊啊啊啊啊啊啊啊啊啊！！！！！！！！！！！
		杀敌后 子弹不消失问题
	*/
var mycanvas=document.getElementById("mycanvas");
var ctx=mycanvas.getContext('2d');
var image=new Image();
var speed=0,gameOver=0,timeGap=500,sx=0,dy=80,direction=0;;
var lastPos=new Array(0,0,0,0);
var Bullet=new Array(new Array());
var grates=0,x1=100,tmpNum=-1;
image.src="Images/plane.png";
window.addEventListener('deviceorientation', direUpdate, true); //重力传感器 方向

var explosion=document.createElement("audio");
explosion.src="Files/explosion.ogg";
document.getElementById("body").appendChild(explosion);

var shoot=document.createElement("audio");
shoot.src="Files/shoot.ogg";
document.getElementById("body").appendChild(shoot);

function direUpdate(event){
	e=event;
	speed=e.gamma;
}
document.onmousemove =getMousePos;
function getMousePos(event) {              
	var e = event || window.event;              
	x1=e.clientX;
	ctx.clearRect(lastPos[0],lastPos[1],lastPos[2],lastPos[3]);//清除飞机刚才位置留影
	ctx.drawImage(image,sx,167,65,dy,x1,400,65,dy);	
	lastPos=[x1,400,65,dy];
 } 
function move(){
	if(sx==0){
		sx=64;
		dy=70;
	}else{
		sx=0;
		dy=80;
	}
}
function gameOverUI(x,y){
	ctx.clearRect(0,0,mycanvas.width,mycanvas.height);
	grates=0;
	ctx.font="20px Georgia";
	ctx.fillText("游戏结束！",120,250);
	document.getElementById("restart").style.display="inline-block";
}
function restart(){
	gameOver=1;
	ctx.clearRect(0,0,mycanvas.width,mycanvas.height);
	document.getElementById('grates').innerHTML="得分：0";
	gameOver=0;
	Bullet=new Array();
	initialize();
}
function explosionAudio(){
	explosion.play();
}
function shootAudio(){
	shoot.play();
}
function enemyDie(x,y){//////////////////////////////
	ctx.drawImage(image,145,93,37,37,x,y,37,27);//画出爆炸效果
	grates+=100;
	document.getElementById('grates').innerHTML="得分："+grates;
	ctx.clearRect(x-1,y,38,27)
	//setTimeout(function(){ctx.clearRect(x-1,y,38,27)},500);
}
function checkEnemyDie(x,y){
	for(var i=0;i<Bullet.length;i++){
		if(Bullet[i][0]+7>x){
			if(Bullet[i][0]<x+37){
				if(Bullet[i][1]<y+27){
					if(Bullet[i][1]>y){
						enemyDie(x,y);
						tmpNum=i;
						var a=Bullet.splice(i,1);
						console.log("Bullet:("+a[0]+")");
						return i;
						break;
					}
				}
			}
		}
		/*
		if(Bullet[i][0]+7>x && Bullet[i][0]<x+37 && Bullet[i][1]<y+27 && Bullet[i][1]>y){//子弹射中
			enemyDie(x,y);
			tmpNum=i;
			var a=Bullet.splice(i,1);
			console.log("Bullet:("+a[0]+")");
			return i;
			break;
		}
		*/
	}
	return -1;
}
function drawEnemy(x,y){
	if((x+30)>lastPos[0] && x<(lastPos[0]+60) && (y+20)>lastPos[1] && y<lastPos[1]+70){//飞机与敌军碰撞
		ctx.clearRect(x,y,37,27);
		//ctx.drawImage(image,145,93,37,37,x,y,37,37);////////////////////////////画出爆炸效果
		ctx.clearRect(lastPos[0],lastPos[1],lastPos[2],lastPos[3]);
		ctx.drawImage(image,202,42,47,45,lastPos[0]+5,lastPos[1]+5,60,55);
		explosionAudio();
		gameOver=1;
		gameOverUI(x,y);
		return(0);
	};
	if(checkEnemyDie(x,y)!=-1){///////////////////////////////////////////////////////////敌军被子弹打中
		console.log("_(:з」∠)_ ("+x+","+y+")");
		return(0);
	}
	ctx.clearRect(x-1,y,38,27);
	if(gameOver==0)ctx.drawImage(image,202,88,37,27,x,y+5,37,27);
	if(y>=mycanvas.height||gameOver==1)return 1;
	else setTimeout(function(){drawEnemy(x,y+5)},30);
}
function createEnemy(){
	if(gameOver==0){
		drawEnemy(Math.random()*(mycanvas.width-37),0);
		setTimeout(function(){createEnemy()},timeGap);
	}
}
function drawBullet(x,y,i){//画子弹////////////////////要让子弹消失也要改这里
	var bushu=15,jiange=100;
	Bullet[i]=[x,y];
	ctx.clearRect(x-1,y+bushu,9,15);
	//ctx.drawImage(image,113,0,7,15,lastPos[0]+31,lastPos[1]-18,7,15);//子弹
	if(gameOver==0)ctx.drawImage(image,113,3,7,15,x,y,7,15);//子弹
	if(i==tmpNum){
		tmpNum=-1;
		ctx.clearRect(x-1,y,9,15);
		return 0;
	}
	if(y<=-15||gameOver==1){
		Bullet.shift();//删除最前端子弹队列
		return 1;
	}
	else setTimeout(function(){drawBullet(x,y-bushu,i)},jiange);
}
function createBullet(){//创建子弹

	if(gameOver==0){
		Bullet.push([lastPos[0]+31,lastPos[1]-18]);//把子弹坐标压入队列
		drawBullet(lastPos[0]+31,lastPos[1]-18,Bullet.length);
		shootAudio();
		
		setTimeout(function(){createBullet()},550);
	}
}
image.onload=function(){
	ctx.font="20px Georgia";
	ctx.fillText("飞机大战",120,250);
}
function start(){
	ctx.clearRect(0,0,mycanvas.width,mycanvas.height);
	document.getElementById('grates').innerHTML="得分：0";
	initialize();
}
function initialize(){
	var x2=64;
	setInterval(function(){move()},200);
	setInterval(function(){//大飞机的移动
		if(gameOver==1)return 0;
		if(x1<=0){//如果出了左边界
			if(speed<=0)x1=0;//而且手机往左歪 
			else x1+=speed;
		}else if(x1>=mycanvas.width-65){//否则如果出了右边界
			if(speed>0)x1=mycanvas.width-65;//如果手机往右歪
			else x1+=speed;
			}else x1+=speed;
		ctx.clearRect(lastPos[0],lastPos[1],lastPos[2],lastPos[3]);//清除飞机刚才位置留影
		ctx.drawImage(image,sx,167,65,dy,x1,400,65,dy);
		
		lastPos=[x1,400,65,dy];
	},30);
	createBullet();
	createEnemy();
	///////////////////////截取位置    放置位置	
	//ctx.drawImage(image,200,167,65,80,200,450,65,80);//plane1 state1
	//ctx.drawImage(image,64,167,65,70,200,450,65,70);//plane1 state2
}