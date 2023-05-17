import './css/styles.css';
/**
 * import library
 */
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const searchBox = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const name = searchBox.value.trim();

  if (name === '') {
    (countryList.innerHTML = ''), (countryInfo.innerHTML = '');
    return;
  }

  fetchCountries(name)
    .then(countries => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      if (countries.length === 1) {
        countryInfo.insertAdjacentHTML(
          'beforeend',
          createMarkupInfo(countries)
        );
      } else if (countries.length >= 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else {
        countryList.insertAdjacentHTML(
          'beforeend',
          createMarkupList(countries)
        );
      }
    })
    .catch(Notiflix.Notify.failure('Oops, there is no country with that name'));
}

function fetchCountries(name = '') {
  const BASE_URL = 'https://restcountries.com/v3.1/name';
  return fetch(
    `${BASE_URL}/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}

function createMarkupList(countries) {
  const markupList = countries
    .map(({ name, flags }) => {
      return `
    <li class="country-list-item">
      <img src="${flags.svg}" alt="flag" class="country-list-img" />
      <p class="country-list-text">${name.official}</p>
    </li>;
  `;
    })
    .join('');
}

function createMarkupInfo(countries) {
  const markupInfo = countries
    .map(({ name, capital, population, flags, languages }) => {
      return `<div class="country-flag">
        <img src="${flags.svg}" alt="flag" class="country-info-img" />
        <p class="country-info-text">${name.official}</p>
      </div>
          <ul class="country-info-list">
      <li class="country-info-item"><p class="country-info-text">Capital: ${capital}</p></li>
      <li class="country-info-item"><p class="country-info-text">Population: ${population}</p></li>
      <li class="country-info-item"><p class="country-info-text">Languages: ${languages}</p></li>
    </ul>
      `;
    })
    .join('');
}

// 2nd option
// const params = new URLSearchParams({
//   fields: name,
// });
// return fetch(`${BASE_URL}/all?${params}`);
