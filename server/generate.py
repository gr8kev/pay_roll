import secrets

# Generate a random 32-byte (256-bit) secret and encode it in hexadecimal
jwt_secret = secrets.token_hex(32)
print(jwt_secret)