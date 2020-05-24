// 3p
import React from "react";
import { useRouteData } from "react-static";
import { Link } from "@reach/router";

// local
import config from "../../config";

const PostsList = ({ lang, postsMetadata }) => {
  return (
    <section className="posts">
      <h2>{lang.latestTitle}</h2>
      <ul>
        {postsMetadata ? (
          postsMetadata.slice(0, 10).map((postMetadata) => (
            <li key={postMetadata.slug}>
              <Link to={`/blog/post/${postMetadata.slug}/`}>
                {postMetadata.title}
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
        <a href={`/blog/${lang.lang}/atom.xml`}>RSS</a>
      </div>
    </section>
  );
};

export default () => {
  const { postsMetadata } = useRouteData();
  return config.blog.languages.map((lang) => (
    <PostsList
      key={lang.lang}
      lang={lang}
      postsMetadata={postsMetadata.filter(
        (postMetadata) => postMetadata.lang === lang.lang
      )}
    />
  ));
};
