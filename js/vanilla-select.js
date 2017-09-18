function VanillaSelect(options) {
  this.options = options;
  this.select = this.options.select || document.createElement('select');
  this.cssClasses = {
    search: 'vanilla-select__search',
    searchChanged: 'vanilla-select__search--touched',
    wrap: 'vanilla-select',
    list: 'vanilla-select__list',
    title: 'vanilla-select__title',
    selectedItem: 'vanilla-select__list__selected',
    arrow: 'vanilla-select__arrow',
    label: 'vanilla-select__search__label',
    disabledOption: 'vanilla-select__list--disabled',
    groupLabel: 'vanilla-select__list--label',
    listItem: 'vanilla-select__list__item'
  };

  //list title
  this.title = document.createElement('input');
  //custom select list
  this.ul;
  //parent of custom select component
  this.parent = document.createElement('div');
  //value of selected item
  this.value;
  this._initListeners();
  this._initCustomEvents();
  this.init();
}

VanillaSelect.prototype.init = function () {
  // skip init if it was created
  if (this.parent && this.parent.hasChildNodes()) {
    return;
  }

  if (this.options.jsonData) {
    this._fillSelectFromJson(this.options.jsonData);
  }

  this._createTitle();
  this.ul = this._createList(this.select, this.parent);
  this.parent.dispatchEvent(this.onInit);
};

VanillaSelect.prototype._initCustomEvents = function() {
  // custom events
  this.onOpen = new CustomEvent('open');
  this.onClose = new CustomEvent('close');
  this.onInit = new CustomEvent('init');
  this.onDestroy = new CustomEvent('destroy');
  this.onRefresh = new CustomEvent('refresh');

  if (this.options.onOpen && typeof this.options.onOpen === "function") {
    this.parent.addEventListener('open', this.options.onOpen.bind(this))
  }

  if (this.options.onClose  && typeof this.options.onClose === "function") {
    this.parent.addEventListener('close', this.options.onClose.bind(this))
  }

  if (this.options.onInit && typeof this.options.onInit == "function") {
    this.parent.addEventListener('init', this.options.onInit.bind(this));
  }

  if (this.options.onDestroy && typeof this.options.onDestroy == "function") {
    this.parent.addEventListener('destroy', this.options.onDestroy.bind(this));
  }

  if (this.options.onRefresh && typeof this.options.onRefresh == "function") {
    this.parent.addEventListener('refresh', this.options.onRefresh.bind(this));
  }

};

VanillaSelect.prototype._initListeners = function () {
  document.addEventListener('click', this._clickOutside.bind(this));
  this.parent.addEventListener('click', this._click.bind(this));
  this.parent.addEventListener('keydown', this._keydown.bind(this));
  if (this.options.search) {
    this.title.addEventListener('input', this._onSearch.bind(this));
  }
};

VanillaSelect.prototype.getValue = function () {
  return this.value;
};

VanillaSelect.prototype._click = function (e) {
  if(!this.parent.classList.contains('open')) {
    this.showList(e);
  } else {
    this._setSelectionByClick(e);
    if (!e.target.hasAttribute('data-disabled')) this.hideList(e);
  }
};

VanillaSelect.prototype._clickOutside = function (e) {
  if (this._isClickOutsideList(e)) {
      console.log('outside');
      this.hideList();
  }
};

// refresh
VanillaSelect.prototype.refresh = function () {
  this.parent.dispatchEvent(this.onRefresh);
  this.destroy();
  this.init();
};

// destroy
VanillaSelect.prototype.destroy = function () {
  if (this.parent && this.parent.parentNode) {
    this.parent.dispatchEvent(this.onDestroy);
    this.parent.parentNode.removeChild(this.parent);
    this.value = null;
    this.title.value = null;
    this.select.style.display = '';
    this.parent.innerHTML = null;
    this.select.removeAttribute('hidden');
  }
};

VanillaSelect.prototype._setLabelPosition = function () {
  if (this.title.value) {
    this.title.parentNode.classList.add(this.cssClasses.searchChanged);
  } else {
    this.title.parentNode.classList.remove(this.cssClasses.searchChanged);
  }
};

