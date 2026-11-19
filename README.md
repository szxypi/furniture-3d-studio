# furniture-3d-studio

furniture-3d-studio is a web app for designing 3D furniture in the browser.
It helps shoppers and designers choose a material, pick a color, and change the size of a furniture piece.
The 3D view updates at once.
Every model is built from basic Three.js shapes.
The app loads no model, texture, or HDR file.

## Features

- Catalog page with four furniture pieces: sofa, dining chair, coffee table, and bookshelf.
- Each catalog card shows a live 3D preview.
- Configurator page at `/configurator/[id]`.
- Four materials: fabric, leather, wood, and metal.
- Four color swatches for each material.
- Width, depth, and height sliders. The model rebuilds while you drag.
- Dimension labels in cm, drawn next to the model.
- Orbit camera. The camera cannot go below the floor.
- Contact shadow on the floor and a simple room as background.
- PNG screenshot export.
- Sample price that depends on material and volume. The price is not a real quote.
- Native Three.js page at `/vanilla`, with a comparison table for R3F and native code.
- Loading placeholder, WebGL error fallback with a retry button, and dark mode.

## Tech Stack

| Package | Version |
| --- | --- |
| Next.js (App Router) | 16.4.6 |
| React and React DOM | 19.3.1 |
| TypeScript | 5.9.3 |
| three | 0.187.0 |
| @react-three/fiber | 9.8.2 |
| @react-three/drei | 10.7.9 |

Styles use CSS Modules and CSS variables. The project has no UI framework.

## Getting Started

Use Node.js 20.9 or later.

1. Install the dependencies.

   ```bash
   npm install
   ```

2. Start the development server.

   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in a browser.

To make a production build, run these commands:

```bash
npm run build
npm run start
```

To check types, run `npm run typecheck`.

## Project Structure

```text
src/
  app/
    layout.tsx                    Root layout and metadata
    page.tsx                      Catalog page
    configurator/[id]/page.tsx    Configurator page (server component)
    vanilla/page.tsx              Native Three.js page and comparison table
  components/
    CatalogPreview.tsx            Loads the preview canvas on the client only
    PreviewCanvas.tsx             Small R3F canvas for a catalog card
    VanillaViewer.tsx             Native Three.js scene in useEffect
    furniture/
      FurnitureModel.tsx          Draws the part list with R3F and drei
      StudioLights.tsx            Local environment light made with Lightformer
    configurator/
      ConfiguratorShell.tsx       State, screenshot export, dynamic import of the canvas
      ConfiguratorCanvas.tsx      R3F scene: room, model, shadow, controls
      ControlPanel.tsx            Material, color, size, price, and export button
      DimensionLabels.tsx         Dimension lines and Html labels
      CanvasBoundary.tsx          Error boundary with retry
  lib/furniture/
    catalog.ts                    Furniture data, default sizes, size ranges
    materials.ts                  Material presets and surface parameters
    parts.ts                      Function that builds the part list for each furniture type
    geometry.ts                   Native Three.js geometry and mesh creation
    price.ts                      Sample price formula
```

## How It Works

### Procedural modeling

`buildParts(kind, dims)` in `src/lib/furniture/parts.ts` returns a list of parts.
Each part is a box or a cylinder.
A part has a position, a size, a bevel radius, and a role.
The unit is meter. The bottom of the furniture is at `y = 0`.
A sofa has a base, a seat, a back, two arms, and four legs.
A bookshelf adds one shelf for about every 36 cm of height.
Both the R3F page and the native page read this list.

### Material parameters

`src/lib/furniture/materials.ts` defines one preset for each material.
Every preset becomes a `MeshPhysicalMaterial`.
The presets differ in these parameters:

| Material | roughness | metalness | clearcoat | sheen |
| --- | --- | --- | --- | --- |
| Fabric | 0.95 | 0 | 0 | 1 |
| Leather | 0.5 | 0 | 0.35 | 0 |
| Wood | 0.62 | 0 | 0.1 | 0 |
| Metal | 0.28 | 1 | 0 | 0 |

The wood preset changes color only. It uses no texture file.
Parts with the `primary` role use the selected material and color.
Parts with the `accent` role, such as legs, use a fixed dark metal.

