## Authentication using Express , Nodejs and Mongoose

### Features

- Username and password login endpoints
- For Security Password is Hashed using [bcrypt](https://www.npmjs.com/package/bcrypt "bcrypt")
- Send OTP to Email for Password Reset powered by [nodemailer](https://www.npmjs.com/package/nodemailer "nodemailer")
- Update Password With OTP

#### Clone the repo using git
* `git clone https://github.com/syntaxhacker/backendAuthApi`
* `cd backendAuthApi`
* `npm i`

#### Important!

create a config directory and `configs.env file` inside that
copy this to your file and replace the **mongodb uri** with your database uri , **gmail address** and **gmail password** for sending OTP to emails .

Follow this [tutorial](https://mongoosejs.com/docs/connections.html "tutorial") if you dont know how to connect mongoose with mongoDB.

```javascript
//configs.env
MONGO_URI = mongodburi;
SENDER_EMAIL = "mail@mail.com";
SENDER_PASS = "mailpassword";
PORT = 8080;
```

now our file structure should look like this 👇👇

```bash
.
├── config
│   └── configs.env
├── .gitignore
├── models
│   └── user.model.js
├── package.json
├── package-lock.json
├── README.md
├── routes
│   └── authRouter.js
├── server.js
└── views
    └── index.ejs

```

##### Start the Server using
`npm run dev`

### Api endpoints

endpoint | Request Method | Usage
------------- | ------------- |-------------
host/auth/login | POST | {"username":"user1","password":"pass"}
host/auth/signup | POST | {"username":"user1","password":"pass"}
host/auth/sendotp | POST |{"username":"user1","password":"pass","email":"yourmail@gmail.com"}
host/auth/forgot | POST | {"username":"userone","password":"password","newpass":"newpassword","recievedOtp":"1203012"}
host/users/ | GET |

Here `host` format should be

> yourwebsite.com:port

##### Forgot password ?
* Use `auth/sendotp` route to send your Email with valid username and password.
* Use `auth/forgot` route and send in recieved OTP along with new password and old credentials.
