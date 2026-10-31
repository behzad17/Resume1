# Homepage device scene

The change is isolated to index.html and assets/css/home-devices.css plus assets/js/home-devices.js. All other pages retain the existing design.

- WebGL2: procedural Three.js 0.180.0 laptop and phone, local canvas screen textures, no downloaded models.
- Without WebGL2 or with Save-Data: lightweight CSS perspective devices with pointer motion.
- Without JavaScript: the existing local hero illustration remains visible.
- Reduced motion: decorative motion stops. The visitor can also stop motion using the visible toggle (stored only for the current browser session).
- The CSS version was visually checked at desktop, 768px and 375px preview widths. WebGL rendering could not be visually checked because the test browser has no WebGL2 context.

## Return to the previous homepage

The pre-change homepage is available at index-classic.html (excluded from indexing). For a full rollback, restore index.html from commit a11148f36c72b0440976f531b44d188768cb47a1 and remove only the new home-devices.css, home-devices.js, index-classic.html and this note. No previous assets were deleted or edited.

The Three.js import is pinned to a jsDelivr URL. If it cannot load, the CSS scene is used. No service credentials are required.
