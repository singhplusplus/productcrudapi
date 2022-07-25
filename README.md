# Product Management API - Secured API for CRUD operations on product

## Requirement
1) Admin Login by email and alpha-numeric password, length should be 8
2) Can add or upload products via excel
3) Edit product
4) Delete product
5) List product and
- Export them in excel and pdf
- Search by date range
- Search by product name and category
6) Show weather forcast of next 24 hours. There should be a field to enter city name.
https://www.weatherapi.com/

Note: Each field of every form is mandatory

## Implementation details/features:
- Passport JWT used for authentication. private and protected api routes.
- Moment.js used for date range based search api.
- Mongoose used as ORM

## Installation
1) clone both the repositories
- https://github.com/singhplusplus/productcrudclient
- https://github.com/singhplusplus/productcrudapi
2) run - npm install in both the projects
3) run - npm start in both
4) make sure the mongod service is up and running
5) update appconstants.js file for db and jwt based configuration.
