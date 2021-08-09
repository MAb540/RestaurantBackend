# RestaurantBackend
This repository is a  backend of a Restaurant app  written in node Express and mongodb.


<h1>Getting Started</h1>

 1. <h2>Clone the repo using</h2>
   * git clone https://github.com/MAb540/RestaurantBackend


 2. <h2>Installation</h2>
  * Run npm install to install all project dependencies available in package.json file.

 3. <h2>Add your credentials in .env file at root directory</h2>
  * In .env file 
     1.  mongoUrl =    // Add your mongodb database connection URL here
     2.  secretKey =   // Secret key to be used in jwt encrypting jwt

   

 4. <h2>Development mode</h2>
  * Having everything installed run "npm run dev". This command will start your server using nodemon package as included in the package.json file.



 5. <h2>Features</h2>
  * You can Signup a user using username, and Password.
  * You can Login a user using username and password and user will be    authenticated using a jwt token. 
  * The app has two types of users one one will be admin and other will be simple user.
  * The app has different routes used to list Restaurant related things.
  * There are route for dishes, leaders, promotions and comments on dishes.
  * Admin can add dishes,promotions with their respective descriptions.
  * User can comments and can add dishes to their favrouties.
  * There are many more features in this project.
  
