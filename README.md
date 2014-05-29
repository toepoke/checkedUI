
checkedUI
=========

checkedUI is a simple and unobtrusive method of prettying up checkboxes and radio buttons using jQuery UI icons.

Demo
----
http://embed.plnkr.co/9YIayf/preview

Usage
-----
It's pretty easy to use, just include the following on your page:
	jQuery JavaScript
	jQuery UI JavaScript
	checkedUI JavaScript
	jQuery UI stylesheet
	
And run the following to fire it up

~~~javascript
$(document).ready(function () {
	$("input:checkbox, input:radio").checkedUI();
});
~~~~
	
Options
-------
You can also provide the following options as part of the `checkedUI` call:
* debug(`true`/`false`): If `true` the underlying checkbox or radio button isn't hidden, which is useful for debugging.
* onChkClass:  Overrides the icon to use for when a checkbox is selected
* offChkClass: Overrides the icon to use for when a checkbox is not selected
* onRadClass: Overrides the icon to use for when a radio button is selected
* offRadClass: Overrides the icon to use for when a radio button is not selected
	
	
	

