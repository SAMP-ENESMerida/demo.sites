# SAMP demo site

Static GitHub Pages landing page for the SAMP Gradio demo.

This repository does **not** run the Gradio app. It only provides a public entry page with a button pointing to the temporary Gradio URL running on the workstation.

## Quick start

1. The site should become available at:

```text
https://samp-enesmerida.github.io/demo.sites/
```

## Updating the current Gradio link

When the workstation generates a new `*.gradio.live` link, update `demo-config.json`, then commit and push.

Do not put credentials, private files, model weights, client images, videos, or generated outputs in this repository.
