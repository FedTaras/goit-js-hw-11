const BASE_URL =
  'https://pixabay.com/api/?key=34843730-197a34e2a316a24279cec26df&${options}';

const options =
  'q=${термін для пошуку}&image_type=photo&orientation=horizontal&safesearch=true';

// API key 34843730-197a34e2a316a24279cec26df
// необхідні властивості:
// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.
