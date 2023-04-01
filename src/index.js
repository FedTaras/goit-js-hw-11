import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const API_KEY = '34843730-197a34e2a316a24279cec26df';
const options =
  'image_type=photo&orientation=horizontal&safesearch=true&per_page=40';
axios.defaults.baseURL = 'https://pixabay.com/api/';

async function getImages(query, page) {
  const response = await axios.get(
    `?key=${API_KEY}&page=${page}&q=${query}&${options}`
  );
  return response;
}

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  buttonLoadMore: document.querySelector('.load-more'),
  divGallery: document.querySelector('.gallery'),
};

function createGallery(galleryItems) {
  const markup = galleryItems
    .map(galleryItems => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = galleryItems;
      return `
      <a class="gallery-item__link" href="${largeImageURL}">
      <div class="photo-card">
       <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes:</b> ${likes}
          </p>
          <p class="info-item">
            <b>Views: </b>${views}
          </p>
          <p class="info-item">
            <b>Comments: </b>${comments}
          </p>
          <p class="info-item">
            <b>Downloads: </b>${downloads}
          </p>
        </div>
      </div>
      </a>
      `;
    })
    .join('');

  refs.divGallery.insertAdjacentHTML('beforeend', markup);
}

refs.form.addEventListener('submit', onformRef);
let simpleLightBox;
let query = '';
let page = 1;

refs.buttonLoadMore.classList.add('hidden');

function onformRef(e) {
  e.preventDefault();

  query = refs.input.value.trim();
  refs.divGallery.innerHTML = '';
  refs.buttonLoadMore.classList.add('hidden');

  if (query === '') {
    Notiflix.Notify.failure('Erorr, input is empty.');
    return;
  }

  getImages(query, page)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        refs.buttonLoadMore.classList.add('hidden');
      } else {
        createGallery(data.hits);

        simpleLightBox = new SimpleLightbox('.gallery a', {
          captionDelay: 250,
        }).refresh();

        Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);

        if (data.totalHits > 40) {
          refs.buttonLoadMore.classList.remove('hidden');
        }
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      refs.form.reset();
    });
}

refs.buttonLoadMore.addEventListener('click', onLoadMoreBtn);

function onLoadMoreBtn() {
  page += 1;
  simpleLightBox.destroy();

  getImages(query, page)
    .then(({ data }) => {
      createGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();

      const totalPages = data.totalHits / 40;

      if (page === totalPages) {
        refs.buttonLoadMore.classList.add('hidden');
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => console.log(error));
}
