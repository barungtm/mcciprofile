/*
    Rvolve Zoom Pics
    
    Copyright (C) 2011 Rvolve  Ver 3.01

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.  The only exception to this
    license is the Rvolve 'zoompic' logo must remain visible, and clickable.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see http://www.gnu.org/licenses/.



New Version Usage:
	Header:
	<script src="http://code.jquery.com/jquery-1.6.2.min.js"></script>
	<script src="http://rvolve.com/js/zoom-pic-3.0.js" type="text/javascript"></script>
	<!--[if IE]><script src="http://rvolve.com/js/excanvas.compiled.js"></script><![endif]-->
	
	

	In body:
	<div id="my_zoom1" class="zoompic" data-src="images/city1.jpg"
            data-animate="true" data-width="200" data-height="150" data-autopan="true" data-autozoom="false"></div>

	
For assistance:
	webmaster AT rvolve.com
	
Known issues:
	- touch click on an href not functioning
	- after zooming in with mouse wheel, clicking doesn't work
*/


function scaleImage(canvasWidth, canvasHeight, imageWidth, imageHeight, zoom, alreadyRvolveLogo, rvolveHorizontalPoint, rvolveVerticalPoint)
{
	var outputX = 0;
	var outputY = 0;
	var outputWidth = 1;
	var outputHeight = 1;
	
	
	
	
	//Scale up
	var ratioImage = imageWidth / imageHeight;
	var ratioCanvas = canvasWidth / canvasHeight;

	if(ratioImage >= 1) {
		if(ratioCanvas >= ratioImage) {
			var scale = canvasWidth / imageWidth;
		} else {
			var scale = canvasHeight / imageHeight;
		}
	} else {
		if(ratioCanvas >= ratioImage) {
			var scale = canvasWidth / imageWidth;
		} else {
			var scale = canvasHeight / imageHeight;
		}
	}
	
	scale = scale * zoom;
	outputWidth = imageWidth * scale;
	outputHeight = imageHeight * scale;

	
	if(outputHeight > canvasHeight) {
		outputY = - ((imageHeight * scale) * rvolveVerticalPoint) + (canvasHeight * rvolveVerticalPoint);
	}

	if(outputWidth > canvasWidth) {
		outputX = - ((imageWidth * scale) * rvolveHorizontalPoint) + (canvasWidth * rvolveHorizontalPoint);
	}

	
	return [outputX, outputY, outputWidth, outputHeight, scale];


}

var rvolveHasFocus = true;
var stopAllAnimations = false;
var zp = new Image();
var rvolveLogoWidth = 70;
var rvolveLogoHeight = 28;
var rvolvePath = '';
var rvolveStart = 0;
var rvolveCanvasHeight = 200;
var rvolveCanvasWidth = 200;
var rvolveVerticalPoint = 0.5;
var rvolveHorizontalPoint = 0.5;
var rvolveFileType = ".jpg";	
var rvolveCm = false;
var initVector =  1.0/ 80;	 
var setOff = false;
var zoomTooBlurry = 1.7;


