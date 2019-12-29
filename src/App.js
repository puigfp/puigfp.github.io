// 3p
import React from "react"
import { Root, Routes } from "react-static"
import { Link } from "@reach/router"

// local
import "./style/style.scss"

export default () => {
  return (
    <Root>
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
