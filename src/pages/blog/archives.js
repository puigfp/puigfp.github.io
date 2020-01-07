// 3p
import React from "react"
import { useRouteData } from "react-static"
import { Link } from "@reach/router"

export default () => {
  const { lang, posts } = useRouteData()
  return (
    <section className="posts">
      <h2>{lang.archiveTitle}</h2>
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
