const Metalsmith = require("metalsmith");
const fsMetadata = require("metalsmith-fs-metadata");
const path = require("metalsmith-path");
const buildInfo = require("./lib/metalsmith-build-info");
const envInfo = require("./lib/metalsmith-env-info");
const frontmatterFileLoader = require("metalsmith-frontmatter-file-loader");
const frontmatterRenderer = require("metalsmith-frontmatter-renderer");
const layouts = require("metalsmith-layouts");
const beautify = require("metalsmith-beautify");
const drafts = require("metalsmith-drafts");
const htmlMinifierOptimise = require("./lib/metalsmith-html-minifier-optimise");
const mapsiteCurrentenv = require("./lib/metalsmith-mapsite-currentenv");
const gravity = require("@buildit/gravity-ui-sass");
const fs = require("fs");

Metalsmith(__dirname)
  .source("./pages")
  .destination("./dist")
  .clean(false)
  .metadata({
    gravitySvgContents: fs.readFileSync(gravity.bldSvgSymbolsFilePath, "utf8")
  })
  .use(
    fsMetadata({
      config: "./config/site.json"
    })
  )
  .use(
    path({
      directoryIndex: "/index.html",
      extensions: [".html"]
    })
  )
  .use(buildInfo())
  .use(envInfo())
  .use(
    frontmatterFileLoader({
      key: "blocks-md",
      suppressNoFilesError: true
    })
  )
  .use(
    frontmatterRenderer({
      key: "blocks-md",
      out: "blocks",
      suppressNoFilesError: true
    })
  )
  .use(
    frontmatterFileLoader({
      key: "blocks-njk",
      suppressNoFilesError: true
    })
  )
  .use(
    frontmatterRenderer({
      key: "blocks-njk",
      out: "blocks",
      ext: "njk",
      suppressNoFilesError: true
    })
  )
  .use(layouts())
  .use(
    beautify({
      preserve_newlines: false
    })
  )
  .use(drafts())
  .use(
    htmlMinifierOptimise({
      minifierOptions: {
        removeComments: false
      }
    })
  )
  .use(
    mapsiteCurrentenv({
      omitIndex: true
    })
  )
  .build(function(err) {
    if (err) throw err;
    console.log("Metalsmith build complete!");
  });