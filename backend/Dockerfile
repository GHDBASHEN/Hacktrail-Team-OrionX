# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package files and install dependencies
# This uses your existing package.json which includes express, mysql2, and dotenv
COPY package*.json ./
RUN npm install --production

# Copy the rest of your backend source code
COPY . .

# Expose the port your server listens on (defined as 8000 in your server.js)
EXPOSE 8000

# Start the server using your start script
CMD ["npm", "start"]
