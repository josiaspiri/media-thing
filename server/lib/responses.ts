export const RESPONSES = {
  BAD_REQUEST: () => Response.json({ error: "Bad request." }, { status: 400 }),

  FORBIDDEN: () => Response.json({ error: "Forbidden." }, { status: 403 }),

  NOT_FOUND: () => Response.json({ error: "Not found." }, { status: 404 }),

  UNSATISFIABLE: (size: number) =>
    Response.json({ error: "Range unsatisfiable." }, {
      status: 416,
      headers: { "Content-Range": `bytes */${size}` },
    }),
} as const;
