## node-touch

``` batch
npm install node-touch
```

Extra touch events and hover behaviour for touch devices.

``` js
require('node-touch')();
```
``` html
<div class="touch">Example</div>
```

In order to use the features, you have to call the module once in the beginning and create the dom elements with the `touch` class.

### hover
``` css
div { ... }
div.hover { ... }
```
On touch devices, the hover behaviour is quite crappy. With this module, if you use the `.hover` class instead of the `:hover` pseudoclass, on a touch device the class will be applied when the element is touched on the screen, and on a non-touch device it will act as `:hover`. [example](http://felix.lovassy.hu/projects/gellert/touch/).

### tap
``` js
var button = document.createElement('button').
button.classList.add('touch');
document.body.appendChild(button);

button.addEventListener('tap', function (event) {
  console.log('Tapped!');
}, false);
```
You can use the `tap` event just as a normal event. It is sort of the touch equivalent of `click`.

### touchleave
``` js
var div = document.querySelector('div');

div.addEventListener('touchleave', function (event) {
  console.log('Left!');
}, false);
```
The event fires when the finger left the element.

### swipe
You can add listeners to swipe events. There are three type of swipe events.
``` js
div.addEventListener('swipestart', function (event) {});

div.addEventListener('swipemove', function (event) {});

div.addEventListener('swipeend', function (event) {});
```
The `event` object's important properties are:
- __direction__: `RIGHT`, `LEFT`, `UP`, `DOWN`
- __delta__: how much pixel it moved from the starting touch (relative to the direction)
- __startTouch__: the starting touch object
- __prevTouch__: the previous touch object
- __changedTouch__: the latest touch object

### window.isTouchDevice
This module sets a global _Boolean_ that just tells you whether the user is on a touch device. It can be useful!