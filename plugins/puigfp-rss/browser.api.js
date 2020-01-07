import React from "react"
import { Head } from "react-static"

export default ({ feedsHeadEntries: feeds }) => ({
  Root: PreviousRoot => ({ children, ...rest }) => {
    return (
      <PreviousRoot {...rest}>
        <Head>
          {feeds.map(({ path, title }) => (
            <link
              key={path}
              href={path}
              type="application/atom+xml"
              rel="alternate"
              title={title}
            />
          ))}
        </Head>
        {children}
      </PreviousRoot>
    )
  }
})
