// "Edit page" header
(function() {
    const url = window.location.toString();
    let filename = undefined;
    const editable_urls = ['introduction/','examples/','documentation/'];
    for(const editable of editable_urls) {
        if(url.includes(editable)) {
            if(url.split(editable).length===1 && url.endsWith(editable)) {
                continue;
            }
            filename = `${editable}${url.split(editable)[1]}`
            // Remove last slash
            filename = filename.substring(0,filename.length-1);
        }
    }
    if(!filename) {
        return;
    }

    const content = document.getElementsByClassName('page__content')[0];
    if(content===undefined) {
        return;
    }
    content.innerHTML = `<a style="font-size: 0.8em;" href="https://github.com/tswow/tswow-wiki/edit/main/_${filename}.md">Edit page</a><p></p> ${content.innerHTML}`;
}());