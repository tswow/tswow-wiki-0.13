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
            let index = url.indexOf(editable)+editable.length;
            filename = `${editable}${url.substring(index)}`
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

    const api_path = `https://api.github.com/repos/tswow/tswow-wiki/commits?path=_${filename}.md`
    const file_path = `https://github.com/repos/tswow/tswow-wiki/_${filename}.md`
    const edit_path = `https://github.com/tswow/tswow-wiki/edit/main/_${filename}.md`

    let jsonString = localStorage[api_path] === undefined ? '{"timestamp": 0}' : localStorage[api_path];
    let curStorage = JSON.parse(jsonString);

    function shouldQuery() {
        try {
            return  curStorage.data === undefined || (Date.now()-curStorage.timestamp > 86400);
        } catch(err) {
            return true;
        }
    }

    function handleCommits(commits) {
        let authors = {}
        try {
            for(const commit of commits) {
                const url = commit.author.html_url;
                const avatar = commit.author.avatar_url;
                const id = commit.author.id;
                authors[id] = {url, avatar}
            }
        } catch(err) {}
        authors = Object.values(authors);
        content.innerHTML = `<div style="font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace!important; font-size: 0.8em;">
        ${authors.length===0?`<a href=${file_path}>View authors</a>`:
        `Authors:${
            authors.map(x=>`
                <a href="${x.url}"> <img src="${x.avatar}" width="28" height="28" /> </a>
            `).join(' ')}`}
        </br>
        <a href="${edit_path}">
            Edit page
        </a>
        <p></p> 
        </div>
        ${content.innerHTML}`;
    }

    if(shouldQuery()) {
        $.getJSON(api_path, (data)=>{
            // if we display authors, they should always be correct.
            handleCommits(data);
            if(Array.isArray(data) && data.length > 0) {
                localStorage[api_path] = JSON.stringify({data: data, timestamp: Date.now()});
            }
        });
    } else {
        handleCommits(curStorage.data);
    }
}());