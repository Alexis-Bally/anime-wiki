const containerAllAnimes = document.querySelector('#container')
const divAllAnimes = document.querySelector('#allAnimes')
const divAnimes = document.querySelector('#anime')
const rightbutton = document.querySelector('#rightbutton')
const leftbutton = document.querySelector('#leftbutton')
const menu = document.querySelector('.menu')
let pagenumber = 1

function getAnimes() {

    divAllAnimes.innerHTML = ''

    fetch('https://api.jikan.moe/v4/anime?page=1&limit=25&type=tv&sfw=false')
    .then(response => response.json())
    .then(response => {

        console.log(response.data)
        response.data.forEach(anime => {

            divAllAnimes.innerHTML += `
            <div class="divEachAnime" data-id=${anime.mal_id}>
                <img src="${anime.images.webp.image_url}">
                <div class="text">
                    <h3>Title of the anime : </h3>
                    <h2>${anime.title}</h2>
                    <h3>Title in japanese : </h3>
                    <h2>${anime.title_japanese}</h2>
                </div>
            </div>
            `
        })

        clickAnime()
    })

    changeGenre()

    rightButton()

    leftButton()

    returnpage1()

}


function clickAnime() {

    document.querySelectorAll('.divEachAnime').forEach(element => {

        element.addEventListener('click', () => {

            var animeId = element.dataset.id
            divAnimes.innerHTML = ''

            fetch('https://api.jikan.moe/v4/anime/' + animeId)
            .then(response => response.json())
            .then(response => {

                containerAllAnimes.style.display = 'none'
                menu.style.display = 'none'

                divAnimes.innerHTML += `
                <div class="infosAnime">
                    <div class="image">
                        <img class="imgAnime" src="${response.data.images.webp.image_url}">
                    </div>
                    <div class="textcontainer">
                        <div class="text">
                            <h3>Title of the anime : </h3>
                            <h2 id="animeTitle">${response.data.title}</h2>
                            <h3>Title in japanese : </h3>
                            <h2>${response.data.title_japanese}</h2>
                        </div>
                        <div class="episodes">
                            <p>Number of episodes : ${response.data.episodes}</p>
                        </div>
                        <div class="synopsis">
                            <p>Synopsis : ${response.data.synopsis}</p>
                        </div>
                    </div>
                </div>
                `

                var animeName = response.data.title

                fetch('https://animechan.vercel.app/api/quotes/anime?title=' + animeName)
                .then(response => response.json())
                .then(response => {

                    const divquote = document.createElement('div')
                    divquote.classList.add('divquote')

                    const quotetitle = document.createElement('h2')
                    quotetitle.innerHTML = 'Quotes from the anime :'
                    divquote.appendChild(quotetitle)

                    response.forEach(anime => {

                        const divcontainer = document.createElement('div')
                        const textquote = document.createElement('p')
                        const characterquote = document.createElement('h3')

                        divcontainer.classList.add('divcontainer')
                        characterquote.classList.add('characterquote')

                        characterquote.innerHTML = anime.character
                        textquote.innerHTML = anime.quote

                        divcontainer.appendChild(characterquote)
                        divcontainer.appendChild(textquote)
                        divquote.appendChild(divcontainer)
                        divAnimes.appendChild(divquote)
                    })
                })
            })
        })
    })
}


function rightButton() {

    rightbutton.addEventListener('click', () => {

        let id = document.querySelector('#genres').value

        if(pagenumber < 324) {
            pagenumber += 1;
        } else {
            pagenumber = 1
        }
        console.log(pagenumber)

        divAllAnimes.innerHTML = ''

        fetch('https://api.jikan.moe/v4/anime?page=' + pagenumber + '&limit=25&type=tv&sfw=false&genres=' + id)
        .then(response => response.json())
        .then(response => {

            // if(response.pagination.has_next_page == true) {
            //     pagenumber += 1;
            // } else {
            //     pagenumber = 1
            // }

            if(response.data.length < 1) {
                document.querySelector('#errorMessage').innerHTML = `
                <h2>There are no more Animes of this genre</h2>
                `
            }

            console.log(response.data)
            response.data.forEach(anime => {

                divAllAnimes.innerHTML += `
                <div class="divEachAnime" data-id=${anime.mal_id}>
                    <img src="${anime.images.webp.image_url}">
                    <div class="text">
                        <h3>Title of the anime : </h3>
                        <h2>${anime.title}</h2>
                        <h3>Title in japanese : </h3>
                        <h2>${anime.title_japanese}</h2>
                    </div>
                </div>
                `
            })
            clickAnime()
        })
    })
}


