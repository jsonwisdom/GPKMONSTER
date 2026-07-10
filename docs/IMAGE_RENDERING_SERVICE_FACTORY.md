# Image Rendering Service Factory

This branch defines the reusable rendering engine. It is not a character, card, or individual image.

## Architecture

```text
IMAGE_RENDERING_SERVICE_FACTORY
  ├── standing satire constitution
  ├── generic render-brief schema
  ├── prompt compiler
  └── reusable packaging workflow

ASSET_PROJECTS
  ├── Checkmate Chad
  ├── future character A
  └── future lesson pack B
```

Each asset supplies only its own render brief and image. The factory supplies persistent constitutional instructions, prompt compilation, hashing, and artifact packaging.

## Boundary

- No character is the root of the factory.
- Checkmate Chad is one downstream asset only.
- The factory does not itself generate or claim ownership of an image.
- The factory does not guarantee fair use or override platform safeguards.
- `AUTHORITY = FALSE`.