function animate(context, cat, canvasWidth, canvasHeight, catWidth, catHeight, zoom, zoomVector, which, pixelation, parent, alreadyRvolveLogo)
{	
	
	var newZoom = zoom;
	if(rvolveHasFocus == true) {		//Just ensure we are actually on the window before animating

		context.clearRect(0, 0, canvasWidth, canvasHeight);

	
		
		
		var outputImage = parent.scaleImage(canvasWidth, canvasHeight, catWidth, catHeight, zoom, alreadyRvolveLogo, parent.xZoomInto[which], parent.yZoomInto[which]);
		context.drawImage(cat, outputImage[0], outputImage[1], outputImage[2], outputImage[3]);
			
			//Show the copyright
		if(rvolveCm == false) {
			context.drawImage(parent.rvicon[which], canvasWidth - rvolveLogoWidth - 2, canvasHeight - rvolveLogoHeight - 2);
		}
			
			
		
			
		if(parent.autoPan[which] == 'true') {
	
	
			var accelerateX;
			var accelerateY;
			var massX = 0.000025;
			var massY = 0.000025;
			var ratioX = (catWidth/canvasWidth);
			var ratioY = (catHeight/canvasHeight);
			if(ratioX > 4) massX /= 4;	//Slow down the really wide ads horizontally
			if(ratioY > 4) massY /= 4;	//Slow down the really tall ads vertically
			var distFromEdge = 0.000001;
	
			//Hit boundaries - bounce back the other way
			if(parent.xZoomInto[which] > 0.99) {
				//alert('hit x boundary');
				parent.xZoomInto[which] = 0.99;
			}
			if(parent.xZoomInto[which] < 0.01) {
				parent.xZoomInto[which] = 0.01;
			}
			if(parent.yZoomInto[which] > 0.99) {
				parent.yZoomInto[which] = 0.99;
			}
			if(parent.yZoomInto[which] < 0.01) {
				parent.yZoomInto[which] = 0.01;
			}
	
			var forceFromLeftEdge = 1/(parent.xZoomInto[which]);
			var forceFromRightEdge = - 1/(1-(parent.xZoomInto[which]));
			accelerateX = (forceFromLeftEdge + forceFromRightEdge) * massX;
	
	
			var forceFromTopEdge = 1/(parent.yZoomInto[which]);
			var forceFromBottomEdge = - 1/(1-(parent.yZoomInto[which]));
			accelerateY = (forceFromTopEdge + forceFromBottomEdge) * massY;
	
	
			if(parent.mouseOverThis != which) {
						
				parent.xVector[which] += accelerateX;
				parent.yVector[which] += accelerateY;
		
				if(parent.xZoomInto[which] > 0.99) {
					parent.xZoomInto[which] = 0.99;
				}
				if(parent.xZoomInto[which] < 0.01) {
					parent.xZoomInto[which] = 0.01;
				}
				if(parent.yZoomInto[which] > 0.99) {
					parent.yZoomInto[which] = 0.99;
				}
				if(parent.yZoomInto[which] < 0.01) {
					parent.yZoomInto[which] = 0.01;
				}
		
		
		
				parent.xZoomInto[which] += (parent.xVector[which] / (zoom*2)); 
				parent.yZoomInto[which] += (parent.yVector[which] / (zoom*2));
	
		
	
			} else {
				parent.xVector[which] = initVector;
				parent.yVector[which] = initVector;	//Pause acceleration if over this block
			}
	
	
	
	
	
		}
	
		
	
		if(parent.zoomNow[which] == 'true') {		
			if(pixelation < 1.7) {
				if(parent.pauseZoomedOut[which] <= 0) {
	
					var newZoom = zoom + (zoomVector * parent.mousedown[which]);
					if(newZoom >= 3) {
						
						zoomVector = - 0.0104;//0.0075;
						
						//var myCanvasAlready = document.getElementById('rvimg_' + which);
						// = myCanvasAlready
						//alert('about to cancel');
						
						
						parent.myCanvas[which].style.cursor = parent.cursorZoomOut[which];					
						parent.pauseZoomedOut[which] = Math.floor(50 / parent.mousedown[which]);
					}
					if(newZoom <= 1) {
						zoomVector = 0.0104;//0.0075;
						newZoom = 1;	//cap it
						//Zoomed out to max - wait for 100 frames
						parent.myCanvas[which].style.cursor = parent.cursorZoomIn[which];
						parent.pauseZoomedOut[which] = Math.floor(50 / parent.mousedown[which]);
;//100;
						//alert(parent.pauseZoomedOut[which]);
						
				
					}
				} else {
					//Count down to zero again
					parent.pauseZoomedOut[which] --;
					
					//var myCanvasAlready = document.getElementById('rvimg_' + which);
					
				}
			}
		}
			
		
		
		parent.newZoom[which] = newZoom;
		parent.zoomVector[which] = zoomVector;
		//A normal next frame
	}
	


}



//Check to see if our window has focus at the moment
function onBlur() {
    rvolveHasFocus = false;
}
function onFocus(){
    rvolveHasFocus = true;
}

if (/*@cc_on!@*/false) { // check for Internet Explorer
    document.onfocusin = onFocus;
    document.onfocusout = onBlur;
} else {
    window.onfocus = onFocus;
    window.onblur = onBlur;
}




function getInternetExplorerVersion()
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
{
  var rv = -1; // Return value assumes failure.
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  return rv;
}

//http://mghtb.com/2011/05/27/detecting-ie9s-document-mode-using-javascript/
function isIE9Std() {
  var a;
  try{var b=arguments.caller.length;a=0;}catch(e){a=1;}
  return((document.all&&a)==1);
}


var iePre9 = false;

var ver = getInternetExplorerVersion();

if( ver > -1) {
	//var stndMode = isIE9Std(); 
	//alert(document.documentMode);
	if((typeof(document.documentMode) === 'undefined')||(document.documentMode < 9)) {
		iePre9 = true;
	}
	
}



function cancelEvent(e) {
    if (!e) e = window.event;
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
}





		//Wait for us to be defined
