export function GET(): Response {
  return Response.json({
    status: "ok",
    service: "gitbutler-docs",
    timestamp: new Date().toISOString()
  })
}
