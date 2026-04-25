export const RESPONSES = {
  UNSATISFIABLE: (totalSize: number) =>
    Response.json({ error: "Range unsatisfiable." }, {
      status: 416,
      headers: { "Content-Range": `bytes */${totalSize}` },
    }),

  NOT_FOUND: () => Response.json({ error: "File not found." }, { status: 404 }),

  FORBIDDEN: () => Response.json({ error: "Forbidden." }, { status: 403 }),
} as const;
