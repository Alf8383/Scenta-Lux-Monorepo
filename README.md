# Scenta Lux

Monorepo del sistema Scenta Lux: backend en Spring Boot y frontend en Next.js.

## Estructura

```text
backend/   API REST, seguridad JWT, persistencia MySQL y carga de archivos
frontend/  Aplicación web Next.js para catálogo, carrito, checkout y panel admin
```

## Requisitos

- Java 21
- Maven Wrapper incluido en `backend/`
- Node.js 20 o superior
- MySQL 8, o Docker para levantar la base con `docker-compose`

## Backend

```bash
cd backend
./mvnw spring-boot:run
```

En Windows:

```bash
cd backend
mvnw.cmd spring-boot:run
```

La API usa el puerto `9090` por defecto. Las variables principales son:

```bash
PORT=9090
DATABASE_URL=jdbc:mysql://localhost:3306/scenta_lux_BD
MYSQLUSER=root
MYSQLPASSWORD=
JWT_SECRET=
FILE_UPLOAD_DIR=uploads
```

Tambien puedes levantar MySQL y API con Docker:

```bash
cd backend
docker compose up --build
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicacion web usa el puerto `9002` por defecto.

Configura Firebase en `frontend/.env.local` si vas a usar la integracion del frontend:

```bash
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
```

## Flujo local recomendado

1. Levanta MySQL y backend desde `backend/`.
2. Levanta el frontend desde `frontend/`.
3. Abre `http://localhost:9002` para usar la tienda.
