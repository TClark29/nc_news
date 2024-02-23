# Northcoders News API

This is the backend for a news app/website called NC-news, hosted on https://nc-news-6wmp.onrender.com/.

Acceptable endpoints can be found at https://nc-news-6wmp.onrender.com/api or in the endpoints.json file. The API uses an MVC structure for CRUD operations.

Included is seeding data for a test database, and well as a larger dev database for development. There is a jest testing suite with husky installed, which will prevent commits on any failed tests. 

In order to use, you will require node v.21.5.0 and PSQL v14.10.

In order to run the file, fork and clone https://github.com/TClark29/nc_news, and then install node dependencies with npm install. Intructions on how to install psql depending on your system can be found here: https://www.postgresql.org/download/  

Next, .env files need to be created in the root directory. The test file should be called .evn.test and should include PGDATABASE=nc_news_test. The development database should be called .env.development and include PGDATABASE=nc_news. Both files should also include PGPASSWORD= with whatever your local PSQL password is if working on linux or WSL.

Databases should be set up running the script 'run setup-dbs'. This will also reset the DBs if they already exist. DBs can be seeded with 'npm run seed'. Tests automatically re-seed the test DB before each test.

In order to host the database in a production environment, an .env.production file must also be added to the root directory. This should include DATABASEURL= with the url of whevever you wish to host the DB. After this is pushed to the main branch, the script 'npm run seed-prod' will seed the production database with the dev DB. 





