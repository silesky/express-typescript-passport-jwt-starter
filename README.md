# Development
### Install dependencies
```
npm install
```

## run mongo via docker and start app
###
```
npm run dev
```
## Registering
```sh
curl --location --request POST 'http://localhost:4000/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userName": "MyNewUser",
    "password": "123456"
}'
```

## Logging In and Fetching Token
```sh
curl --location --request POST 'http://localhost:4000/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userName": "Admin",
    "password": "123456"
}'
```
### Get User By ID
```sh
curl --location --request GET 'http://localhost:4000/user/61ef1a7eef3a61bd3a51602e' \
--header 'Authorization: Bearer **INSERT_TOKEN_HERE**' \
```

### Update User By ID
```sh
curl --location --request PATCH 'http://localhost:4000/user/61ef1a7eef3a61bd3a51602e' \
--header 'Authorization: Bearer **INSERT_TOKEN_HERE**' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userName": "newName"
}'
```

### Delete User By ID
```sh
curl --location --request GET 'http://localhost:4000/user/61ef1a7eef3a61bd3a51602e' \
--header 'Authorization: Bearer **INSERT_TOKEN_HERE**' \
```



# Existing Users
- Supervisor/123456
- Admin/123456
- Employee/123456