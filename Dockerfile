from node:22-alpine as builder

workdir /app

copy package*.json tsconfig.json ./
run npm run install

copy . .
run npm run build

from node:22-alpine as runner
workdir /app

copy --from=builder /app/node_modules ./node_modules

copy --from=builder /app/public ./public

copy --from=builder /app/.next ./next

expose 3000

CMD ["npm", "run", "start"]