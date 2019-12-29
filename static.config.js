// std (node.js)
import { promises as fs, read } from "fs"
import path from "path"

// 3p
import matter, { language } from "gray-matter"
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
  // return { metadata, body }
  return { metadata: { slug, ...metadata }, body }
}

export default {
  getRoutes: async ({ stage }) => {
    const dir = "public/blog/post"
    const slugs = await fs.readdir(dir)
    const posts = await Promise.all(slugs.map(slug => readPost(dir, slug)))

    return [
      // landing page
      {
        path: "/",
        template: "src/pages/index.js",
        getData: () => ({
          posts
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
          // XXX: quick and dirty hot reload for post content
          post: stage !== "dev" ? post : await readPost(dir, post.metadata.slug)
        })
      })),
      // blog posts archives
      ...config.languages.map(lang => ({
        path: `/blog/${lang.lang}/`,
        template: "src/pages/blog/archives.js",
        getData: async () => ({
          lang,
          posts: _.filter(post => post.metadata.lang === lang.lang)(posts)
        })
      }))
    ]
  },
  plugins: [
    "react-static-plugin-sass", // .scss
    "react-static-plugin-reach-router"
  ]
}
