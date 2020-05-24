// 3p
import React from "react"
import { useRouteData } from "react-static"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import remarkFootnotes from "remark-numbered-footnote-labels"
import { InlineMath, BlockMath } from "react-katex"
import "katex/dist/katex.min.css"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"

// Mdast (Markdown AST) plugin to move footnotes definitions to the end
const footnotesPlugin = (rootNode) => {
  // get footnotes nodes
  const footnotesNodes = rootNode.children.filter(
    (node) => node.type === "footnoteDefinition"
  )
  // remove unnecessary nesting in footnotes (content is wrapped in a <p> tag)
  for (const node of footnotesNodes) {
    node.children = node.children[0].children
  }
  // create special footnotes node
  const footnotesNode = {
    type: "footnotes",
    children: footnotesNodes,
  }
  // get other nodes
  const otherNodes = rootNode.children.filter(
    (node) => node.type !== "footnoteDefinition"
  )
  // overwrite root node children to move footnotes to the end
  rootNode.children = [].concat(otherNodes).concat([footnotesNode])
  return rootNode
}

// Mdast (Markdown AST) plugin to update images urls
const imagesPathPlugin = (slug) => {
  const plugin = (node) => {
    if (node.type === "image") {
      // TODO: add special behavior for absolute paths (to external images)
      node.url = `/blog/post/${slug}/${node.url}`
      return
    }
    if (node.children === undefined) {
      return
    }
    for (const node of node.children) {
      plugin(node)
    }
    return node
  }
  return plugin
}

// custom renderers
const renderers = {
  // KateX renderers for math blocks
  math: ({ value }) => <BlockMath math={value} />,
  inlineMath: ({ value }) => <InlineMath math={value} />,

  // code blocks
  code: ({ value, language }) => (
    <SyntaxHighlighter language={language} style={tomorrow}>
      {value}
    </SyntaxHighlighter>
  ),

  // custom footnotes node
  footnotes: ({ children }) => <div className="footnotes">{children}</div>,

  // footnotes definitions
  footnoteDefinition: ({ label, children }) => (
    <div id={`fn-${label}`} className="footnote">
      {label}
      {". "}
      {children}
      <sup>
        <a href={`#fnref-${label}`}>[Return]</a>
      </sup>
    </div>
  ),

  // footnotes references
  footnoteReference: ({ label }) => (
    <sup>
      <a href={`#fn-${label}`} id={`fnref-${label}`}>
        {label}
      </a>
    </sup>
  ),
}

export default () => {
  const { post } = useRouteData()
  return (
    <div className="markdown">
      <h1>{post.metadata.title}</h1>
      <div className="date-container">
        <div className="date">
          {new Date(post.metadata.date).toISOString().slice(0, 10)}
        </div>
      </div>
      <ReactMarkdown
        source={post.body}
        parserOptions={{
          footnotes: true,
        }}
        escapeHtml={false}
        astPlugins={[footnotesPlugin, imagesPathPlugin(post.metadata.slug)]}
        plugins={[
          remarkMath, // latex equations
          remarkFootnotes, // footnotes auto-numbering
        ]}
        renderers={renderers}
      />
    </div>
  )
}
