/*
See:
  - Introduction to Atom:
    https://validator.w3.org/feed/docs/atom.html
  - How to make a good id in Atom:
    http://web.archive.org/web/20110514113830/http://diveintomark.org/archives/2004/05/28/howto-atom-id
*/

// std (node.js)
import { promises as fs } from "fs"
import path from "path"
import url from "url"

// 3p
import chalk from "chalk" // react-static dependency

const getTagURI = (url_, updated) => {
  const { host, pathname } = url.parse(url_)
  return `tag:${host},${updated.toISOString().split("T")[0]}:${pathname}`
}

const getFeedXML = config => feed => {
  const link = url.resolve(config.siteRoot, feed.path)
  const linkSelf = url.resolve(
    config.siteRoot,
    path.join(feed.path, "atom.xml")
  )
  return `
    <?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>${feed.title}</title>
      <link href="${link}"/>
      <link rel="self" href="${linkSelf}" />
      <updated>${feed.updated.toISOString()}</updated>
      <author>
        <name>${feed.author.name}</name>
      </author>
      <id>${getTagURI(link, feed.updated)}</id>
      ${feed.entries.map(getEntryXML(config)).join("")}
    </feed>
  `.trim()
}

const getEntryXML = config => entry => {
  const link = url.resolve(config.siteRoot, entry.link)
  return `
    <entry>
      <title>${entry.title}</title>
      <link href="${link}" />
      <id>${getTagURI(link, entry.updated)}</id>
      <updated>${entry.updated.toISOString()}</updated>
      <content src="${link}" />
    </entry>
  `
}

export default ({ getRSSFeeds }) => ({
  afterExport: async state => {
    const { config } = state
    const {
      paths: { DIST }
    } = config
    const feeds = await getRSSFeeds()
    await Promise.all(
      feeds.map(async feed => {
        const filename = path.join(feed.path, "atom.xml")
        console.log(`Generating ${filename}...`)
        await fs.writeFile(path.join(DIST, filename), getFeedXML(config)(feed))
        console.log(chalk.green(`[\u2713] ${filename} generated`))
      })
    )
  }
})