function setImages(cnt, id, myImage, linkUrl, animateMe, isRvolveLogoIncoming) {
	
	
	
	
	if (!document.getElementById('rvimg_' + cnt)) {
		var timeout = 'this.setImages(' + cnt + ',  "' + myImage + '",  "' + linkUrl + '",' + animateMe  + ',' + isRvolveLogo + ')';  
		setTimeout(timeout, 150);
	} else {
	
		
		
			 
		var canvas = document.getElementById('rvimg_' + cnt);
		if(iePre9 == true) {
			//Because the element is created dynamically we need to init if using js library
			if(typeof(G_vmlCanvasManager.initElement)  === 'undefined') { 
				//Bit of a hack - wait until the object becomes available
				var timeout = 'setImages(' + cnt + ',  "' + myImage + '",  "' + linkUrl + '",' + animateMe  + ',' + isRvolveLogo + ')';  
				setTimeout(timeout, 100);
				
			} else {
				
				
				G_vmlCanvasManager.initElement(canvas);
					
			}
		}
		
		
		
		
		var context = canvas.getContext('2d');
		var cat = new Image();
		
		this.rvlogo = new Image();
		
		var parent = this;
		parent.context[cnt] = context;	
		
		parent.cat[cnt] = cat;			//iepre9
		
		
		var alreadyRvolveLogo = false;
		var isRvolveLogo = isRvolveLogoIncoming;
		if(isRvolveLogo == true) {
			parent.yZoomInto[cnt] = 0.5;	//change the zoom to center if we're a logo
		}
		
		cat.onerror = function() {
			alreadyRvolveLogo = true;	//now don't need to run the change again
			isRvolveLogo = true;		//actually is the logo
			parent.yZoomInto[cnt] = 0.5;		//Make sure we zoom into middle of my logo
			myImage = parent.defaultImage;
			cat.src = myImage;	//Will rerun this onload
	
		}	
		
		
				
		cat.onload = function(){
			var outputImage = parent.scaleImage(canvas.width, canvas.height, cat.width, cat.height, 1, isRvolveLogo, parent.xZoomInto[cnt], parent.yZoomInto[cnt]);
			if(outputImage[4] >  2.2) {
				//A blurred image will be replaced with the Rvolve logo
				myImage = "http://rvolve.com/images/rvolve_large_zoompic.jpg";
				cat.src = myImage;	//Will rerun this onload
				
				
				alreadyRvolveLogo = true;		//ensure doesn't come in here again
				isRvolveLogo = true;			//actually is a rvolve logo
				parent.yZoomInto[cnt] = 0.5;		//Make sure we zoom into middle of my logo
				myImage = parent.defaultImage;  
				cat.src = myImage;	//Will rerun this onload
						
			} else {
				
				context.drawImage(cat, outputImage[0], outputImage[1], outputImage[2], outputImage[3]);
				
				if(rvolveCm == false) {
					/*zp.src = 'http://rvolve.com/images/rvolve_zoompic.png';
					zp.onload = function() {
						//No need to load for regular images: context.drawImage(zp, canvas.width - rvolveLogoWidth - 2, canvas.height - rvolveLogoHeight - 2);
					}*/
					
					parent.rvicon[cnt] = new Image();
					parent.rvicon[cnt].onload = function() {
			
						if((animateMe == 'true')&&(outputImage[4] < zoomTooBlurry)) {
							parent.context[cnt].drawImage(parent.rvicon[cnt], canvas.width - rvolveLogoWidth - 2, canvas.height - rvolveLogoHeight - 2);
						}
						
			
						//alert(cnt);
					}	
					parent.rvicon[cnt].src = 'http://rvolve.com/images/rvolve_zoompic.png';
				}

				
				parent.newZoom[cnt] = 1;
				
				
				parent.determineCursorType(cnt, outputImage[4], canvas);
				canvas.style.cursor = parent.cursorZoomIn[cnt];  //zoom cursor
				if(parent.imageFinished != false) {
					parent.imageFinished();  //call optional external function to know loading is finished
				}
				
				
				if((iePre9 == false)&&(outputImage[4] < zoomTooBlurry)) {		//Cut off for blurred images from animating
					
					if(animateMe == 'true') {
		
						parent.zoomVector[cnt] = 0.0104;//0.0075
						//alert(parent.animate);	
							
						parent.interval[cnt] = setInterval(function(){parent.animate(context, cat, canvas.width, canvas.height, cat.width, cat.height, parent.newZoom[cnt], parent.zoomVector[cnt], cnt, outputImage[4], parent, isRvolveLogo)}, 41.6);
						
					}
				} else {
					if(outputImage[4] < zoomTooBlurry) {
						parent.zoomVector[cnt] = 0.5;//click at a time
					} else {
						parent.zoomVector[cnt] = 0;	//too blurry
					} 
				}
				
			}
		}
		cat.src = myImage;
		
		
		
	}
	
	
	
}

function listImages(imgCnt)
{

 	for(cnt = 0; cnt< imgCnt; cnt++) {
		setImages(cnt, rvolvePath + (rvolveStart+cnt) + rvolveFileType, '#');
	}
			

}


