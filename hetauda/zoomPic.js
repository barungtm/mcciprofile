function addJavascript(jsname,pos, jsname2) {
	var th = document.getElementsByTagName(pos)[0];
	var s = document.createElement('script');
	s.setAttribute('type','text/javascript');
	s.setAttribute('src',jsname);
	s.onload = function(){
		if(jsname2) {
			var th = document.getElementsByTagName(pos)[0];
			var s = document.createElement('script');
			s.setAttribute('type','text/javascript');
			s.setAttribute('src',jsname2);
			th.appendChild(s);
		}
	};
	th.appendChild(s);
	
} 

function getInternetExplorerVersionFirst()
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

//Add in the required javascripts
if(!window.jQuery) {
	addJavascript("http://code.jquery.com/jquery-1.6.2.min.js", "head", "http://rvolve.com/js/zoom-pic-3.0.js");
} else {
	addJavascript("http://rvolve.com/js/zoom-pic-3.0.js", "head", "");


}




var ver = getInternetExplorerVersionFirst();

if( ver > -1) {
	if((typeof(document.documentMode) === 'undefined')||(document.documentMode < 9)) {

		addJavascript("http://rvolve.com/js/excanvas.compiled.js", "head");
	}
	
}


//Register on server
$(document).ready(function()
{
	$.get('http://rvolve.com/ajax_clicks_analytics.php?type=zoompic-on-site',
						function(response)
						{

						}
					);
});