function leftButton() {

    leftbutton.addEventListener('click', () => {

        let id = document.querySelector('#genres').value

        if(pagenumber > 1) {
            pagenumber -= 1;
        } else {
            pagenumber = 324
        }
        console.log(pagenumber)

        divAllAnimes.innerHTML = ''

        fetch('https://api.jikan.moe/v4/anime?page=' + pagenumber + '&limit=25&type=tv&sfw=false&genres=' + id)
        .then(response => response.json())
        .then(response => {

            // if(pagenumber > 1) {
            //     pagenumber -= 1;
            // } else {
            //     pagenumber = response.pagination.last_visible_page
            // }

            console.log(response.data)
            response.data.forEach(anime => {

                divAllAnimes.innerHTML += `
                <div class="divEachAnime" data-id=${anime.mal_id}>
                    <img src="${anime.images.webp.image_url}">
                    <div class="text">
                        <h3>Title of the anime : </h3>
                        <h2>${anime.title}</h2>
                        <h3>Title in japanese : </h3>
                        <h2>${anime.title_japanese}</h2>
                    </div>
                </div>
                `
            })
            clickAnime()
        })
    })
}


function selectGenres() {
    fetch('https://api.jikan.moe/v4/genres/anime')
        .then(response => response.json())
        .then(response => {
            console.log(response)
            response.data.forEach(element => {
                document.querySelector('#genres').innerHTML += `<option value='${element.mal_id}'>${element.name}</option>`
            })
        })
}


function changeGenre() {
    document.querySelector('#genres').addEventListener('change', ()=> {
        fetchAnime(document.querySelector('#genres').value)
    })
}


function fetchAnime(id) {

    returnpage1()

    divAllAnimes.innerHTML = ''

    fetch('https://api.jikan.moe/v4/anime?limit=25&type=tv&sfw=false&genres=' + id)
        .then(response => response.json())
        .then(response => {
            console.log(response.data)
            response.data.forEach(anime => {

                divAllAnimes.innerHTML += `
                <div class="divEachAnime" data-id=${anime.mal_id}>
                    <img src="${anime.images.webp.image_url}">
                    <div class="text">
                        <h3>Title of the anime : </h3>
                        <h2>${anime.title}</h2>
                        <h3>Title in japanese : </h3>
                        <h2>${anime.title_japanese}</h2>
                    </div>
                </div>
                `
            })
            clickAnime()
        })
}

function returnpage1() {
    document.querySelector('#page1').addEventListener('click', () => {
        pagenumber = 1

        let id = document.querySelector('#genres').value

        divAllAnimes.innerHTML = ''

        fetch('https://api.jikan.moe/v4/anime?page=' + pagenumber + '&limit=25&type=tv&sfw=false&genres=' + id)
        .then(response => response.json())
        .then(response => {

            if(response.data.length < 1) {
                document.querySelector('#errorMessage').innerHTML = `
                <h2>There are no more Animes of this genre</h2>
                `
            }

            console.log(response.data)
            response.data.forEach(anime => {

                divAllAnimes.innerHTML += `
                <div class="divEachAnime" data-id=${anime.mal_id}>
                    <img src="${anime.images.webp.image_url}">
                    <div class="text">
                        <h3>Title of the anime : </h3>
                        <h2>${anime.title}</h2>
                        <h3>Title in japanese : </h3>
                        <h2>${anime.title_japanese}</h2>
                    </div>
                </div>
                `
            })
            clickAnime()
        })
    })
}



selectGenres()

getAnimes()