### Size rebuild

The size sliders change the `dims` state in `ConfiguratorShell`.
`FurnitureModel` calls `buildParts` again when a size changes.
R3F disposes the old geometry and creates the new one.
The part list also changes shape, not only scale. For example, the bookshelf gets more shelves when it is taller.
`DimensionLabels` draws the labels from the same `dims` value.

### Screenshot export

The Canvas uses `gl={{ preserveDrawingBuffer: true }}`.
`CaptureBridge` in `ConfiguratorCanvas.tsx` stores a capture function in a ref.
The function renders one frame and calls `gl.domElement.toDataURL('image/png')`.
The export button creates a temporary link and downloads the PNG.
The PNG does not include the Html dimension labels, because they are DOM elements.

### Lighting without external files

`Environment` with `Lightformer` children creates the reflection map on the GPU.
The app does not use `Environment preset`, because that option downloads an HDR file from a CDN.
The native page uses `RoomEnvironment` from the Three.js examples for the same purpose.

### R3F and native Three.js

| Task | R3F | Native Three.js |
| --- | --- | --- |
| Create the scene | `<Canvas>` | `new Scene`, `new PerspectiveCamera`, `new WebGLRenderer` |
| Add an object | JSX such as `<mesh>` | `new Mesh`, then `scene.add` |
| Render loop | Built in, `useFrame` for per-frame code | `renderer.setAnimationLoop` |
| Resize | Automatic | `resize` listener that you add and remove |
| Release resources | R3F disposes the objects that JSX creates | You call `dispose` in the `useEffect` cleanup |

`VanillaViewer.tsx` removes the `resize` listener and disposes the controls, geometries, materials, environment map, and renderer when the component unmounts.

## Roadmap: Rebuild with Blueprint3D

The next step is to move from single pieces to whole rooms.
The plan uses [Blueprint3D](https://github.com/furnishup/blueprint3d) as the base for floor plans and furniture placement.

### Upstream facts

These facts come from the GitHub repository and its `package.json`:

- The repository is `furnishup/blueprint3d`. It describes itself as "Build interior spaces in 3D".
- GitHub reports the license as MIT. The `package.json` file says `(MIT OR Apache-2.0)`.
- The repository is not archived. The last push was on 2021-01-20.
- The source is TypeScript. The model code has corner, wall, room, and floor plan classes.
- The dependencies are old: `three` `^0.69.0`, `jquery` `^2.1.3`, and `bootstrap` `^3.3.1`.
- The build uses `grunt` and `browserify`.
- The npm package `blueprint3d` is version `0.0.1-1`. Its last change was on 2022-04-12. Its metadata points to a different repository, `Ekki/blueprint3d`.

### Migration risk

This project uses `three` 0.187.0. Blueprint3D uses `three` 0.69.0.
The two versions are not compatible, so the project cannot import the upstream package.
The upstream project has had no push since 2021, so the project cannot expect fixes from it.

The plan handles the risk in two steps.
First, copy only the floor plan data model (corner, wall, and room) and its geometry math into this project, with the MIT notice.
Second, write the 3D room view and the 2D editor again with React, R3F, and the current `three`.
The project does not use the upstream jQuery and Bootstrap code.
If the copy takes too long, the fallback is a fork of Blueprint3D with an upgrade to current `three`.

### How it fits the current code

- Keep `src/lib/furniture/` and the configurator. They become the furniture catalog for the room editor.
- Blueprint3D concepts own the floor plan, the rooms, and the placement of items.
- A placed item stores a furniture id, material, color, size, position, and rotation. The part list from `buildParts` draws it.

### Tasks

- [ ] Verify the upstream license text and keep the MIT notice for every copied file.
- [ ] Port the corner, wall, and room data model to TypeScript modules with unit tests for the geometry math.
- [ ] Build a 2D floor plan editor to draw walls and rooms.
- [ ] Build a 3D room view in R3F that extrudes the walls from the floor plan.
- [ ] Place furniture from the catalog into the room with move and rotate controls.
- [ ] Save and load a room as JSON, and export a screenshot of the room.

## License

This project uses the MIT License. See `LICENSE`.
