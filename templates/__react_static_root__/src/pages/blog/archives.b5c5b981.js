(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{54:function(e,t,n){"use strict";n.r(t);var a=n(0),l=n.n(a),c=n(9),s=n(18);t.default=function(){var e=Object(c.useRouteData)(),t=e.lang,n=e.posts;return l.a.createElement("section",{className:"posts"},l.a.createElement("h2",null,t.archiveTitle),l.a.createElement("ul",null,n.length?n.map((function(e){return l.a.createElement("li",{key:e.slug},l.a.createElement(s.Link,{to:"/blog/post/".concat(e.slug,"/")},new Date(e.date).toISOString().slice(0,10)," • ",e.title))})):l.a.createElement("div",{className:"none"},t.empty)))}}}]);
//# sourceMappingURL=archives.b5c5b981.js.map