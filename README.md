# lotto-ui

Browser-only React application scaffolded with **Vite**, **Tailwind CSS v4**, and **shadcn/ui**.

## Stack

| Layer | Choice |
| --- | --- |
| UI runtime | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Component primitives | shadcn/ui |

## Constraints

- No backend
- No database
- No HTTP/API calls required by the application
- Production output is static browser assets only

## Commands

```bash
npm install
npm run dev
npm run build
npm run release
```

## Release packaging

`npm run release` does two things:

1. Builds the static site into `dist/`
2. Copies the browser-ready release into `release/browser/`

The project uses `vite-plugin-singlefile` to inline all JS and CSS assets into `index.html`. The Vite base path is set to `./`, and combined with inlining, this means `release/browser/index.html` can be opened directly in a browser (even via `file://` protocol) or deployed to any static host without requiring a backend.
