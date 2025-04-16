# PRUEBA JR BACKEND DEVELOPER - VOLT

Esta es una API RESTful construida con **Node.js**, **Express** y **MySQL**, diseñada para gestionar libros y sus autores. Permite realizar operaciones CRUD sobre los libros, agruparlos por década y obtener datos de autores desde la [API de Open Library](https://openlibrary.org/developers/api).

---

## Funcionalidades

- Obtener todos los libros
- Obtener libros agrupados por década
- Obtener un libro específico por ID
- Crear, actualizar y eliminar libros
- Buscar autores por nombre usando Open Library
- Obtener detalles de libros junto con los datos de autor desde Open Library

---

## Tecnologías Utilizadas

- Node.js
- Express.js
- MySQL
- [Open Library API](https://openlibrary.org/developers/api)
- REST Client Extension para pruebas (`test/testApi.rest`)

---

## Estructura del Proyecto

```
.
├── index.js                 # Punto de entrada principal e inicialización de la base de datos
├── db.js                   # Conexión a la base de datos
├── src/
│   ├── controllers/
│   │   ├── booksController.js
│   │   └── authorsController.js
│   ├── routes/
│   │   ├── booksRoutes.js
│   │   └── authorsRoutes.js
│   ├── test/
│       └── testApi.rest       # Archivo para pruebas con REST Client
└── package.json
```

---

## Instrucciones para Ejecutar

### 1. Clona el repositorio

```bash
git clone https://github.com/mateouribe/volt_exam.git
cd books-api
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura tu base de datos MySQL

Asegúrate de tener una base de datos MySQL corriendo. Luego crea un archivo `.env` en la raíz del proyecto (o configura directamente en `db.js`):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=books_db
PORT=1515
```

### 4. Ejecuta el servidor

```bash
npm run dev
```

El servidor se ejecutará en: [http://localhost:1515](http://localhost:1515)

---

## 📬 Endpoints Disponibles

### Raíz

- `GET /` – Mensaje de bienvenida

### Libros

- `GET /books` – Obtener todos los libros
- `GET /books/:id` – Obtener libro por ID
- `GET /books/grouped` – Obtener libros agrupados por década
- `GET /books/authors_data` – Obtener libros con datos de autor desde Open Library
- `POST /books` – Crear un nuevo libro
- `PUT /books/:id` – Actualizar un libro
- `DELETE /books/:id` – Eliminar un libro

### Autores

- `GET /authors?search=Nombre` – Buscar autores por nombre (Open Library)

---

### Pruebas de la API

- 1. Puedes usar **POSTMAN** (Collección ya compartida via email), sugiero seguir instrucciones adjuntas.
- 2. Puedes usar la extensión **REST Client** en VS Code con el archivo `test/testApi.rest` incluido en el proyecto.
