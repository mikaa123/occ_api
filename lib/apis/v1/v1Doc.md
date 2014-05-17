FORMAT: 1A

# My Great API
This is the description of a nifty API.

## Authentication
*API NAME* uses bearer JWT token authentication. All authenticated request must
provide a token in their payload.

## Media Types
Where applicable this API uses the [HAL+JSON](https://github.com/mikekelly/hal_specification/blob/master/hal_specification.md) media-type to represent resources states and affordances.

## Error States
The common [HTTP Response Status Codes](https://github.com/for-GET/know-your-http-well/blob/master/status-codes.md) are used.

In addition, an `errors` property MAY be sent back in the response.



# Group User and Token
User creation and authentication.

## Authorization [/authorization]
The Authorization resource represents an authorization granted to the user.

+ Model (application/json)

	+ Body

		{
			"token": "abc"
		}


### Retrieve Authorization [GET]
Returns a bearer token for the requesting user.

+ Request

	+ Body

		{
			"username": "foo",
			"password": "pwd"
		}

+ Response 200
	[Authorization][]

## User [/user/{id}]
The User resource.

+ Parameters
	+ id (string) ... ID of the User in the form of a hash

+ Model (application/hal+json)

	+ Body

		{
			"username": "foobar",
			"email": "some@email.com"
		}

## Users [/users]
A Collection of users.

### Create a User [POST]
To create a new User, provide a JSON hash with a *username*, *email* and *password*.

+ Request (application/json)
	{
		"username": "theusername",
		"email": "some@email.com",
		"password": "thepassword"
	}

+ Response 201

	[Authorization][]
