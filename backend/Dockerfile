# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Install TypeScript globally
RUN npm install -g ts-node typescript

# Expose the port the app runs on
EXPOSE 8083

# Run the seed script and then start the app
CMD ["sh", "-c", "npm run seed && npm run dev"]