function getElementPosition(theElement){

  var posX = 0;
  var posY = 0;
	      
  while(theElement != null){
    posX += theElement.offsetLeft;
    posY += theElement.offsetTop;
    theElement = theElement.offsetParent;
  }
		        		      
   return {x:posX,y: posY};

}


function processOnFocus(event, uId) {
	//$('#' + uId).blur();	//Stop border showing

}

function processClick(event, mycanvas, uId, url) {
    event = event || window.event;
	    	
    var canvas =document.getElementById(mycanvas);
	pos = getElementPosition(canvas);
	if (event.pageX == undefined) {
		var scrollTop = document.documentElement ? document.documentElement.scrollTop :
                                           document.body.scrollTop;
    		var pageX = event.clientX + document.body.scrollLeft;
    		var pageY = event.clientY + scrollTop;
  	} else {
		var pageX = event.pageX;		
		var pageY = event.pageY;
	}
	
	x = pageX - pos.x;
	y = pageY - pos.y;
	 
	
	if((x> (canvas.width - rvolveLogoWidth)) &&
		(y > (canvas.height - rvolveLogoHeight))&&
		($(canvas.parentNode).attr("data-animate") == 'true')
		) {
		
		//Go to our page, and override any a href above it
		if((rvolveCm == false)) {
			if(typeof(canvas.parentNode.parentNode.attributes['href']) !== 'undefined') {
				canvas.parentNode.parentNode.attributes['href'].value = 'http://rvolve.com/developer.php#zoompic';
			}
			window.location = 'http://rvolve.com/developer.php#zoompic';
		}
		 
		return false;
	} else {
		if(typeof(canvas.parentNode.parentNode.attributes['href']) === 'undefined') {
			//Fallback is going to the image itself - if there is no a href from user surrounding div
			if(iePre9 == true) {
				//window.location = url;
				//Zoom right in
				//this.zoomNow[uId] = 'true';
				this.newZoom[uId] = this.newZoom[uId] + this.zoomVector[uId];
				if(this.newZoom[uId] >= 3) {
						
					this.zoomVector[uId] = - 0.5;
					
					this.myCanvas[uId].style.cursor = this.cursorZoomOut[uId];
				}
				
				if(this.newZoom[uId] <= 1) {
					this.zoomVector[uId] = 0.5;
					this.myCanvas[uId].style.cursor = this.cursorZoomIn[uId];
				}
				this.repositionImage(x,y,canvas.width, canvas.height,uId);
				this.animate(this.context[uId], this.cat[uId], canvas.width, canvas.height, this.cat[uId].width, this.cat[uId].height, this.newZoom[uId], this.zoomVector[uId], uId, 1, this, false);
				
				
			} else {
				//Change that to zoom in
				//alert(uId);
			
				//var newZoom = this.newZoom[uId] + 0.5;
				//if(newZoom > 4) newZoom = 4;
				//if(newZoom < 1) newZoom = 1;
				//this.newZoom[uId] = newZoom;
			}
			return false;
		}
	}
}


