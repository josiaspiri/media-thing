export const RESPONSES = {
  UNSATISFIABLE: (totalSize?: number) => {
    const headers = totalSize !== undefined
      ? { "Content-Range": `bytes */${totalSize}` }
      : undefined;

    return Response.json({ error: "Range unsatisfiable." }, {
      status: 416,
      headers,
    });
  },

  NOT_FOUND: () => Response.json({ error: "File not found." }, { status: 404 }),

  FORBIDDEN: () => Response.json({ error: "Forbidden." }, { status: 403 }),
} as const;
