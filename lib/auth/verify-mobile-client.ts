export function verifyMobileClient(request: Request): Response | null {
  const authHeader = request.headers.get("Authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized: Missing or invalid token format",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    )
  }

  const token = authHeader.split(" ")[1]

  if (token !== process.env.MOBILE_API_SECRET) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: Invalid token" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    )
  }

  return null // Token is valid
}
