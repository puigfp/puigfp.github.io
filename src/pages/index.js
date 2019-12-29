// 3p
import React from "react"
import { useRouteData } from "react-static"
import { Link } from "@reach/router"
import _ from "lodash/fp"

// local
import config from "../../config"

const PostsList = ({ lang, posts }) => {
  return (
    <section className="posts">
      <h2>{lang.latest_title}</h2>
      <ul>
        {posts ? (
          posts.slice(0, 10).map(post => (
            <li key={post.metadata.slug}>
              <Link to={`/blog/post/${post.metadata.slug}`}>
                {post.metadata.title}
              </Link>
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
  const postsByLanguage = _.groupBy(post => post.metadata.lang)(posts)
  return config.languages.map(lang => (
    <PostsList key={lang.lang} lang={lang} posts={postsByLanguage[lang.lang]} />
  ))
}