VanillaSelect.prototype._onSearch = function () {
  var liElems = this.parent.querySelectorAll('li');
  var self = this;
  var nestedElems;
  var searchQuery = self.title.value;

  this._setLabelPosition();

  for (var i = 0; i < liElems.length; i++) {
    if (liElems[i].firstChild.textContent.toLowerCase().indexOf(searchQuery.toLowerCase()) == -1) {
      nestedElems = [].filter.call(liElems[i].querySelectorAll('li:not([hidden])'), function(elem) {
        return !elem.hasAttribute('[hidden]');
      });
      if (!nestedElems.length && !liElems[i].hasAttribute('data-label')) {
        liElems[i].setAttribute('hidden', 'hidden');
        liElems[i].setAttribute('disabled', 'disabled');
      }
    } else {
      liElems[i].removeAttribute('hidden');
      liElems[i].removeAttribute('disabled');
    }
  }
};

VanillaSelect.prototype._shift = function (direction, e) {
  var liElems = this.parent.querySelectorAll('li:not([data-disabled])');
  liElems = [].filter.call(liElems, function(liElem) {
    return !liElem.hasAttribute('disabled');
  });

  var selelectedItem = this.parent.querySelector('.' + this.cssClasses.selectedItem) || liElems.firstChild;
  var selelectedItemIndex = [].indexOf.call(liElems, selelectedItem);
  var nextElem = direction == 'up' ? liElems[selelectedItemIndex - 1] : liElems[selelectedItemIndex + 1];
  // skip last and first elem
  if (liElems.firstChild == nextElem || liElems.lastChild == nextElem) return;

  this._clearSelection();
  if (nextElem) {
    nextElem.classList.add(this.cssClasses.selectedItem);
    this._setListOffset(direction, e);
  }
};

VanillaSelect.prototype._keydown = function (e) {
  //key down 40
  if(e.keyCode === 40) {
    this._shift('down', e);
  }
  //key up 38
  if(e.keyCode === 38) {
    this._shift('up', e);
  }
  // enter
  if(e.keyCode === 13) {
    if(!this.parent.classList.contains('open')) {
      this.showList(e);
    } else {
      this._setSelectionByKey(e);
      this.hideList(e);
      this._setLabelPosition();
    }
  }
  // escape
  if(e.keyCode === 27) {
    this.hideList(e);
  }
};

VanillaSelect.prototype._setSelectionByKey = function (e) {
  var selectedItem = this.parent.querySelector('.' + this.cssClasses.selectedItem);

  this.select = selectedItem.dataset.value;
  this.title.value = selectedItem.innerHTML;
  this.value = selectedItem.dataset.value;
};

VanillaSelect.prototype._createTitle = function () {
  var label = document.createElement('label');

  if (this.options.search) {
    // create search wrap
    var searchWrap = document.createElement('div');
    searchWrap.classList.add('search-wrap');
    this.title.classList.add(this.cssClasses.search);
    label.appendChild(document.createTextNode(this.options.label));
    label.classList.add(this.cssClasses.label);
    searchWrap.appendChild(this.title);
    searchWrap.appendChild(label);
    this.parent.appendChild(searchWrap);
  } else {
    this.title.classList.add(this.cssClasses.title);
    this.title.setAttribute('readonly', true);
    this.parent.appendChild(this.title);
  }
};

VanillaSelect.prototype.showList = function () {
  this.parent.classList.add('open');
  this.parent.dispatchEvent(this.onOpen);
};

VanillaSelect.prototype._isClickOutsideList = function (e) {
  var target = e.target;

  while (target.tagName) {
    if (target === this.parent) {
      return false;
    }
    target = target.parentNode;
  }
  return true;
};

VanillaSelect.prototype.hideList = function (e) {
  if (this.parent && this.parent.classList.contains('open')) {
    console.log('hide LIST');
    this.parent.classList.remove('open');
    this.parent.dispatchEvent(this.onClose);
  }
};

