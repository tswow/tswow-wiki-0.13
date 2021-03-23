---
title: Create Page
permalink: /createpage/
classes: wide
---

- To create a new page, you will need a [GitHub](https://github.com/) account. 

- When creating a page, enter the desired name in either of the boxes below, press the button to be redirected
and then paste in the following header in the document:

```
---
title: MyTitle
---
```

<script> 
function createpage_click(type) {
    let value = document.getElementById(`${type}_input`).value;
    if(value.length===0) {
        alert('You need to enter a filename to create a page!');
        return;
    }
    value = value.split(' ').join('-').split('_').join('-').toLowerCase();
    location.href = `https://github.com/tswow/tswow-wiki/new/main?path=_${type}&filename=${value}.md`;
}
</script>

<h2> Create new Example </h2>
<p> Examples should contain practical steps for creating or doing something specific with TSWoW. </p>
<div style="display: table; width: 25em;">
    <div style="display: table-cell; width: 100%; padding-right: 2em;">
        <input type="text" id="examples_input" name="filename" placeholder="Filename">
    </div>
    
    <button style="width: 12em;" id="examples_button" onclick="createpage_click('examples');"> 
        Create Example
    </button>
</div>

<h2> Create new Documentation</h2>
<p> Documentation pages should describe how a certain aspect of TSWoW works. </p>
<div style="display: table; width: 25em;">
    <div style="display: table-cell; width: 100%; padding-right: 2em;">
        <input type="text" id="documentation_input" name="filename" placeholder="Filename">
    </div>
    <button style="width: 12em;" id="documentation_button" onclick="createpage_click('documentation');"> 
        Create Documentation 
    </button>
</div>