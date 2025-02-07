# OAuth 2.0 REST API

## Overview
A robust, TypeScript-based OAuth 2.0 implementation with comprehensive security features.

## Features
- Secure OAuth 2.0 Authorization Flow
- JWT Token Generation and Validation
- Environment-based Configuration
- Comprehensive Error Handling
- Detailed Logging
- Docker Containerization
- CI/CD with GitHub Actions
- Cloud Deployment Ready (Terraform)
- Monitoring Ready

## Prerequisites
- Node.js 18+
- Docker (optional)
- AWS Account (for cloud deployment)

## Local Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run server: `npm start`
5. Run development server: `npm run dev`

## Configuration
Create `.env` files for different environments:
- `.env.development`
- `.env.production`
- `.env.test`

### Environment Variables
- `PORT`: Server port
- `JWT_SECRET`: Secret key for token signing
- `TOKEN_EXPIRY`: Access token expiration time
- `LOG_LEVEL`: Logging verbosity
- `ENVIRONNEMENT`: Environment (development, production, test) for easy access

## Security Considerations
- Uses strong JWT signing
- Implements client validation
- Configurable token lifecycle
- Comprehensive error handling
- Rate Limiting and authMiddleware for protected routes

## Testing
Run test suite: `npm test`

## Deployment
1. Build Docker image: `docker build -t upfirstai_api_ts .`
2. Deploy using provided Terraform configurations

## Authentication Flow
1. Client requests authorization code
2. Validate client and redirect URI
3. Generate short-lived authorization code
4. Exchange code for access token
5. Validate and issue JWT token


### . Access the API

#### Authorization Endpoint
- URL: http://localhost:8080/api/oauth/authorize
- Method: GET
- Description: This endpoint handles the OAuth 2.0 authorization request with response_type=code. Upon successful authorization, the user is redirected to the specified redirect_uri with an appended code parameter.

```bash
GET http://localhost:8080/api/oauth/authorize?response_type=code&client_id=upfirst&redirect_uri=http://localhost:8081/process&state=SOME_STATE
```

#### Example Response:

- Status: 302 found
- Headers: Location: http://localhost:8081/process?code=SOME_CODE&state=SOME_STATE

#### Token Endpoint:

- URL: http://localhost:8080/api/oauth/token
- Method: POST
- Description: This endpoint exchanges the authorization code for an access token

#### Example Request:

```bash
POST http://localhost:8080/api/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&code=SOME_CODE&client_id=upfirst&redirect_uri=http://localhost:8081/process
```

#### Example Response:

```json
{
  "access_token": "SOME_JWT_ACCESS_TOKEN",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "SOME_REFRESH_TOKEN"
}
```

#### Hello Endpoint:

- URL: http://localhost:8080/api/hello
- Method: POST
- Description: This endpoint returns Hello ${name} if a valid access_token is provided

#### Example Request:

```bash
POST http://localhost:8080/api/hello
Content-Type: application/x-www-form-urlencoded

name=upfirst
```

#### Example Response:

```json
{
  "message": "Hello upfirst!",
  "client_id": "upfirst",
  "token_expiry_time": ,
}
```

## Contributing
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push and create pull request

## License
MIT License