// 3p
import React from "react"
import { Root, Head, Routes } from "react-static"
import { Link } from "@reach/router"
import "normalize.css"

// local
import "./style/style.scss"

export default () => {
  return (
    <Root>
      <Head>
        <title>puigfp</title>
      </Head>
      <header>
        <div className="site-title">
          <h1>
            <Link to="/">puigfp</Link>
          </h1>
          <div className="quote">
            A compilation of the rabbit holes I fall into
          </div>
        </div>
        <nav>
          <a href="https://github.com/puigfp">Github</a>
          {" / "}
          <Link to="/">About</Link>
          <code>{"  // TODO"}</code>
        </nav>
      </header>

      <React.Suspense fallback={<em>Loading...</em>}>
        <Routes />
      </React.Suspense>
    </Root>
  )
}
