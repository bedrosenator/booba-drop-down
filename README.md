Pure JS custom select

For demo see http://bedrosenator.github.io/vanilla-select/

Basic markup

Main features
- Supports cration from select / js object
- Enable / disable state for options and select
- Custom class for each list's item
- Search
- Navigation by keys
- Custom callbacks for: init, destroy, refresh, open, close, focus, blur events

Basic API methods
- init
- refresh
- destroy
- getValue
- showList
- hideList
- disable
- enable

```html
<select id="food-select-4" class="custom-select">
        <option class="red" value="Nicobar_shrew" title="Nicobar shrew">Nicobar shrew</option>
        <optgroup label="Group 1">
            <option disabled value="Namdapha_flying_squirrel" title="Namdapha flying squirrel">Namdapha flying
                squirrel
            </option>
            <option value="Himalayan_wolf" title="Himalayan wolf">Himalayan wolf</option>
        </optgroup>
        <optgroup label="Group 2">
            <option value="Andaman_Shrew" title="Andaman Shrew" class="mw-redirect">Andaman Shrew</option>
            <option value="Andaman_Drew" title="Andaman Drew" class="mw-redirect">Andaman Drew</option>
            <option value="Jenkins_shrew" title="Jenkins' shrew">Jenkins' shrew</option>
        </optgroup>
        <option value="Sumatran_rhinoceros" title="Sumatran rhinoceros">Sumatran rhinoceros</option>
        <option value="Kondana_soft-furred_rat" title="Kondana soft-furred rat">Kondana soft-furred rat</option>
        <option value="Pygmy_hog" title="Pygmy hog">Pygmy hog</option>
        (<i>Porcula salvania</i>)
        <option value="Javan_rhinoceros" title="Javan rhinoceros">Javan rhinoceros</option>
        <option value="Malabar_large-spotted_civet" title="Malabar large-spotted civet">Malabar large-spotted civet
        </option>
        <option value="Elvira_Rat" title="Elvira Rat" class="mw-redirect">Elvira Rat</option>
    </select>
```

```javascript
   var vanillaSelect = new VanillaSelect({
        // DOM Node (select to change)
        select: document.getElementById('food-select-4'),
        // Bool true/false (enable/disable search)
        search: true,
        // Array[object] (select options)
        jsonData: false,
        // DOM Node (container to render select from object passed in jsonData
        parentContainer: document.getElementById('select-container'),
        // Bool (disable/enable) select
        disabled: false,
        String (label, when search enabled)
        label: 'State',
        // Callback function on open event
        onOpen: function (e) {
            console.log('On open event ', e);
        },
        // Callback function on close event
        onClose: function (e) {
            console.log('On close event ', e);
        },
        // Callback function on init event
        onInit: function (e) {
            console.log('On init event ', e);
        },
        // Callback function on destroy event
        onDestroy: function (e) {
            console.log('On destroy event ', e);
        },
        // Callback function on focus event
        onFocus: function (e) {
            console.log('On focus event', e);
        },
        // blur Callback function on blur event
        onBlur: function (e) {
            console.log('On blur event', e);
        },
        // Callback function on refresh event
        onRefresh: function (e) {
            console.log('On refresh event', e);
        }
    });
