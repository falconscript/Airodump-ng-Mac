/* 
 * JavaScriptLibrary designed for personal
 * ease of use in cross-browser hole filling
 * and simplification of some issues as well
 * as common operations.
 
 * Below:
 * GET variable parsing
 * SelectTable
 * addScript dynamically
 * Menu API
 * dump Function
 * JavaScript Tabbed Pane (Lebowitz)
 */


// Create Address Bar Variables... remove XSS opportunities
var addBarVars = {};
var badChars = /[\?\{\}\"<>\&:]/g;
var questionSpot = window.location.href.indexOf( "?" );
var GETpairs = questionSpot == -1 ? [] : window.location.href.substr( questionSpot+1 ).split( "&" );

for( var i = 0; i < GETpairs.length; i++ )
{
    var pair = GETpairs[i].split('=');
    addBarVars[  decodeURI(pair[0]).replace(badChars,'')  ] =
    		decodeURI(pair[1]).replace(badChars,'');
} 

 
 
/* 
 * Much simpler straightforward needs of making SelectTable
 * The old version of SelectTable made when I was learning JavaScript
 * 
 * Default backgrounds and selected text colors are used
 *
 * Prerequisites:
 * obtainElementsFunction should be a function to obtain the necessary items
 * Pass in colors object with constants declared
 */ 
function makeSelectTable(obtainElementsFunction, colors)
{
	// Niceness checks
	if(typeof obtainElementsFunction != "function")
	{ alert("makeSelectTable: First argument must be function"); return; }
	
	if( this == window )
	{ alert("makeSelectTable: Must call with new operator"); return; }
	
	// Define color choices, or fall back to defaults.
	var c = colors || {};
	
	c.MOUSEOVER_BG = c.MOUSEOVER_BG || c.mouseoverbg || ";background:lightblue;";
	c.SEL_BG = c.SEL_BG || c.sbgcolor || ";background:#0060A0;";
	c.BG = c.BG || c.unsbgcolor || ";background:transparent;";
	c.TEXT_COL = c.TEXT_COL || c.unstextcolor || "white";
	c.SEL_TEXT_COL = c.SEL_TEXT_COL || c.stcolor || "white";
	c.MOUSEOVER_TEXT_COL = c.mouseovertextcolor || "black";
	
	// Grab elements
	var arr = obtainElementsFunction();
	this.selectitems = arr;
	for(i in arr)
	{
		if(!arr[i] || !arr[i].style) continue;
	
		arr[i].oldClick = arr[i].onclick;
		arr[i].arra =  obtainElementsFunction();
		if(c.BG == "original")
			arr[i].originalbackground = arr[i].style.background;
		arr[i].onclick = function(){
		//arr ???
			this.style.cssText += c.SEL_BG;
			this.selectedvar = true;
			this.style.color = c.SEL_TEXT_COL;
				for(i in this.arra)
				{
					if(this.arra[i] && this.arra[i].style && this.arra[i] != this )
					{
						this.arra[i].style.cssText += c.BG;
						this.arra[i].style.color = c.TEXT_COL;
						this.arra[i].selectedvar = false;
					}
				}
			if(typeof this.oldClick == "function") this.oldClick();
			this.onmouseout();
		};
		
		arr[i].oldMouseOv = arr[i].onmouseover;
		arr[i].onmouseover = function(){
			if(!this.selectedvar)
			{
				this.style.cssText += c.MOUSEOVER_BG ;
				this.style.color = c.MOUSEOVER_TEXT_COL;
			}
			for(i in this.arra)
				{
					if(this.arra[i] && this.arra[i].style && this.arra[i] != this && !this.arra[i].selectedvar)
					{
						if(this.arra[i].originalbackground)
							this.arra[i].style.background = 
									this.arra[i].originalbackground;
						else
							this.arra[i].style.cssText += c.BG;
						this.arra[i].style.color = c.TEXT_COL;
					}
				}
			if(typeof this.oldMouseOv == "function") this.oldMouseOv();
		};
		arr[i].oldmouseout = arr[i].onmouseout;
		arr[i].onmouseout = function(){
			for(i in this.arra)
				{
					if(this.arra[i] && this.arra[i].style && !this.arra[i].selectedvar)
					{
						if(this.arra[i].originalbackground)
							this.arra[i].style.background = 
									this.arra[i].originalbackground;
						else
							this.arra[i].style.cssText += c.BG;
						this.arra[i].style.color = c.TEXT_COL;
					}
				}
			if(typeof this.oldmouseout == "function") this.oldmouseout();
		};
	}
	
	this.getSelectedItem = function()
	{
		for(i in this.selectitems)
		{
			if(this.selectitems[i] && this.selectitems[i].selectedvar)
				return this.selectitems[i];
		}
	};
	this.selectNext = function()
	{
		var isNext = false;
		for(i in this.selectitems)
		{
			if(isNext && this.selectitems[i].onclick)
			{
				this.selectitems[i].onclick(); return;
			}
			
			if(this.selectitems[i] && this.selectitems[i].selectedvar)
				isNext = true;
		}
	};
}


// Dynamically add JS/CSS file to DOM
function addScript(filename)
{
	var ext = filename.split('.').pop();
	var fileref;
	if (ext == "js" || ext == "php") {
			fileref = document.createElement('script');
			fileref.setAttribute("type","text/javascript");
			fileref.setAttribute("src", filename);
	} else if (ext == "css") {
			fileref = document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", filename);
	}
	
	if (typeof fileref != "undefined") {
		document.getElementsByTagName("head")[0].appendChild(fileref);
		return fileref;
	}
}

// Dynamically add CSS code directly to the page.
function addCss(cssCode) {
	var styleElement = document.createElement("style");
	
	styleElement.type = "text/css";
	
	if (styleElement.styleSheet) {
    	styleElement.styleSheet.cssText = cssCode;
    } else {
    	styleElement.appendChild(document.createTextNode(cssCode));
    }
    
    document.getElementsByTagName("head")[0].appendChild(styleElement);
}

// Simple menu UI created when learning JavaScript
// Attempts to maintain old eventlisteners
// requirements: main item taken in, has TWO children.
function makeMenu(item)
{
	var oldOnClick = item.onclick;
	item.onclick = function toggleVisibility() {
	
		var children = this.childNodes;
		
		for(i in children)
		{
			if(children[i] && children[i].style)
			{
				// Toggle visibility
				if(children[i].style.display == "none") //if hidden, show.
					children[i].style.display = "block";
				else //shown, so hide it
					children[i].style.display = "none";
			}
		}
		
		if(typeof oldOnClick == "function")
			oldOnClick();
	};
	item.onmouseout = function () {
		var children = this.childNodes;
		
		for(i in children)
		{
			if(children[i] && children[i].style)
				children[i].style.display = "none";
		}
	};
		
	
	item.style.cursor = "pointer";
	item.style.zIndex = "3";
	item.style.position = "absolute";
	item.style.border = "5px grey outset";
	item.style.padding = "2px";
	item.onmouseover = function(){ this.style.background = "whitesmoke"; };
	item.onmouseout = function(){ this.style.background = "white"; };
	var children = item.childNodes;
	
	for(i in children)
	{
		if(children[i] && children[i].style)
			{
				children[i].style.zIndex = "5";
				children[i].style.display = "block";
			}
			
		var grandchildren = children[i].childNodes;
		
		for(m in grandchildren)
		{
			if(grandchildren[m] && grandchildren[m].style)
			{
				grandchildren[m].onmouseover = function() { this.style.background = "white";   };
				grandchildren[m].onmouseout =  function() { this.style.background = "inherit"; };
			}
		}
	}
	item.onclick();
}

/*
 * Personal TabbedPane implementation
 *
 * Pass in a getter function to get all header 
 * elements (Recommended by class)
 * set each header's name as id of body divs
 *
 * <div class="aHeader" name="bodyItem"></div>
 * correponds to
 * <div id="bodyItem">
 */ 
function Lebowitz(getElements)
{
	if(typeof getElements != "function")
	{
		alert("getElements isn't a function");
		return;
	}
	
	this.headers = getElements();
	
	for(var i in this.headers)
	{
		this.headers[i].getElems = getElements;
		
		var x;
		
		if(this.headers[i] && this.headers[i].getAttribute)
			x = document.getElementById(this.headers[i].getAttribute("name"));
			
		if(x)
			this.headers[i].bodyDiv = x;
		else
			alert(this.headers[i].id+"\nGet name for this comes up as null");
		
		//onclick management
		this.headers[i].oldonclick = this.headers[i].onclick;
		this.headers[i].onclick = function() {
			var elems = this.getElems();
			for(var k in elems)
			{
				if (elems[k] && elems[k].style && elems[k].bodyDiv && elems[k] != this)
				{
					elems[k].bodyDiv.style.display = "none";
					elems[k].bodyDiv.style.visibility = "hidden";
				}
				else if(elems[k] == this && this.bodyDiv)
				{
					this.bodyDiv.style.display = "block";
					this.bodyDiv.style.visibility = "visible";
				}
			}
			
			if( typeof this.oldonclick == "function")
				oldonclick();
		};
	}
}



/*
 * Dump function for JavaScript variables
 *
 * Inspired by PHP's var_dump
 * Call on object with optional shouldAlert boolean
 * To see details of the object.
 * 
 * Upon calling, window.dumpvar can be accessed
 * with a variable copy at time of calling.
 */
function dump(obj, shouldAlert)
{
	// Could do a test for string 
	//if(typeof obj == "string") 
	
	var out = '';
	for (var i in obj)
		out += i + ": " + obj[i] + "\n\n";

	// Alert 
	if(typeof shouldAlert == "undefined" || shouldAlert == true)
	{
		alert(out);
	}
	else
	{
		// If avoiding alerts has been chosen...
		var pre = document.createElement('pre');
		pre.innerHTML = out;
		document.body.appendChild(pre);
	}
	
	// Set a window variable equal to this item, for further debugging
	window["dumpvar"] = obj;
	
	// Include it into an array
	(  window.dumpArray = window.dumpArray || []   ).push(obj);
}


/* Element Fix
 * Forgot where this source came from, I didn't make it
 * 
 * Provide prototyping and declaration for each DOM item
 * to be an Element. Modern browsers do this already,
 * this is mostly just hole patching.
 *
 *  Usage example to add function to all DOM elements
    Element.prototype.yourFunction = function() {
            alert("yourFunction");
    };
 */
if ( !window.Element )
{
    Element = function() {};

    // Override and catch document.createElement via Closure
    var __createElement = document.createElement;
    
    document.createElement = function(tagName) {
    
        var element = __createElement(tagName);
        
        for(var key in Element.prototype)
                element[key] = Element.prototype[key];
                
        return element;
    }
}

// Common jQuery-like className changers. Developed when jQuery had bugs
Element.prototype.hasClassName = function(name) {
  return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
};

Element.prototype.addClassName = function(name) {
  if (!this.hasClassName(name)) {
    this.className = this.className ? [this.className, name].join(' ') : name;
  }
};

Element.prototype.removeClassName = function(name) {
  if (this.hasClassName(name)) {
    var c = this.className;
    this.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "");
  }
};



/*
 * Simple encryption decryption and compression functions
 * Uses CSV formatting
 */
function decodeASCII(ar) { //Make string normal
  var k = [];
  k = ar.split(',');
  var str='';
  
  for(var i=0;i<ar.length;i++)
	str += String.fromCharCode(k[i]);
  
  return str;
}

function encodeAsASCII(str) { //Messes up a string
  var str2='';
  for(var i=0;i<str.length;i++) {
    str2+=str.charCodeAt(i)//.toString();
    if(i<str.length-1) str2+=',';
  }
  return str2;
}

function lzw_encode(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i=1; i<data.length; i++) {
        currChar=data[i];
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase=currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
}

// Decompress an LZW-encoded string
function lzw_decode(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
           phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}


// Include script dedicated to filling holes in IE functions
// Including, but not limited to, getElementsByName/ClassName
if (navigator.appName == 'Microsoft Internet Explorer')
	addScript("/iemethods.js");
