FORMAT: 1A

# My Great API

This is the description of a nifty API.

## Authentication
*API NAME* uses JWT token authentication. You can obtain a token by using the
[Token][] resource. Once you have a token, include it in the `Authorization`
header of your requests, such as:

+ Request
	+ Headers

		Authorization: Bearer TOKEN_HERE

## Media Types
Where applicable this API uses the [HAL+JSON](https://github.com/mikekelly/hal_specification/blob/master/hal_specification.md) media-type to represent resources states and affordances.

## Error States
The common [HTTP Response Status Codes](https://github.com/for-GET/know-your-http-well/blob/master/status-codes.md) are used.

In addition, an `errors` property MAY be sent back in the response, such as:

	+ Response (application/hal+json)

		+ Body

			"errors": {
				"message": "Validation failed",
				"reasons": [
				{
					"field": "password",
					"message": "Required"
				},
				{
					"field": "email",
					"message": "Required"
				},
				{
					"field": "username",
					"message": "Required"
				}
				]
			}

# Group User and Token
Signing-up and signing-in.

## User [/users]
The User resource.

## Users [/users]
A Collection of users.

### Retrieve all users [GET]

+ Response 200

### Create a User [POST]
Creates a new User.

+ Response 201

## Tokens [/tokens]
The Token resource represents an authorization granted to the user.

+ Model (application/json)

	+ Body

		{
			"token": "abc"
		}

+ Request

	+ Body

		{
			"username": "foo",
			"password": "pwd"
		}

### Retrieve Authorization [GET]

+ Response 200
	[Tokens][]
