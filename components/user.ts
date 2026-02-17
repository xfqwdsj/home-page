import Parse from "parse";

type ParseType = typeof Parse;

export async function getRoles(parse: ParseType, user: Parse.User) {
  const query = new parse.Query(parse.Role);
  query.equalTo("users", user);
  const roles = await query.find({
    sessionToken: user.getSessionToken() as string,
  });
  return roles.sort((a, b) => (a.get("order") as number) - (b.get("order") as number));
}

export async function parseRoles(parse: ParseType, user: Parse.User) {
  const roles = await getRoles(parse, user);
  return roles.map((role) => role.getName() as string);
}
