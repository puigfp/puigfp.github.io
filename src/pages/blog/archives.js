// 3p
import React from "react"
import { useRouteData } from "react-static"
import { Link } from "@reach/router"

import "katex/dist/katex.min.css"

export default () => {
  const { lang, posts } = useRouteData()
  return (
    <section className="posts">
      <h2>{lang.archive_title}</h2>
      <ul>
        {posts.length ? (
          posts.map(post => (
            <li key={post.slug}>
              <Link to={`/blog/post/${post.slug}`}>
                {new Date(post.date).toISOString().slice(0, 10)}
                {" • "}
                {post.title}
              </Link>
            </li>
          ))
        ) : (
          <div className="none">{lang.empty}</div>
        )}
      </ul>
    </section>
  )
}