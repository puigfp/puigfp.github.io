// 3p
import React from "react"
import { useRouteData } from "react-static"
import { Link } from "@reach/router"
import groupBy from "lodash/fp/groupBy"

// local
import config from "../../config"

const PostsList = ({ lang, posts }) => {
  return (
    <section className="posts">
      <h2>{lang.latest_title}</h2>
      <ul>
        {posts ? (
          posts.slice(0, 10).map(post => (
            <li key={post.slug}>
              <Link to={`/blog/post/${post.slug}`}>{post.title}</Link>
            </li>
          ))
        ) : (
          <div className="none">{lang.empty}</div>
        )}
      </ul>
      <div className="archives-nav">
        <Link to={`/blog/${lang.lang}/`}>Archives</Link>
        {" / "}
        <a href={`/blog/${lang.lang}/index.xml`}>RSS</a>
      </div>
    </section>
  )
}

export default () => {
  const { posts } = useRouteData()
  const postsByLanguage = groupBy(post => post.lang)(posts)
  return config.languages.map(lang => (
    <PostsList key={lang.lang} lang={lang} posts={postsByLanguage[lang.lang]} />
  ))
}
