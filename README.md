# Node-auth-API
A basic node.js API for token based authentication management using jwt.


## Sample .env
create .env at root level with below params


```javascript
# development or production or testing
NODE_ENV=development

# mongodb connection url
MONGO_URL=

# jwt access-token key
ACCESS_TOKEN_KEY=

# jwt refresh token key
REFRESH_TOKEN_KEY=
```
    
## Docs
Start the server and negivate to /api-docs to access swagger docs


## Docker

Make sure you have installed docker and docker-compose before following below commands

#### Clone repo

```bash
  git clone https://github.com/shiven1703/Node-auth-API.git
```

#### Running docker-compose

```bash
  docker-compose up --build
```

#### Access API

```bash
  visit : http://localhost:4000/api-docs/
```

#### Stop containers

```bash
  Ctr + c

  OR

  docker-compose down 
```



#### Relauch containers

```bash
  docker-compose up -d
```
