// 3p
import React, { Children } from "react"
import { useRouteData } from "react-static"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import remarkFootnotes from "remark-numbered-footnote-labels"
import { InlineMath, BlockMath } from "react-katex"
import "katex/dist/katex.min.css"

// Mdast (Markdown AST) plugin to move footnotes definitions to the end
const footnotesPlugin = rootNode => {
  // get footnotes nodes
  const footnotesNodes = rootNode.children.filter(
    node => node.type === "footnoteDefinition"
  )
  // remove unnecessary nesting in footnotes (content is wrapped in a <p> tag)
  for (const node of footnotesNodes) {
    node.children = node.children[0].children
  }
  // create special footnotes node
  const footnotesNode = {
    type: "footnotes",
    children: footnotesNodes
  }
  // get other nodes
  const otherNodes = rootNode.children.filter(
    node => node.type !== "footnoteDefinition"
  )
  // overwrite root node children to move footnotes to the end
  rootNode.children = [].concat(otherNodes).concat([footnotesNode])
  return rootNode
}

// custom renderers
const renderers = post => ({
  // update image urls to make them work
  // TODO: add special behavior for absolute paths (to external images)
  image: ({ src, alt }) => (
    <img alt={alt} src={`/blog/post/${post.metadata.slug}/${src}`} />
  ),

  // KateX renderers for math blocks
  math: ({ value }) => <BlockMath math={value} />,
  inlineMath: ({ value }) => <InlineMath math={value} />,

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
  )
})

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
          footnotes: true
        }}
        astPlugins={[footnotesPlugin]}
        plugins={[
          remarkMath, // latex equations
          remarkFootnotes // footnotes auto-numbering
        ]}
        renderers={renderers(post)}
      />
    </div>
  )
}