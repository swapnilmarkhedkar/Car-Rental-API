# Car-Rental-White-Panda
Node.js app for renting cars

Live : https://floating-retreat-50476.herokuapp.com/ 

Postman API Collection : https://www.getpostman.com/collections/2720e064a2d553028e28

Authentication has been done for Admin. Thus POST, PATCH and DELETE http requests will need auth token. Auth tokens are generated on signup and login

'isBooked' status of a car is displayed for a particular car at GET /cars/:id