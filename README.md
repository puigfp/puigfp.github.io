# puigfp.github.io

This repository hosts the source code of [puigfp.github.io](https://puigfp.github.io), my personal website, which is built using [react-static](https://github.com/react-static/react-static).

The only goal of this repository is to fit my personal use-case, which is, right now, a simple blog with the following features:

- design optimized for readability, with a clear boundary between French and English content
- simple post writing experience: the blog posts should be markdown files that are editable with a regular text-editor (such as Visual Studio Code or Typora), and in particular, images should render in a regular text-editor
- support for LateX equations rendering and code blocks highlighting

For the design and general look, I inspired myself from other projects, mainly the [cocoa theme for Hugo](https://github.com/nishanths/cocoa-hugo-theme/blob/master/screenshots.md) and [Typora's Newsprint theme](http://theme.typora.io/theme/Newsprint/) (I copy-pasted most of the CSS from the latter).

Being able to read their source code was very useful. People might find reading my code useful, that's why I'm publishing it.

Other things this code relies on:

- [normalize.css](https://necolas.github.io/normalize.css/)
- [SASS](https://sass-lang.com/) (just because I like [nesting CSS selectors](https://sass-lang.com/documentation/style-rules#nesting))
- [KateX](https://katex.org) and [react-katex](https://github.com/talyssonoc/react-katex)
- [react-markdown](https://github.com/rexxars/react-markdown) (which is itself powered by [remark](https://github.com/remarkjs/remark))

## Markdown rendering tricks

Some magic happens in [src/pages/blog/post.js](src/pages/blog/post.js) so that the posts render in the way I wanted.

My understanding of how `react-markdown` works is:

- it starts by parsing the markdown file and building a Markdown AST (using `remark`)
- and then it converts this Markdown AST to a tree of React components

To have `react-markdown` render the blog posts in the way I wanted, I had to use:

- plugins, which tweak the parsing stage
- AST plugins, which can transform Markdown AST before it's rendered to components
- custom renderers, which tell React-Markdown how some Markdown AST nodes should be converted to React components

I used 2 third-party plugins:

- [remark-math](https://github.com/remarkjs/remark-math) (`$$` and `$` parsing)
- [remark-numbered-footnotes](https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-numbered-footnotes) (footnotes auto-numbering)

I build 2 tiny AST plugins:

- the first updates the `urls` fields of all the `image` nodes, to replace the relative URLs (that make images show up when editing the markdown files in a text editor) with absolute URLs

- the second moves all the `footnoteDefinition` nodes to the end of the blog post, allowing me to write footnotes definitions right next to their reference, but still having the footnotes show up at the bottom of the page

And I defined a some custom renderers:

- two to render equations AST nodes (`math` and `inlineMath`) using `react-katex`'s components (`BlockMath` and `InlineMath`)

- two to render footnote definitions and references (because React-Markdown doesn't know how to render them by default)

_XXX_:  
The resulting React components tree is computed and rendered to HTML at build time, meaning that the blog posts will load and look fine (including LateX equations !) even if you have Javascript disabled.  
However, if you have JavaScript enabled, React will take over eventually (this is a core feature of react-static, cf. [talk](https://youtu.be/OqbJ5swVpDQ?t=707)). Then, if you click on links and go to another post's page, your browser will render it by downloading the original Markdown code and re-computing the React components tree on the client side. The main side-effect of this behavior is that Remark and KateX are shipped to your browser, and those are heavy libraries.  
This should be fixed by computing the HTML output once and for all at build time (ie, in `static.config.js`) and having the post component simply use `dangerouslySetInnerHTML` to render the post content.  
It should also be possible to only compute the Markdown AST at build time, and rendering it to a React components tree in the browser using [`react-markdown`'s `astToReact` function](https://github.com/rexxars/react-markdown/blob/master/src/ast-to-react.js). This would remove the Markdown parser from the bundle. However, KateX would still be needed and is actually a lot heavier than `remark-parser`, and that's why the previous solution is better.

## TODOs

- [x] add RSS feeds
- [x] add code highlighting support
- [ ] add automatic image pre-processing (compression, etc)
- [ ] add about page

## Local development

TL;DR:

```sh
npm install
npm run start
```

## Deployment

Done automagically by a [Github Actions workflow](.github/workflows/deploy.yml).

This workflow builds the website and pushes it to the `master` branch of this repository, which is automatically published to [puigfp.github.io](https://puigfp.github.io/) by Github.

The code used to build the website is stored in the `src` branch.
