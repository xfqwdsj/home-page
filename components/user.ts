import Parse from "parse/node";

export const getRoles = async (user: Parse.User) => {
  const query = new Parse.Query(Parse.Role);
  query.equalTo("users", user);
  const roles = await query.find({
    sessionToken: user.getSessionToken() as string,
  });
  return roles.sort((a, b) => (a.get("order") as number) - (b.get("order") as number));
};

export const parseRoles = (user: Parse.User) => getRoles(user).then((roles) => roles.map((role) => role.getName() as string));
