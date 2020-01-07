// std (node.js)
import { promises as fs } from "fs"
import path from "path"

// 3p
import matter from "gray-matter"
import _ from "lodash/fp"

// local
import config from "./config"

async function readPost(dir, slug) {
  // compute markdown file path
  const indexPath = path.join(dir, slug, "index.md")
  // read file content
  const indexContent = (await fs.readFile(indexPath)).toString()
  // parse yaml front-matter
  const { data: metadata, content: body } = matter(indexContent)
  // TODO: validate metadata fields
  // return { metadata, body }
  return { metadata: { slug, ...metadata }, body }
}

async function readPosts() {
  const dir = "public/blog/post"
  let slugs = await fs.readdir(dir, { withFileTypes: true })
  // filter out files
  slugs = slugs.filter(slug => slug.isDirectory())
  // read posts
  let posts = await Promise.all(slugs.map(slug => readPost(dir, slug.name)))
  posts.reverse()
  return posts
}

function getBlogRSSFeed({ path, title, posts }) {
  return {
    path,
    title,
    author: {
      name: "puigfp"
    },
    updated: _.flow(
      _.map(post => post.metadata.date),
      _.max
    )(posts),
    entries: posts.map(post => ({
      title: post.metadata.title,
      link: `/blog/post/${post.metadata.slug}`,
      updated: post.metadata.date
    }))
  }
}

async function getRSSFeeds() {
  const posts = await readPosts()
  return [
    getBlogRSSFeed({
      path: "/blog",
      title: config.blog.mainRssFeedTitle,
      posts
    }),
    ...config.blog.languages.map(({ lang, rssFeedTitle }) =>
      getBlogRSSFeed({
        path: `/blog/${lang}`,
        title: rssFeedTitle,
        posts: posts.filter(post => post.metadata.lang === lang)
      })
    )
  ]
}

const feedsHeadEntries = [
  { path: "/blog/atom.xml", title: config.blog.mainRssFeedTitle },
  ...config.blog.languages.map(({ lang, rssFeedTitle }) => ({
    path: `/blog/${lang}/atom.xml`,
    title: rssFeedTitle
  }))
]

export default {
  siteRoot: "https://puigfp.github.io/",
  stagingSiteRoot: "http://localhost:5000/",
  getRoutes: async ({ stage }) => {
    const posts = await readPosts()
    return [
      // landing page
      {
        path: "/",
        template: "src/pages/index.js",
        getData: () => ({
          postsMetadata: posts.map(post => post.metadata)
        })
      },
      // 404
      {
        path: "404",
        template: "src/pages/404.js"
      },
      // blog posts
      ...posts.map(post => ({
        path: `/blog/post/${post.metadata.slug}`,
        template: "src/pages/blog/post.js",
        getData: async () => ({
          // XXX: quick and dirty hot reload for post content in dev mode
          post:
            stage !== "dev"
              ? post
              : await readPost("public/blog/post", post.metadata.slug)
        })
      })),
      // blog posts archives
      ...config.blog.languages.map(lang => ({
        path: `/blog/${lang.lang}/`,
        template: "src/pages/blog/archives.js",
        getData: async () => ({
          lang,
          posts: posts
            .filter(post => post.metadata.lang === lang.lang)
            .map(post => post.metadata)
        })
      }))
    ]
  },
  plugins: [
    "react-static-plugin-sass",
    "react-static-plugin-reach-router",
    "react-static-plugin-sitemap",
    ["puigfp-rss", { getRSSFeeds, feedsHeadEntries }]
  ]
}