function determineCursorType(uId, scale, mycanvas)
{

	//Handle different kinds of browser cursors
	var zoomIn = "url('data:text/plain;base64,AAACAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAEAAAAAAAAAAAAAAA/v7+AB8eHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAACIgAAAAAAAAAAAAAAAAAAIiAAAAAAAAAAAAAAAAAAAiIAAAAAAAAAAAAAACIiACIgAAAAAAAAAAAAACIRESIiAAAAAAAAAAAAAAIRERERIAAAAAAAAAAAAAACERIhESAAAAAAAAAAAAAAIRESIRESAAAAAAAAAAAAACESIiIhEgAAAAAAAAAAAAAhEiIiIRIAAAAAAAAAAAAAIRESIRESAAAAAAAAAAAAAAIREiERIAAAAAAAAAAAAAACERERESAAAAAAAAAAAAAAACIRESIAAAAAAAAAAAAAAAAAIiIAAAAAAAAAAAAAAAD///////////////////////////////////////////////////////////////////////////////////////3////4////8f///+P///DH///AD///gB///4Af//8AD///AA///wAP//8AD///gB///4Af///AP///8P///w%3D%3D'), n-resize";
	var zoomOut = "url('data:text/plain;base64,AAACAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAEAAAAAAAAAAAAAAA/v7+AB8eHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAACIgAAAAAAAAAAAAAAAAAAIiAAAAAAAAAAAAAAAAAAAiIAAAAAAAAAAAAAACIiACIgAAAAAAAAAAAAACIRESIiAAAAAAAAAAAAAAIRERERIAAAAAAAAAAAAAACERERESAAAAAAAAAAAAAAIRERERESAAAAAAAAAAAAACESIiIhEgAAAAAAAAAAAAAhEiIiIRIAAAAAAAAAAAAAIRERERESAAAAAAAAAAAAAAIRERERIAAAAAAAAAAAAAACERERESAAAAAAAAAAAAAAACIRESIAAAAAAAAAAAAAAAAAIiIAAAAAAAAAAAAAAAD///////////////////////////////////////////////////////////////////////////////////////3////4////8f///+P///DH///AD///gB///4Af//8AD///AA///wAP//8AD///gB///4Af///AP///8P///w%3D%3D'), s-resize";	
		
			
	if (jQuery.browser.mozilla) {
		this.cursorZoomIn[uId] = '-moz-zoom-in';
		this.cursorZoomOut[uId] = '-moz-zoom-out';
		
   		
	}
	else if (jQuery.browser.safari) {
		
		this.cursorZoomIn[uId] = '-webkit-zoom-in';
		this.cursorZoomOut[uId] = '-webkit-zoom-out';	
	}
	else {
		//this.cursorZoomIn[uId] = zoomIn;
		//this.cursorZoomOut[uId] = zoomOut;
	
		this.cursorZoomIn[uId] = "url('http://rvolve.com/images/magnify_plus.cur'), n-resize";
		this.cursorZoomOut[uId] = "url('http://rvolve.com/images/magnify_minus.cur'), s-resize";
	      //this.cursorZoomIn[uId] = 'n-resize';
	      //this.cursorZoomOut[uId] = 's-resize';	
	}
	
	if(iePre9 == true) {
		
		//this.cursorZoomIn[uId] = zoomIn;
		//this.cursorZoomOut[uId] = zoomOut;
		
	      this.cursorZoomIn[uId] = "url('http://rvolve.com/images/magnify_plus.cur'), n-resize";
	      this.cursorZoomOut[uId] = "url('http://rvolve.com/images/magnify_minus.cur'), s-resize";

	      //this.cursorZoomIn[uId] = 'n-resize';		//Block zooming possible
	      //this.cursorZoomOut[uId] = 's-resize';
	}
	
	if((scale > zoomTooBlurry)||(this.animateOption[uId] == 'false')) {		//No zooming if image is coarse
		this.cursorZoomIn[uId] = "default";
		this.cursorZoomOut[uId] = "default";
	
	}
	
	if(typeof(mycanvas.parentNode.parentNode.attributes['href']) !== 'undefined') {
		//If an href surrounding canvas, override the cursor over to be a pointer
	      this.cursorZoomIn[uId] = 'pointer';
	      this.cursorZoomOut[uId] = 'pointer';	
	} 


}

