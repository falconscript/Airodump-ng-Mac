//Standard cookie functions. 
function createCookie(name, uncleanValue, days)
{
  var value = cleanCookie(uncleanValue);
	if(days){
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
	}
	else
		var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name)
{
	var nameEQ = name + "=";
	var cookieArray = document.cookie.split(';'); //ca is cookie array. contains all cookies
	for(var i=0; i< cookieArray.length; i++)
		{
			var c = cookieArray[i]; //c is the current cookie
			while (c.charAt(0) == ' ')
				c = c.substring(1, c.length);
			if(c.indexOf(nameEQ) == 0)
				return c.substring(nameEQ.length, c.length); //from after name to end of cookie
		}
	//(else)
	return null;
}

function eraseCookie(name)
{
	createCookie(name,"",-1); //sets cookie to die one day ago
}
//End Standard Cookie Functions

function cleanCookie(uncleanValue)
{
	uncleanValue = uncleanValue.toString();
	
	while ( uncleanValue.indexOf('\n') != -1 )
		uncleanValue = uncleanValue.replace('\n','');
		
	while ( uncleanValue.indexOf('\t') != -1 )
		uncleanValue = uncleanValue.replace('\t','');
	
	if (uncleanValue.indexOf(';') != -1 )
	{
		//alert("You are trying to put semicolons in a cookie! Think about it!");
	}
	
	while ( uncleanValue.indexOf(';') != -1 )
		uncleanValue = uncleanValue.replace(';','');
	
	return uncleanValue;
}

function createCookieArray(name, arrayValues, days)
{
	var arrayJoined = arrayValues.join("##^$%$");
	createCookie(name, arrayJoined, days);
}

function readCookieArray(cookieName)
{
	var cookieFound = readCookie(cookieName);
	var cookieArray = new Array();
	if(cookieFound != null)
		cookieArray = cookieFound.split('##^$%$"');

	return cookieArray;
}

function eraseAllCookies()
{
	var cookie = document.cookie.split('; ');
	for(v in cookie)
	{
		if(typeof cookie[v] != "string") continue; // ie protect
		
		// Erase
		try {
			eraseCookie(  cookie[v].split('=')[0] );
		} catch(e) {
			console && console.log && console.log("failed erasing cookie: " + e + "\n"+cookie[v]);
		}
	}
}

function cookieExists(name)
{
	if( readCookie(name) != null && readCookie(name) != "" )
		return true;
	else
		return false;
}

function isUndefined(x) {
	return x == null && x !== null;
}

function setFullCookieFromString(s) {
	var cooks = s.split('; ');
	for(var i in cooks) {
	
		if(typeof cooks[i] != "string") continue; // ie protect
		
		createCookie(cooks[i].split('=')[0], cooks[i].split('=')[1],365);
	}
}


// Dual names for compatibility
var getCookie = readCookie;
var setCookie = createCookie;
var removeCookie = eraseCookie;
