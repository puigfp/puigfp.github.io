// 3p
import React from "react"
import { useRouteData } from "react-static"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import { InlineMath, BlockMath } from "react-katex"

import "katex/dist/katex.min.css"

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
          // TODO: actually handle those
          footnotes: false
        }}
        plugins={[remarkMath]}
        renderers={{
          // TODO: actually handle those
          footnoteDefinition: props => (
            console.log(props), "footnote definition"
          ),
          footnoteReference: props => (
            console.log(props), "footnote reference"
          ),
          // TODO: add special behavior for absolute paths (to external images)
          image: ({ src, alt }) => (
            <img alt={alt} src={`/blog/post/${post.metadata.slug}/${src}`} />
          ),
          math: ({ value }) => <BlockMath math={value} />,
          inlineMath: ({ value }) => <InlineMath math={value} />
        }}
      />
    </div>
  )
}
