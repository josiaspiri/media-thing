export const RESPONSES = {
  UNSATISFIABLE: (size: number) =>
    Response.json({ error: "Range unsatisfiable." }, {
      status: 416,
      headers: { "Content-Range": `bytes */${size}` },
    }),

  NOT_FOUND: () => Response.json({ error: "Not found." }, { status: 404 }),

  FORBIDDEN: () => Response.json({ error: "Forbidden." }, { status: 403 }),
} as const;