VanillaSelect.prototype._createList = function(select, parent, recursion) {
  var ul = document.createElement('ul');
  var li;
  var textValue;

  parent.classList.add(this.cssClasses.wrap);
  if (!recursion) {
    ul.classList.add(this.cssClasses.list);
    this.select.setAttribute('hidden', true);
  }

  for (var i = 0; i < select.children.length; i++) {
    li = document.createElement('li');
    // create nested list for optgroups
    if (select.children[i].tagName == 'OPTGROUP') {
      textValue = document.createTextNode(select.children[i].getAttribute('label'));
      li.appendChild(textValue);
      li.classList.add(this.cssClasses.groupLabel);
      li.setAttribute('data-label', select.children[i].getAttribute('label'));
      li.setAttribute('data-disabled', select.children[i].getAttribute('label'));

      //insert inner ul
      li.appendChild( this._createList(select.children[i], parent, true) );
      ul.appendChild(li);
    }

    if (select.children[i].tagName != 'OPTION') continue;

    textValue = document.createTextNode(select.children[i].innerHTML);
    li.setAttribute('data-value', select.children[i].value);
    li.appendChild(textValue);
    // set attrs for disabled option
    if (select.children[i].hasAttribute('disabled')) {
      li.classList.add(this.cssClasses.disabledOption);
      li.setAttribute('data-disabled', 'disabled');
    }
    if (select.children[i].classList.length) {
        li.classList.add(select.children[i].classList.value);
    }
    // set selected class
    if (select.children[i].hasAttribute('selected')) {
      li.classList.add(this.cssClasses.selectedItem);
    }

    ul.appendChild(li);
  }

  parent.appendChild(ul);
  select.parentNode.insertBefore(parent, select.nextSibling);

  return ul;
};

VanillaSelect.prototype._clearSelection = function () {
  var prevSelectedElem = this.parent.querySelector('.' + this.cssClasses.selectedItem);

  // clear previous selection
  if (prevSelectedElem) {
    prevSelectedElem.classList.remove(this.cssClasses.selectedItem);
  }
};

VanillaSelect.prototype._setSelectionByClick = function (e) {
  var target = e.target;

  if (target.tagName == 'LI' && !target.hasAttribute('data-disabled') && !target.hasAttribute('data-label')) {
    this._clearSelection();
    target.classList.add(this.cssClasses.selectedItem);
    this.title.value = target.innerHTML;
    this.value = target.dataset.value;
    this._setLabelPosition();
  }
};

VanillaSelect.prototype._fillSelectFromJson = function (jsonData) {
  var option;

  if (this.select.hasChildNodes()) {
    while (this.select.firstChild) {
      this.select.removeChild(this.select.firstChild);
    }
  }

  for (var i = 0; i < jsonData.length; i++) {
    option = document.createElement('option');
    option.value = jsonData[i].value;
    option.innerHTML = jsonData[i].label;
    if (jsonData[i].disabled) {
      option.setAttribute('disabled', 'disabled');
    }
    if (jsonData[i].selected) {
      option.setAttribute('selected', 'selected');
    }
    if (jsonData[i].class) {
        option.classList.add(jsonData[i].class);
    }
    this.select.appendChild(option);
  }
  // if no parent's container then append to body
  if (!this.options.parentContainer) {
    this.options.parentContainer = document.createElement('div');
    document.body.appendChild(this.options.parentContainer);
  }
  this.options.parentContainer.appendChild(this.select);
};

VanillaSelect.prototype._setListOffset = function (direction, e) {
  var liElems = this.ul.getElementsByTagName('li');
  var selectedItem;
  var listBottom = 0;
  var listTop = 0;
  var liHeight;
  var self = this;

  selectedItem = [].filter.call(liElems, function (li) {
    return li.classList.contains(self.cssClasses.selectedItem);
  })[0];

  liHeight = selectedItem.offsetHeight;

  if (direction == 'down') {
    //calculate bottom coord. of visible part of the list
    listBottom = selectedItem.offsetTop + liHeight - this.ul.scrollTop;
    if (listBottom >= this.ul.offsetHeight) {
      this.ul.scrollTop += liHeight;
    }
  }

  if (direction == 'up') {
    listTop = this.ul.scrollTop - selectedItem.offsetTop;
    if (listTop > 0) {
      this.ul.scrollTop -= listTop;
    }
  }
  //prevent page scroll by arrow down
  e.preventDefault();
};
