# node-inserted

A module to detect DOM insertion. It fires a new event whenever a new element is inserted into the DOM that has the `.inserted` class. You can add a listener to the `document` to get all the insertions, or you can add a listener to the _parent_ element. It uses the idea, published in [this](http://davidwalsh.name/detect-node-insertion) article.

## browserify
``` batch
npm install node-inserted
```

``` js
require('node-inserted')();

var handler = function () {
  console.log('insertion occured!');
};

document.addEventListener('inserted', handler, false); // fires on every insertion
parent.addEventListener('inserted', handler, false); // fires only when childs are inserted
```

## plain
``` html
<script type="text/javascript" src="inserted.js"></script>
```