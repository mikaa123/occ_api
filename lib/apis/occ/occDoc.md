FORMAT: 1A

# Oodrive Computer Club API
This is the description of a nifty API.

## Authentication
*API NAME* uses bearer JWT token authentication. All authenticated request must
provide a token in their payload.

## Media Types
Where applicable this API uses the [HAL+JSON](https://github.com/mikekelly/hal_specification/blob/master/hal_specification.md) media-type to represent resources states and affordances.

## Error States
The common [HTTP Response Status Codes](https://github.com/for-GET/know-your-http-well/blob/master/status-codes.md) are used.

In addition, an `errors` property MAY be sent back in the response.



# Group Root

## API Root [/]
API entry point.

This resource offers and initial set of affordances.

### Retrieve the Entry Point [GET]

+ Response 200 (application/hal+json)
	{
		"_links": {
			"self": { "href": "/" },
			"users": { "href": "/users" },
			"tokens": { "href": "/tokens" }
		}
	}



# Group User and Authentication
User creation and authentication.

## Authorization [/authorization]
The Authorization resource represents an authorization granted to the user.
In order to get an authorization, you need to use **basic authentication**.

+ Model (application/json)

	{
		"token": "abc"
	}

### Create a token [GET]
Returns a bearer token for the requesting user. The token's lifespan is
30 minutes.

+ Request
	+ Headers

		 Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==

+ Response 200
	[Authorization][]

## User [/user/{id}]
The User resource.

+ Parameters
	+ id (string) ... ID of the User in the form of a hash

+ Model (application/hal+json)

	{
		"username": "foobar",
		"email": "some@email.com"
	}

### Retrieve a single User [GET]

+ Response 200

	[User][]


## Users [/users]
A Collection of users.

The Users resource has a `count` attribute that shows the number of users. In
addition, it **embeds** user resources. The embedded User resources are partial
representations. In order to get the full representation of an embedded resource,
follow the `self` link of the User you want.

+ Model (application/hal+json)

	+ Body

		{
			"count": 2,
			"_embedded": {
			  	"users": [
			  		{
						"user": "foo",
						"_links": {
							"self": {
								"href": "/user/536647f4ef1413d40c5acc73"
							}
						}
					},
			  		{
						"user": "bar",
						"_links": {
							"self": {
								"href": "/user/536b85de9c0096f904853ace"
							}
						}
					},
			  	]
			}
		}

### List all users [GET]

+ Response 200

	[Users][]

### Create a User [POST]
To create a new User, provide a JSON hash with a *username*, *email* and *password*.

+ Request (application/json)

	{
		"username": "theusername",
		"email": "some@email.com",
		"password": "thepassword"
	}

+ Response 201

	[User][]



# Group Issues and Talks

## Issue [/issues/{id}]
The Issue resource. It represent an **Oodrive Computer Club** session. In this model, an issue
is made of embedded **talks**.

+ Parameters
	+ id (string) ... ID of the Issue in the form of a hash

+ Model (application/hal+json)

	{
		"title": "OCC #4",
		"_embeded": {
			"talks": [{
				{
				    "speaker": "Alfred",
				    "summary": "A very interesting talk about coffee making.",
				    "_links": {
				        "self": {
				            "href": "/issues/536b85de9c0096f904853ace/536647f4ef1413d40c5acc73",
				            "issue": "/issues/536b85de9c0096f904853ace",
				            "speaker": "/users/536b85de9c0096f904853dzd"
				        }
				    }
				},
				{
				    "speaker": "James",
				    "summary": "Introducing the concepts behing 'coucou' driven development.",
				    "_links": {
				        "self": {
				            "href": "/issues/536b85de9c0096f904853ace/536647f4ef1413d40c5asdfsd",
				            "issue": "/issues/536b85de9c0096f904853acdc",
				            "speaker": "/users/536b85de9c0096f904853dssff"
				        }
				    }
				}
			}]
		}
	}

### Retrieve a sigle Issue [GET]

+ Response 200

	[Issue][]


## Issues Collection [/issues]
The Issues Collection Resource. It has a `count` attribute and embeds **issue** resources.

+ Model (application/hal+json)

	+ Body

		{
			"count": 1,
			"_embedded": {
				"issues": [
					{
						"title": "OCC #4",
						"_links": {
							"self": {
								"href": "/issue/536647f4ef1413d40c5acc73"
							}
						}
					}
				]
			}
		}

### List all issues [GET]

+ Response 200

	[Issues Collection][]

### Create an Issue [POST]
To create a new issue, provide a JSON hash with a `title`. Once the `issue` is created, you can
_PUT_ new talks in it.

+ Request (application/json)

	{
		"title": "OCC #4"
	}

+ Response 201

	[Issue][]


## Talk [/issues/{issueId}/talks/{talkId}]
A Talk resource.

+ Parameters
	+ issueId (string) ... ID of the Issue in the form of a hash
	+ talkId (string) ... ID of the talk in the form of a hash

+ Model (application/hal+json)

	{
		"speaker": "Alfred",
		"summary": "A very interesting talk about coffee making.",
		"_links": {
			"self": {
				"href": "/issues/536b85de9c0096f904853ace/536647f4ef1413d40c5acc73",
				"issue": "/issues/536b85de9c0096f904853ace"
			}
		}
	}

### View a single talk [GET]

+ Response 200

	[Talk][]


## Talks Collection [/issues/{issueId}/talks]
Collection of talks in the given issue.

+ Parameters
	+ issueId (string) ... ID of the Issue in the form of a hash

### Create a new talk [POST]
Creates a new talk in the `issueId`'s issue.

+ Request (application/json)

	{
		"speaker": "Alfred",
		"summary": "A very interesting talk about coffee making."
	}

+ Response 201

	[Talk][]