function createCanvas(uId, id, width, height, url, borderCol)
{
	
	
	if ((!document.getElementById(id))) {
		
		setTimeout('createCanvas(' + uId + ',"' + id +'",' + width +',' +height+ ',"' + url + '","' + borderCol + '")', 50);
		
	} else {
		if(iePre9 == true) {
			if(typeof(G_vmlCanvasManager)  === 'undefined') {
				setTimeout('createCanvas(' + uId + ',"' + id +'",'  + width +',' +height+ ',"' + url + '","' + borderCol + '")', 50);
				
			} 	
		}
		var mycanvas = document.getElementById(id);
		var myCanvasAlready = document.getElementById('rvimg_' + uId);
		if(!myCanvasAlready) {		//make sure we don't double up on the canvas if called twice
			var canvas = document.createElement('canvas');
			canvas.setAttribute("id", 'rvimg_' + uId);
			canvas.setAttribute("data-uid", uId);
		
		
			canvas.setAttribute("width", width);
			canvas.setAttribute("height", height);
			canvas.setAttribute("style", 'outline: none; border: ' + borderCol); 
			

			
			
			
			
			this.myCanvas[uId] = canvas;
			
			
			if(typeof(url) === 'undefined') {
				url = '';
			}
			var that = this;
			if(iePre9 == true) {
				//var thisOnClick = "return processClick(event,\'rvimg_" + uId + "\', "+ uId + ",\'" + url  + "\');";
				//canvas.setAttribute("onclick", function processClickhandler(ev) { return that.processClick(ev,'rvimg_' + uId, uId, url); }); //thisOnClick
				canvas.onclick = function processClickhandler(ev) { return that.processClick(ev,'rvimg_' + uId, uId, url); };
				canvas.onfocus = function processFocushandler(ev) { return that.processOnFocus(ev, 'rvimg_' + uId); };
			} else {
				canvas.addEventListener('click', function processClickhandler(ev) { return that.processClick(ev,'rvimg_' + uId, uId, url); }, false);	
				canvas.addEventListener('focus', function processFocushandler(ev) { return that.processOnFocus(ev, 'rvimg_' + uId); }, false);	
			}		
			
			
			canvas.setAttribute("tabindex", id);	//For mousewheel
			if(iePre9 == false) {
				if(this.animateOption[uId] == 'true') {
					canvas.setAttribute("data-span", this.span);
					canvas.setAttribute("data-id", id);
					
				
					canvas.addEventListener('mousemove', function movehandler(ev) { return that.ev_mousemove(ev); }, false);					
					canvas.addEventListener('mousedown', function mousedownhandler(ev) { return that.ev_mousedown(ev); }, false);			
					canvas.addEventListener('mouseup', function mouseuphandler(ev) { return that.ev_mouseup(ev); }, false);					
					
					canvas.addEventListener('mouseout', function mouthandler(ev) { return that.ev_mouseout(ev); },false);			
					
					
					
					canvas.addEventListener('mousewheel',function mwheelhandler(ev) { return that.ev_mousewheel(ev); },false);		
				
					//Mouse wheel
					var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x

					if (canvas.attachEvent) //if IE (and Opera depending on user setting)
					    canvas.attachEvent("on"+mousewheelevt, function mwheelhandler(ev) { return that.ev_mousewheel(ev); });
					else if (canvas.addEventListener) //WC3 browsers
					    canvas.addEventListener(mousewheelevt, function mwheelhandler(ev) { return that.ev_mousewheel(ev); }, false);
					    
					//Touch devices
					canvas.addEventListener('touchstart', function touchstarthandler(ev) { return that.ev_touchstart(ev); }, false);					 
					canvas.addEventListener('touchmove', function touchmovehandler(ev) { return that.ev_touchmove(ev); }, false);					 
					canvas.addEventListener('touchend', function touchouthandler(ev) { return that.ev_touchend(ev); }, false);					
					//TEMPOUTcanvas.onselectstart = function () { return false; };		//Remove Chrome text select
					
					canvas.addEventListener("dragstart", function(fEventObject){ cancelEvent(fEventObject); } );
					canvas.addEventListener("selectstart", function(fEventObject){ cancelEvent(fEventObject); } );


				}
			
			}
			
			
			this.xZoomInto[uId] = 0.5;
			this.yZoomInto[uId] = 0.5;
			this.imageWidth[uId] = width;
			this.imageHeight[uId] = height;
			
			this.xVector[uId] = initVector;
			this.yVector[uId] = initVector;
			this.mousedown[uId] = 1;
			this.pauseZoomedOut[uId] = 0;
			mycanvas.appendChild(canvas);
			
			
			
			
			
			
			
		}
		
	}
		

}

function stopImages() {
	stopAllAnimations = true;
	//setTimeout
}

function repositionImage(x,y,width, height,id)
{
	//Make sure the normal pan is not running here
  	this.mouseOverThis = id;


	//Access the global myadvertblock - and point at a fraction within the image depending on where mouse is
  	var xIn = x / width;
  	var yIn = y / height;
  	
  	if(xIn >= 0.999) xIn = 0.999; 
  	if(xIn <= 0.001) xIn = 0.001; 
  	if(yIn >= 0.999) yIn = 0.999; 
  	if(yIn <= 0.001) yIn = 0.001; 
  	
  	this.xZoomInto[id] = xIn;
  	this.yZoomInto[id] = yIn;
  
  	

}


function moveImage(dx,dy,width, height, id)
{
	//Make sure the normal pan is not running here
  	this.mouseOverThis = id;

	//Access the global myadvertblock - and point at a fraction within the image depending on where mouse is
  	var xIn = this.xZoomInto[id];
  	var yIn = this.yZoomInto[id];
  	
  	xIn += -(dx / width)*2;
  	yIn += -(dy / height)*2;
  	
  	if(xIn >= 0.999) xIn = 0.999; 
  	if(xIn <= 0.001) xIn = 0.001; 
  	if(yIn >= 0.999) yIn = 0.999; 
  	if(yIn <= 0.001) yIn = 0.001; 
  	
  	this.xZoomInto[id] = xIn;
  	this.yZoomInto[id] = yIn;
  
  	

}


