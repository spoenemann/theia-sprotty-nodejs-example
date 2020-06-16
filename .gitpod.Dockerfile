FROM gitpod/workspace-full:latest

USER root
RUN apt-get update \
    && apt-get install -y libx11-dev libxkbfile-dev
