/* Personal Cookie functions used to store and
 * easily manipulate cookies safely.
 *
 * Also useful for debugging using Chrome inspector.
 */

//Standard cookie functions, slightly modified from w3schools.com
function createCookie(name, uncleanValue, days)
{
	// Clean
	var value = uncleanValue.toString().replace(/\t\n\;/g,'');
	
	if(days){
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	} else {
		var expires = "";
	}
		
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
	
	return null;
}

function eraseCookie(name)
{
	createCookie(name,"",-1); //sets cookie to die one day ago
}
//End Standard Cookie Functions

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
	return readCookie(name) != null && readCookie(name) != "";
}

function isUndefined(x)
{
	return x == null && x !== null;
}

function setFullCookieFromString(s) {
	var cooks = s.split(';'); // May sometimes need '; ' instead
	
	// Iterate through cookies
	for(var i in cooks) {
	
		if(typeof cooks[i] != "string")  // ie protect
			continue;
		
		createCookie(cooks[i].split('=')[0], cooks[i].split('=')[1],365);
	}
}


// Dual names for compatibility
var getCookie = readCookie;
var setCookie = createCookie;
var removeCookie = eraseCookie;
