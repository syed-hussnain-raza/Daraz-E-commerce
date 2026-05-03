# Daraz-E-Commerce

Daraz.pk clone built as part of training at **Hazelsoft**.

## Author

**Syed Muhammad Hussnain Raza**

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Data:** JSON (served via REST API)

## Project Structure

```
DARAZ-E-COMMERCE/
  ├── assets/        # Images, icons, banners
  ├── js/
  │     ├── components/   # UI renderers
  │     ├── pages/        # Page orchestrators
  │     ├── services/     # API calls
  │     └── utils.js
  ├── styles/        # CSS files
  ├── views/         # HTML pages
  └── server/        # Express server
        ├── controllers/
        ├── routes/
        └── data/
```

## Features

- Hero carousel with auto-play
- Flash Sale section
- Categories grid
- Just For You infinite scroll
- Product detail page with image zoom
- Ratings & Reviews
- Login Modal
- Responsive design
- Mobile drawer navigation

## Getting Started

### Install dependencies

```bash
npm install
```

### Run server

```bash
npm run dev
```

### Open

```
views/main.html
views/product.html
```

> Make sure server is running before opening the frontend.

## API Endpoints

| Method | Endpoint          | Description    |
| ------ | ----------------- | -------------- |
| GET    | /api/header       | Header data    |
| GET    | /api/footer       | Footer data    |
| GET    | /api/main         | Main page data |
| GET    | /api/products     | All products   |
| GET    | /api/products/:id | Single product |
