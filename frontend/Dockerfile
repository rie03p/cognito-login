FROM node:24-bookworm

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN corepack install

RUN pnpm install --frozen-lockfile

COPY . .

CMD ["pnpm", "dev", "--host"]
