# Website deployment

The live site at https://twinthos.com is deployed from the `gh-pages` branch using `.github/workflows/deploy-pages.yml`. Pushes to that branch publish the static site. The workflow omits `_src/` and `_headers` from the website while retaining the build sources in the repository. This is a public repository, so files in `_src/` remain public on GitHub. Never put secrets there.

GitHub Pages does not apply the `_headers` file. To enforce HTTP security headers, configure them at a hosting provider or reverse proxy that controls responses. Do not assume that `_headers` is active on GitHub Pages.
