module.exports = function (className) {

if (!className) className = 'inserted';
var css = '@keyframes ' + className + 'NodeInserted { from { clip: rect(1px, auto, auto, auto); } to { clip: rect(0px, auto, auto, to); } } @-moz-keyframes ' + className + 'NodeInserted { from { clip: rect(1px, auto, auto, auto); } to { clip: rect(0px, auto, auto, auto); } } @-webkit-keyframes ' + className + 'NodeInserted { from { clip: rect(1px, auto, auto, auto); } to { clip: rect(0px, auto, auto, auto); } } @-ms-keyframes ' + className + 'NodeInserted { from { clip: rect(1px, auto, auto, auto); } to { clip: rect(0px, auto, auto, auto); } } @-o-keyframes ' + className + 'NodeInserted { from { clip: rect(1px, auto, auto, auto); }	to { clip: rect(0px, auto, auto, auto); } } .' + className + ' {	animation-duration: 0.001s;	-o-animation-duration: 0.001s;	-ms-animation-duration: 0.001s; -moz-animation-duration: 0.001s; -webkit-animation-duration: 0.001s; animation-name: ' + className + 'NodeInserted; -o-animation-name: ' + className + 'NodeInserted; -ms-animation-name: ' + className + 'NodeInserted; -moz-animation-name: ' + className + 'NodeInserted; -webkit-animation-name: ' + className + 'NodeInserted;}';
var elem = document.createElement('style');
var text = document.createTextNode(css);
elem.appendChild(text);

if (document.head.childNodes.length)
	document.head.insertBefore(elem, document.head.childNodes[0]);
else document.head.appendChild(elem);


insertListener = function (event) {
	if (!(event.animationName === className +'NodeInserted' && !event.target.dataset['inserted'])) return;
	event.target.dataset['inserted'] = true;
	var insertEvent = new Event('inserted');
	insertEvent.initEvent('inserted', false, true);
	insertEvent.inserted = event.target;
	insertEvent.animationName = event.animationName;

	if (event.target.parentNode) event.target.parentNode.dispatchEvent(insertEvent);
	document.dispatchEvent(insertEvent);
};

document.addEventListener("animationstart", insertListener, false);
document.addEventListener("MSAnimationStart", insertListener, false);
document.addEventListener("webkitAnimationStart", insertListener, false);

};