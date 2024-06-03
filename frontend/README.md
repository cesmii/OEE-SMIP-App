# OEE SMIP App Frontend

This directory contains the frontend browser code for the OEE SMIP Web Application. This application uses Vue (with Nuxt and Vuetify) for its frontend framework. The application use [Bun](https://bun.sh/) for dependency management and runtime execution.

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Development

### Setup

Make sure to install the dependencies:

```bash
bun install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
bun run dev
```

## Deployment

This application is intended to be deployed using [Docker](#docker). If this isn't possible or desireable, see the [Manual](#manual) deployment instructions.

### Docker

The `Dockerfile` for this application Docker image is in the `frontend` directory. You can either build manually, or use a utility script in the `scripts` directory:

```sh
# Change into the `frontend` directory, which contains the web application.
cd frontend

# Build the Docker image:
docker build --tag oee-smip-app:<version tag> .
# OR
./scripts/build-docker.sh
```

After words the image can be run using the `docker` command:

```sh
# Run the application in a container, forwarding host port 3000 to the server running on port 3000.
docker run -p 3000:3000 oee-smip-app:<version tag>
```

#### Deploying on Other Machines

If you can't or don't want to build the Docker image on the same machine you wish to deploy/run it on, you can:

1. build the image as above on the build machine,
2. save the built image to a file on the build machine,
3. transfer the file over to the deployment machine,
4. load the image file into Docker on the deployment machine, and
5. run the image as above on the deployment machine.

```sh
# Save image to file, compressing it to save space.
# This may take a minute...
docker save oee-smip-app:<version-tag> | gzip > oee-smip-app.tar.gz

# ...transfer to deployment machine, using tools like `scp`, `sftp`, or other file transfer software...

# Load the image on the deployment machine.
docker load -i oee-smip-app.tar.gz
```

### Manual

Manually build the application for production:

```bash
bun run build
```

Locally run the production build:

```bash
bun run start
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
