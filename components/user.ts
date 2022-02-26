import { User, Role } from 'leancloud-storage';

export const getRoles = (promise: Promise<User>): Promise<Array<Role>> =>
  promise
    .then((user) => user.getRoles())
    .then((roles) =>
      roles.sort(
        (a, b) => (a.get('order') as number) - (b.get('order') as number)
      )
    );

export const parseRoles = (
  promise: Promise<User>
): Promise<Array<string>> =>
  getRoles(promise).then((roles) => roles.map((role) => role.getName()));
