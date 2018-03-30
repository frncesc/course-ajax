(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    function addImage(data) {
        console.log(data);
        if (data && data.results && data.results.length > 0) {
            const firstImage = data.results[0];
            const htmlContent = `<figure>
            <img src="${firstImage.urls.regular}" alt="${firstImage.description}">
            <figcaption>"${searchedForText}" by ${firstImage.user.name} (${firstImage.photo_tags.map(p => p.title).join(', ')})</figcaption>
          </figure>`;
            responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        } else
            handleError('No images available');
    }

    function addArticles(data) {
        console.log(data);
        let htmlContent = '';
        if (data && data.response && data.response.docs) {
            htmlContent = '<ul>' + data.response.docs.map(doc => `<li class="article">
          <h2><a href="${doc.web_url}">${doc.headline.main}</a></h2>
          <p>${doc.snippet}</p>
          </li>`).join(' ') + '</ul>';
        } else
            handleError('No articles available');
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function handleError(err) {
        const htmlContent = `<div class="error-no-articles">${err}</div>`;
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function parseResponse(response) {
        if (!response.ok)
            throw new Exception('Invalid request!');
        return response.json();
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        console.log(`Searching for: "${searchedForText}"`);

        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
            headers: {
                Authorization: 'Client-ID cd198d361bf8bb315ed9684e436a15f0915b2fe370e327654ae952e91b15218e',
            },
        })
            .then(parseResponse)
            .then(addImage)
            .catch(handleError);

        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=2e13c3374c2040c4b2ae1070fbc1aaa9`)
            .then(parseResponse)
            .then(addArticles)
            .catch(handleError);

    });
})();
