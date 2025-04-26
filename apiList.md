# DEVTinder APIs 
authRouter
- POST /signup
- POST /login
- POST /logout

profileRouter
- GET /profile
- PATCH /profile/edit
- PATCH /profile/password


# STATUS: ignore, interested, accepted, rejected
connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId


- GET /connections
- GET /requests/recieved
- GET /feed - gets you the profile of other users on platform



