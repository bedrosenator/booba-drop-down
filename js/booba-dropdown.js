function DropDown(options) {
    //copy options
    //this.options = Object.create(options);
    this.options = options;
    this.select = this.options.select;
    //list title
    this.title;
    this.titleCoords;
    //custom select list
    this.ul;
    //parent of custom select component
    this.parent;
    //current selection index
    this.selectedIndex;
    //value of selected item
    this.value;

    this.init();
    DropDown.counter++;
}
//counter of created objects
DropDown.counter = 0;

//set listeners and run needed methods
DropDown.prototype.init = function() {
    this.drawList();
    document.addEventListener('click', this.click.bind(this));
    this.parent.addEventListener('mouseover', this.mouseover.bind(this));
    this.parent.addEventListener('click', this.setSelection.bind(this));
    this.parent.addEventListener('mouseout', this.mouseout.bind(this));
    this.parent.addEventListener('keydown', this.keydown.bind(this));
};

//keydown processing
DropDown.prototype.keydown = function(e) {
    if(e.keyCode === 13) {
        if(e.target !== this.ul) return;
        if(!this.parent.classList.contains('open')) {
            this.ul.focus();
            this.showList(e);
        } else {
            this.setSelection(e);
            this.hideList(e);
        }
    }
    // escape key
    if(e.keyCode === 27) {
        this.hideList(e);
    }
    //keyup 38
    if(e.keyCode === 38) {
        this.shiftUp(e);
    }
    //keydown 40
    if(e.keyCode === 40) {
        this.shiftDown(e);
    }
    //tab
    if(e.keyCode === 9) {
        this.hideList(e);
    }
};

// shift list down
DropDown.prototype.shiftDown = function(e) {
    //if(!this.parent.classList.contains('open')) return;
//console.log(this.selectedIndex);
    var liElems = this.ul.children;
    var nextElem = liElems[this.selectedIndex].nextElementSibling;
    var listBottom = 0;
    var liHeight = liElems[this.selectedIndex].offsetHeight;

    //go to next elem
    if(nextElem) {
        this.clearSelection();
        nextElem.classList.add('selected');
        this.selectedIndex++;
    }
    //calculate bottom coord. of visible part of the list
    listBottom = liElems[this.selectedIndex].offsetTop + liHeight - this.ul.scrollTop;
    //console.log('listBottom = ', listBottom);
    if(listBottom >= this.ul.offsetHeight) {
        this.ul.scrollTop += liHeight;
    }

    this.setSelection(e);
    //prevent page scroll by arrow down
    e.preventDefault();
};

//shift list up
DropDown.prototype.shiftUp = function(e) {
    var liElems = this.ul.children;
    var prevElem = liElems[this.selectedIndex].previousElementSibling;
    var liHeight = liElems[this.selectedIndex].offsetHeight;
    var listTop = 0;
    //go to previous elem
    if(prevElem) {
        this.clearSelection();
        prevElem.classList.add('selected');
        this.selectedIndex--;
    }

    if(!liElems[this.selectedIndex].offsetParent) return;

    listTop = liElems[this.selectedIndex].offsetParent.scrollTop - liElems[this.selectedIndex].offsetTop;
    if(listTop > 0) {
        this.ul.scrollTop -= liHeight;
    }

    this.setSelection(e);
    //prevent page scroll by arrow up
    e.preventDefault();
};

//clear selection on mouseout
DropDown.prototype.mouseout = function(e) {
    this.clearSelection();
    this.ul.children[this.selectedIndex].className = 'selected';
};
//show/hide list
DropDown.prototype.click = function(e) {
    if(!this.parent.classList.contains('open')) {
        this.showList(e);
    } else {
        this.hideList(e);
    }
};
//clear selected element
DropDown.prototype.clearSelection = function() {
    var ul = this.ul.querySelector('.selected');
    if(ul) ul.classList.remove('selected');

    /*for(var i = 0; i < this.ul.children.length; i++) {
     if(this.ul.children[i].classList.contains('selected')) this.ul.children[i].classList.remove('selected');
     }*/
};

//set new value of original select
DropDown.prototype.setSelectedValue = function() {
    //remove old seleced option
    var selectedOptionElem = this.select.querySelector('option[selected]');
    if(selectedOptionElem) {
        selectedOptionElem.removeAttribute('selected');
    }
    this.select.children[this.selectedIndex].setAttribute('selected', 'selected');
    //set new selected option

};

