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
- Cloud Deployment Ready

## Prerequisites
- Node.js 18+
- Docker (optional)
- AWS Account (for cloud deployment)

## Local Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`

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

## Security Considerations
- Uses strong JWT signing
- Implements client validation
- Configurable token lifecycle
- Comprehensive error handling

## Testing
Run test suite: `npm test`

## Deployment
1. Build Docker image: `docker build -t oauth-api .`
2. Deploy using provided Terraform configurations

## Authentication Flow
1. Client requests authorization code
2. Validate client and redirect URI
3. Generate short-lived authorization code
4. Exchange code for access token
5. Validate and issue JWT token

## Contributing
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push and create pull request

## License
MIT License