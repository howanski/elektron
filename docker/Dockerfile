FROM node:22-alpine
RUN apk add vim git zip flatpak-builder elfutils openssh
COPY run.sh /
ENTRYPOINT ["/run.sh"]
