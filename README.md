# TSWoW Wiki

This is code backing the Wiki for TSWoW, hosted through GitHub pages. You can [view the wiki here](https://tswow.github.io/tswow-wiki).

## Development

This wiki uses the [minimal-mistakes](https://github.com/mmistakes/minimal-mistakes) jekyll theme, 
you can see their [documentation](https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/) for how the project is structured. 
We use some custom css in `_sass`, a redirect at `_layouts/home.html` and some custom javascript to render edit/author links, 
but otherwise this is a fairly standard installation.

Some notes for testing and developing this wiki locally:

- Check out [GitHubs guide for previewing Jekyll sites](https://docs.github.com/en/github/working-with-github-pages/testing-your-github-pages-site-locally-with-jekyll)

- Many paths are currently hardcoded to the tswow wiki url specifically, especially for editing and author data.

- The homepage redirect does not work when hosted locally, but you can still access the homepage by clicking the `Home` button.

- We use the GitHub API to query author data from the browser, and since this is rate-limited to 60 requests per hour and IP we cache that information in `localStorage` for 24 hours per page.