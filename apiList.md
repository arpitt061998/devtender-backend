# DEVTinder APIs 
authRouter
- POST /signup
- POST /login
- POST /logout

# profileRouter
- GET /profile
- PATCH /profile/edit
- PATCH /profile/password

# STATUS: ignore, interested, accepted, rejected
connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

# userrouter
- GET /user/connections
- GET /user/requests
- GET /user/feed - gets you the profile of other users on platform

- pagination
/ feed?page=1&limit=10 => 1-10  => mongo .skip(0).limit(10)
/ feed?page=2&limit=10 => 11-20 => mongo .skip(0).limit(10)





