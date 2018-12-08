FROM node:10

# Create app directory
WORKDIR /srv

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Copy app source
COPY . .

ENTRYPOINT [ "npm", "start" ]