DropDown.prototype.setSelection = function(e) {
    var liElem = e.target.parentNode.querySelector('li.selected') || e.target.parentNode.querySelector('ul > li:first-child');

    if(e.target.tagName === 'LI' || e.target.parentNode.tagName === "UL") {
        liElem = e.target;
    }

    if(!liElem) return;

    //clear selected class
    this.clearSelection();
    // set selected class and new title
    liElem.classList.add('selected');
    this.selectedIndex = [].indexOf.call(this.ul.children, liElem);

    //change title and set value
    this.title.innerHTML = liElem.innerHTML;
    this.setSelectedValue();
};

DropDown.prototype.mouseover = function(e) {
    if(e.target.tagName !== 'LI') return;

    var currentSelection = [].indexOf.call(this.ul.children, e.target);
    e.target.parentNode.querySelector('.selected').classList.remove('selected');

    this.ul.children[currentSelection].className = 'selected';
};

DropDown.prototype.drawList = function() {
    var li;
    //create wrap for list
    this.parent = document.createElement('div');
    //this.parent.tabIndex = DropDown.counter;
    this.parent.className = 'customselect';

    //create title
    this.title = document.createElement('button');
    this.title.className = 'title';
    this.parent.appendChild(this.title);

    //create ul
    this.ul = document.createElement('ul');
    //this.ul.tabIndex = 1;
    this.parent.id = "customselect-" + this.select.id;

    //create li for ul
    for(var i = 0; i < this.select.length; i++) {
        li = document.createElement('li');
        li.appendChild(document.createTextNode(this.select[i].innerHTML));
        li.setAttribute('data-value', this.select[i].value);
        //set selected class if there is no selected attribute
        if(i === 0) {
            li.className = 'selected';
            this.selectedIndex = i;
        }
        this.ul.appendChild(li);
        //set selected option
        if(this.select[i].getAttribute('selected')) {
            this.clearSelection();
            li.className = 'selected';
            this.title.innerHTML = this.select[i].innerHTML;
            this.selectedIndex = i;
        }
    }

    var span = document.createElement('span');
    span.innerHTML = '&#x25BE';
    span.className = 'arrow';
    this.parent.appendChild(span);

    // if there is no selected options by default then first to be set;
    if(!this.selectedIndex) this.title.innerHTML = this.select[this.selectedIndex].innerHTML;
    this.parent.appendChild(this.ul);
    //insert new list after original select
    this.select.parentNode.insertBefore(this.parent, this.select.nextSibling);
    //hide original select
    this.select.style.display = 'none';
};

DropDown.prototype.showList = function(e) {
    //check parent, is it custom select or not
    if(!(e.target.id === this.parent.id || e.target.parentNode.id === this.parent.id)) return;

    if(e.target.parentNode.className === "customselect" || e.target.className === 'customselect') {
        this.parent.classList.add('open');
    }
    this.ul.tabIndex = 1;

    //scroll to visible element
    this.ul.scrollTop = this.ul.children[this.selectedIndex].offsetTop;
};

DropDown.prototype.hideList = function(e) {
    this.parent.classList.remove('open');
    this.ul.removeAttribute('tabindex');
};


(function () {

    if (typeof window.Element === "undefined" || "classList" in document.documentElement) return;

    var prototype = Array.prototype,
        push = prototype.push,
        splice = prototype.splice,
        join = prototype.join;

    function DOMTokenList(el) {
        this.el = el;
        // The className needs to be trimmed and split on whitespace
        // to retrieve a list of classes.
        var classes = el.className.replace(/^\s+|\s+$/g,'').split(/\s+/);
        for (var i = 0; i < classes.length; i++) {
            push.call(this, classes[i]);
        }
    };

    DOMTokenList.prototype = {
        add: function(token) {
            if(this.contains(token)) return;
            push.call(this, token);
            this.el.className = this.toString();
        },
        contains: function(token) {
            return this.el.className.indexOf(token) != -1;
        },
        item: function(index) {
            return this[index] || null;
        },
        remove: function(token) {
            if (!this.contains(token)) return;
            for (var i = 0; i < this.length; i++) {
                if (this[i] == token) break;
            }
            splice.call(this, i, 1);
            this.el.className = this.toString();
        },
        toString: function() {
            return join.call(this, ' ');
        },
        toggle: function(token) {
            if (!this.contains(token)) {
                this.add(token);
            } else {
                this.remove(token);
            }

            return this.contains(token);
        }
    };

    window.DOMTokenList = DOMTokenList;

    function defineElementGetter (obj, prop, getter) {
        if (Object.defineProperty) {
            Object.defineProperty(obj, prop,{
                get : getter
            });
        } else {
            obj.__defineGetter__(prop, getter);
        }
    }

    defineElementGetter(Element.prototype, 'classList', function () {
        return new DOMTokenList(this);
    });

})();