function repositionTouch(e)
{
	var x;
	var y;

	if ((e.targetTouches.length == 1)&&(this.touchZoom == false)) {
	    var touch = e.targetTouches[0];
	    
	   	
		x = touch.pageX;
		y = touch.pageY;
		var dx = x - this.totalLastX;
		var dy = y - this.totalLastY;
		
		this.totalLastX = x;
		this.totalLastY = y;
		     
		this.moveImage(dx, dy, e.target.getAttribute("width"), e.target.getAttribute("height"), e.target.getAttribute("data-uid"));
		
		e.preventDefault();
		return false;
	} 
	
	if(e.targetTouches.length == 2) {
		x = (e.targetTouches[0].pageX + e.targetTouches[1].pageX)/2;
		y = (e.targetTouches[0].pageY + e.targetTouches[1].pageY)/2;
		
		
		var dx = x - this.totalLastX;
		var dy = y - this.totalLastY;
		
		this.totalLastX = x;
		this.totalLastY = y;
		
		
		
		
		this.moveImage(dx,dy, e.target.getAttribute("width"), e.target.getAttribute("height"), e.target.getAttribute("data-uid"));
		
		
	
		dist = Math.abs(e.targetTouches[0].pageX - e.targetTouches[1].pageX) + Math.abs(e.targetTouches[0].pageY - e.targetTouches[1].pageY);
		var newZoom = ((dist)/100.0);
		if(newZoom > 4) newZoom = 4;
		if(newZoom < 1) newZoom = 1;
		this.newZoom[e.target.getAttribute("data-uid")] = newZoom;
	
		this.touchZoom = true;
	
		e.preventDefault();
		
		return false;
	}


}

function ev_touchstart (e) {
	this.touchZoom = false; //prevent a single finger touch on exit
	this.touch = true;
	
	if (e.targetTouches.length == 1) {
	  
		var touch = e.targetTouches[0];
		    
		this.totalLastX = touch.pageX;
		this.totalLastY = touch.pageY;	
	}
	
	if (e.targetTouches.length == 2) {
		this.totalLastX = (e.targetTouches[0].pageX + e.targetTouches[1].pageX)/2;
		this.totalLastY = (e.targetTouches[0].pageY + e.targetTouches[1].pageY)/2;
		
	}
	
	this.repositionTouch(e);
}

function ev_touchmove (e) {
	this.repositionTouch(e);
	
}

function ev_touchend (e) {
	this.mouseOverThis = -1;  //below 0
	

}

function ev_mousemove (e) {
  	if(this.touch == false) {
	  	var x, y;
	
		var totalOffsetX = 0;
		var totalOffsetY = 0;

		  //alert(this.offsetParent);
		   var currentElement = e.target;

		   do{
			totalOffsetX += currentElement.offsetLeft;
			totalOffsetY += currentElement.offsetTop;
		    }
		    while(currentElement = currentElement.offsetParent);



		var x;
		var y;
		if (e.pageX || e.pageY) { 
		  x = e.pageX;
		  y = e.pageY;
		}
		else { 
		  var scrollTop = document.documentElement ? document.documentElement.scrollTop :
                                           document.body.scrollTop;
		  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
		  y = e.clientY + document.body.scrollTop + scrollTop; 
		} 
		x -= totalOffsetX;
		y -= totalOffsetY;

		this.repositionImage(x,y, e.target.getAttribute("width"), e.target.getAttribute("height"), e.target.getAttribute("data-uid"));
	  }	

}

function ev_mouseout (e) {		
	if(iePre9 == false) {
	
		this.mouseOverThis = -1;  //below 0
	
		try {		//nasty ie9 bug on getattribute here 
			var uid = e.target.getAttribute("data-uid");
			this.zoomNow[uid] = this.autoZoom[uid];
			this.mousedown[uid] = 1;
			
		}
		catch (e)
		{
		}
	}
}



function ev_mousedown (e) {
	
	try {		//nasty ie9 bug on getattribute here 
		var uId = e.target.getAttribute("data-uid");
		
		this.zoomNow[uId] = 'true';
		this.mousedown[uId] = 3;
		
	}
	catch (e)
	{
	}
	
	e.preventDefault();	//Testing in
	return false;		//testing in
	
	
}

function ev_mouseup (e) {

	try {		//nasty ie9 bug on getattribute here 
		var uid = e.target.getAttribute("data-uid");
		this.zoomNow[uid] = this.autoZoom[uid];
		this.mousedown[uid] = 1;
	}
	catch (e)
	{
	}
}

function ev_mousewheel (e) {
	//window.scrollBy(0,-1*e.detail);
	
	if (!e) var e = window.event;	//Not sure if this should be in for IE9
	var evt= e; //window.event|| equalize event object;
	var delta=evt.detail? evt.detail*(-120) : evt.wheelDelta; //delta returns +120 when wheel is scrolled up, -120 when scrolled down
	try {		//nasty ie9 bug on getattribute here 
		var uId = e.target.getAttribute("data-uid");
		var newZoom = this.newZoom[uId] + (delta/800.0);
		if(newZoom > 4) {
			newZoom = 4;
			e.target.style.cursor = this.cursorZoomOut[uId];
		}
		if(newZoom < 1) {
			newZoom = 1;
			e.target.style.cursor = this.cursorZoomIn[uId];
		}
		this.newZoom[uId] = newZoom;
	}
	catch (e)
	{
	}
	if (evt.preventDefault) { //disable default wheel action of scrolling page
	    
	    evt.preventDefault();
	
	} 
	return false;
	
	
	
	
	
}

