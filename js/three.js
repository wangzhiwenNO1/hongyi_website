(function(global,factory){
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) : (global = global || self, global.Rotation = factory());
}(this,function(){

    var Rotation =function Rotation(id,option){
        try {
            this.elem = document.getElementById(id);
            this.elem.setAttribute("data",this);
        } catch (error) {
            var error = "鏈壘鍒癷d="+id+"鐨勫厓绱犮€�"
            console.error(error)
            return;
        }
        this.doms = Array.prototype.slice.call(this.elem.children);
        this.doms = this.doms.filter(function(item,index){
            return item.getAttribute("class") !== 'bgBox';
        });
        this.initAngle = (360/this.doms.length).toFixed(2)-0;
        this.computAngle = 0;
        this.radius = option.radius || 200;     //澶у渾鍗婂緞
        this.focusindex = option.focusindex || 1;     //鐒︾偣鍥句綅缃�
        this.focusAngle = this.initAngle * this.focusindex;
        this.speed = option.speed || 1000;     //鏃嬭浆閫熺巼
        this.callback = option.callback;       //鍥炶皟鍑芥暟
        this.turnAngle = 0;     //杞姩瑙掑害
        this.bgBox = document.getElementsByClassName("bgBox")

        this.init();
    };
    Rotation.prototype = {
        isDestroy:false,
        init:function(initType){
            //鍔ㄦ€佹坊鍔犲厓绱犵殑璇濓紝閲嶆柊鍒濆鍖栧拰鍏冪礌鏁伴噺鐩稿叧鐨勫弬鏁�
            if(initType){
                this.computAngle = 0;
                this.doms = Array.prototype.slice.call(this.elem.children);
                this.doms = this.doms.filter(function(item,index){
                    return item.getAttribute("class") !== 'bgBox';
                });
                this.initAngle = (360/this.doms.length).toFixed(2)-0;
                this.focusAngle = this.initAngle * this.focusindex;
            }
            var _this = this;
            this.isDestroy = false;
            //璁剧疆鑳屾櫙妯″潡
            if(this.bgBox){
                this.bgBox[0].style.left = -this.radius+"px";
                this.bgBox[0].style.top = -this.radius+"px";
                this.bgBox[0].style.width = this.radius*2+"px";
                this.bgBox[0].style.height = this.radius*2+"px";
            }
            this.doms.map(function(val,index){

                //濡傛灉鏄姩鎬佹坊鍔犲厓绱犵殑璇濓紝灏嗘瘡涓厓绱犲強鍏跺瓙鍏冪礌鐨勬棆杞搴﹀垵濮嬪寲涓�0
                if(initType){
                    val.style.transform = "rotate(0deg)";
                    //姣忎釜瀛愭ā鍧楀€掕浆
                    val.children[0].style.transform = "rotate(0deg)";
                }
                //鑾峰彇姣忎釜妯″潡鐨勫垵濮嬪寲瑙掑害
                _this.computAngle = _this.computAngle + _this.initAngle;
                //妯″潡鍦ㄨ薄闄愬唴鐨勫疄闄呰搴�
                val.setAttribute("actualAngle",_this.computAngle);
                //淇濆瓨宸叉棆杞搴�
                val.setAttribute("actualRotationAngle",0);
                //淇濆瓨妯″潡鐨勪笅鏍�
                val.setAttribute("index",index);
                //淇濆瓨Rotation瀵硅薄
                val.rotation = _this;
                // val.setAttribute("data",_this);
                //涓烘瘡涓ā鍧楃粦瀹氱偣鍑讳簨浠�
                val.addEventListener("click",_this.selectedMod)
                //涓烘瘡涓ā鍧楄缃棆杞€熺巼
                val.style.transition = "all "+ (_this.speed/1000)+"s";
                val.children[0].style.transition = "all "+ (_this.speed/1000)+"s";
                //涓虹劍鐐瑰浘娣诲姞class
                if(_this.focusindex === index+1){
                    val.className += ' rotation-active';
                }

                //鑾峰彇妯″潡鐨勫楂橈紙妯″潡璁＄畻鍦嗗績鐐瑰拰瀹氫綅鏃堕渶瑕佺敤鍒帮級
                var valH = val.offsetHeight-0,
                    valW = val.offsetWidth-0;

                //鍒濆鍖栧悇涓ā鍧楃殑浣嶇疆锛屼互鍙婂姩鐢诲師鐐�
                if(_this.computAngle>0 && _this.computAngle<90){
                    var sideLength = _this.sideLength(_this.radius,_this.computAngle);
                        val.style.top = -sideLength.oppositeSide - valH/2+"px";
                        val.style.left = sideLength.adjacentSide - valW/2+"px";
                    var origin = "-"+(sideLength.adjacentSide - valW/2)+"px "+(sideLength.oppositeSide + valH/2)+"px";
                        val.style.transformOrigin = origin;
                }else if(_this.computAngle>89 && _this.computAngle<180){
                    var sideLength = _this.sideLength(_this.radius,_this.computAngle-90);
                        val.style.top = sideLength.adjacentSide - valH/2 + "px";
                        val.style.left = sideLength.oppositeSide - valW/2 + "px";
                    var origin = "-" + (sideLength.oppositeSide - valW/2) +"px "+(valH/2 - sideLength.adjacentSide)+"px";
                        val.style.transformOrigin = origin;

                }else if(_this.computAngle>179 && _this.computAngle<270){
                    var sideLength = _this.sideLength(_this.radius,_this.computAngle-180);
                        val.style.top = sideLength.oppositeSide - valH/2+"px";
                        val.style.left = -sideLength.adjacentSide - valW/2+"px";
                    var origin = (sideLength.adjacentSide + valW/2)+"px "+(valH/2 - sideLength.oppositeSide)+"px";
                        val.style.transformOrigin = origin;
                }else{
                    var sideLength = _this.sideLength(_this.radius,_this.computAngle-270);
                        val.style.top = -sideLength.adjacentSide - valH/2+"px";
                        val.style.left = -sideLength.oppositeSide - valW/2+"px";
                    var origin = (sideLength.oppositeSide + valW/2)+"px "+ (sideLength.adjacentSide + valH/2)+"px";
                        val.style.transformOrigin = origin;
                }
            })
        },
        selectedMod:function(index, callback){    //璇ユ柟娉曟槸缁戝畾鍦ㄦ瘡涓棆杞厓绱犱笂鐨勶紝涔熷彲浠ラ€氳繃Rotation瀹炰緥璋冪敤锛屾墍浠his鎸囧悜涓嶇‘瀹氾紝闇€瑕侀€氳繃鍒ゆ柇this鎸囧悜鏉ヤ簺涓嶅悓鐨勯€昏緫

            let thisIndex = null;
            if(!isNaN(index)){
                thisIndex = index;
            }else{
                thisIndex = this.getAttribute("index")-0;
            }

            if(this.rotation){
                this.rotation.activationFun(this,thisIndex);
                this.rotation.callback(this,thisIndex+1);
            }else{
                if(this.isDestroy){
                    return false;
                }
                this.activationFun(this.doms[thisIndex-1],thisIndex-1);
                if(callback){
                    this.callback(this.doms[thisIndex-1],thisIndex)
                }
            }

        },
        sideLength:function(long,angle){
            //鑾峰緱寮у害
            var radian = 2*Math.PI/360*angle;
            return {
                adjacentSide:(Math.sin(radian) * long).toFixed(2)-0,//閭昏竟A
                oppositeSide:(Math.cos(radian) * long).toFixed(2)-0//瀵硅竟B
            };
        },
        activationFun:function(ele,index){

            // this.focusAngle
            _this = this;
            //濡傛灉姝ゆ椂閫変腑鐨勬ā鍧楃殑涓嬫爣鍜岀偣鍑荤殑妯″潡涓嬫爣鐩稿悓锛屽垯涓嶆棆杞�
            if(this.focusindex === index+1){
                return false;
            }
            //灏嗙偣鍑荤殑涓嬫爣璧嬪€肩粰閫変腑鐨勬ā鍧楃殑涓嬫爣
            this.focusindex = index+1;
            //鑾峰彇妯″潡鐨勫疄闄呰搴﹀拰鐒︾偣鍥剧殑瀹為檯瑙掑害
            var actualAngle = ele.getAttribute("actualAngle")-0,
                focusAngle = this.focusAngle,
                rotationAngle = 0;

            //璁＄畻鏃嬭浆瑙掑害
            if(Math.abs(actualAngle-focusAngle)<=180 ){
                rotationAngle = -(actualAngle-focusAngle);
            }else if(actualAngle<focusAngle-180){
                rotationAngle = -(360-focusAngle+actualAngle);
            }else if(actualAngle>focusAngle+180){
                rotationAngle = 360-actualAngle+focusAngle;
            }else if(focusAngle-180<actualAngle && actualAngle<focusAngle){
                rotationAngle = focusAngle-actualAngle;
            }
            _this.turnAngle = rotationAngle;

            this.doms.map(function(val,num){

                //姣忎釜妯″潡鍦ㄥ綋鍓嶈薄闄愬唴鐨勫疄闄呰搴�
                var valActualAngle = val.getAttribute("actualAngle")-0;
                val.setAttribute("actualAngle",_this.calcAngle(valActualAngle + _this.turnAngle));
                //鑾峰彇鏃嬭浆瑙掑害
                var actualRotationAngle = val.getAttribute("actualRotationAngle")-0;

                //鏃嬭浆
                val.style.transform = "rotate("+ (actualRotationAngle + _this.turnAngle) +"deg)";
                //閲嶆柊璁剧疆鏃嬭浆鍚庣殑鏃嬭浆瑙掑害
                val.setAttribute("actualRotationAngle", actualRotationAngle + _this.turnAngle);
                //璁剧疆鏀惧ぇ
                if(num === _this.focusindex-1){
                    val.classList.add("rotation-active");
                }else{
                    val.classList.remove("rotation-active");
                }

                //姣忎釜瀛愭ā鍧楀€掕浆
                val.children[0].style.transform = "rotate("+ -(actualRotationAngle + _this.turnAngle) +"deg)";
            })

        },
        calcAngle:function(ang){
            if(ang>360){
                return ang - 360;
            }else if(ang<0){
                return 360 + ang;
            }else{
                return ang;
            }
        },
        hasClassFun:function( element, cls){
            return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
        },
        destroy:function(clear){

            var _that = this;
            this.isDestroy = true;
            this.doms.map(function(ele,index){
                ele.removeEventListener("click",_that.selectedMod)
            })

            if(!(clear === false)){
                for (var k in this) {
                    delete this[k];
                }
            }
        }
    }

    return Rotation;

}))