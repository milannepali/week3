# Authorization Rules

## Regular user

A regular user can:

- View cats and users.
- Update their own user information.
- Delete their own user account.
- Update cats that they own.
- Delete cats that they own.

A regular user cannot:

- Update or delete another user's information.
- Update or delete another user's cats.
- Change their own role to admin.

## Admin

An admin can:

- Update any user.
- Delete any user.
- Update any cat.
- Delete any cat.

## Authentication

Protected routes require a JWT token in the Authorization header:

Authorization: Bearer <token>