function stopAnimation()
{
	//alert('span:' + span);
	for (which in this.interval)
	{
		//alert('which:' + which);
	  	clearInterval(this.interval[which]);
	}
	
	
	return;
}






function rvolveZoomPic()
{
	//Member functions
	this.imageWidth = { };
	this.imageHeight = { };
	//this.ff = ff;
	this.createCanvas = createCanvas;
	this.listImages = listImages;
	this.setImages = setImages;
	this.animate = animate;
	this.scaleImage = scaleImage;
	
	this.ev_mousemove = ev_mousemove;
	this.ev_mouseout = ev_mouseout;
	this.ev_mousedown = ev_mousedown;
	this.ev_mouseup = ev_mouseup;
	this.ev_mousewheel = ev_mousewheel;
	this.ev_touchstart = ev_touchstart;
	this.ev_touchmove = ev_touchmove;
	this.ev_touchend = ev_touchend;
	this.repositionImage = repositionImage;
	this.moveImage = moveImage;
	this.repositionTouch = repositionTouch;
	this.processClick = processClick;
	this.processOnFocus = processOnFocus;
	this.touchZoom;
	this.totalLastX;
	this.totalLastY;
	this.touch = false;
	this.myCanvas = {};
	
	this.loadedRvlogo = false;
	
	
	
	this.textOffset = { };
	this.pauseZoomedOut = { };
	
	//Setinterval req
	this.zoomVector = { };
	this.newZoom = { };
	this.context = { };
	
	
	this.rvlogo;
	
	this.rvicon = { };
	this.cat = { };

	
	//Default image for this animation
	this.defaultImage = 'http://rvolve.com/images/rvolve_large_zoompic.jpg';
	
	
	this.xZoomInto = { };
	this.yZoomInto = { };
	
	
	this.xVector = { };
	this.yVector = { };
	this.mouseOverThis = { };
	this.mousedown = { };
	
	
	this.interval = { };
	this.stopAnimation = stopAnimation;
	this.zoompicReady = zoompicReady;
	this.zoompicRefresh = zoompicRefresh;
	
	this.uId = { };
	
	this.autoZoom = { };
	this.zoomNow = { };
	this.autoPan = { };
	this.animateOption = { };
	
	this.cursorZoomIn = { };
	this.cursorZoomOut = { };
	this.determineCursorType = determineCursorType;
	
	this.imageFinished = false;
	
	
	
		
			
}




function zoompicReady()
{
	var i = 0;
	var that = this;
	$(".zoompic").each(function(){
	   //alert($(this).attr("id") + $(this).attr("data-width") + $(this).attr("data-height") + $(this).attr("data-src"));	
	  
	   that.uId[i] = $(this).attr("id");
	   that.animateOption[i] = $(this).attr("data-animate");
	   that.autoZoom[i] = $(this).attr("data-autozoom");
	   that.zoomNow[i] = that.autoZoom[i];
	   that.autoPan[i] = $(this).attr("data-autopan");
	   
	   //Activate images
	   that.createCanvas(i,
	   			$(this).attr("id"), 
		   		$(this).attr("data-width"), 
		   		$(this).attr("data-height"), 
		   		$(this).attr("data-src"),
		   		$(this).attr("data-border"));
	   that.setImages(i, $(this).attr("id"), $(this).attr("data-src"), $(this).attr("data-href"), $(this).attr("data-animate"));

	  
	   //alert($(this).attr("data-src"));
	   i++;
	});
}


function zoompicRefresh()
{
	var i = 0;
	var that = this;
	$(".zoompic").each(function(){
	   //alert($(this).attr("id") + $(this).attr("data-width") + $(this).attr("data-height") + $(this).attr("data-src"));	
	  
	   that.uId[i] = $(this).attr("id");
	   that.animateOption[i] = $(this).attr("data-animate");
	   that.autoZoom[i] = $(this).attr("data-autozoom");
	   that.zoomNow[i] = that.autoZoom[i];
	   that.autoPan[i] = $(this).attr("data-autopan");
	   
	   //Activate images
	   that.setImages(i, $(this).attr("id"), $(this).attr("data-src"), $(this).attr("data-href"), $(this).attr("data-animate"));

	  
	   //alert($(this).attr("data-src"));
	   i++;
	});
}




var zp = new rvolveZoomPic();	//Init the object

$(document).ready(function() {
    zp.zoompicReady();
});


				
