const key = "47b542aba39d9abd0cd5b7d37d36077d";
const icon = document.querySelector('.icon');
const city = document.querySelector('.city');
const country = document.querySelector('.country');
const temp = document.querySelector('.temp');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');
const main_desc = document.querySelector('.main_desc');
const desc = document.querySelector('.description');
const inputSearch = document.querySelector('.citySearch');
const submit = document.querySelector('.search')
const newsKey ='4oJ3eKwJ493gWBACutlc_vIH8jbC499gAHis8O6-vUw';
const cardDetails = document.querySelector('.cardDetails');
const mainNews = document.querySelector('.mainNews')
const newsMain = document.querySelector('.newsMain');

function getDataByCity(cityname){
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" +
    cityname +
    "&units=metric&appid=" +
    key).then(callback)
}

function getDataByZip(zip){
    fetch("http://api.openweathermap.org/geo/1.0/zip?zip=" +
    zip +
    "&units=metric&appid=" +
    key).then(getCityName)
}

function getCity(lat,lon){
    fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${key}`).then((res)=>{
        res.json().then((data)=>{
            getDataByCity(data[0].name);
        })
    })
}

function getCityName(res){
    res.json().then((data)=>{
        getCity(data.lat,data.lon);
    })
}

function callback(res){
    res.json().then((data)=>{
        let iconDesc = data.weather[0].main;
        if(iconDesc === 'Mist'){
            icon.src = "./images/mist.png";
        }
        else if(iconDesc == 'Clouds'){
            icon.src = "./images/clouds.png"
        }
        else if(iconDesc == 'Clear'){
            icon.src = "./images/clear.png"
        }
        else if(iconDesc == 'Drizzle' || iconDesc == 'Thunderstorm'){
            icon.src = "./images/drizzle.png"
        }
        else if(iconDesc == 'Rain' ){
            icon.src = "./images/rain.png"
        }
        else{
            icon.src = "./images/snow.png"
        }
        city.innerHTML = data.name;
        country.innerHTML = data.sys.country;
        getNews(data.sys.country);
        main_desc.innerHTML = data.weather[0].main;
        temp.innerHTML = Math.floor(data.main.temp) + " &degC";
        humidity.innerHTML =data.main.humidity;
        wind.innerHTML = data.wind.speed + " km/h";
        cardDetails.classList.add('active');
    }).catch((err)=>{
        alert("city not found!");
    });
}


function getfirstLocationIP(){
    fetch("https://api.geoapify.com/v1/ipinfo?&apiKey=cd74afa22743492591790e73d9eb7c21").then((res)=>{
        res.json().then((data)=>{
            getDataByCity(data.city.name);
        })
    })
}

function checkNum(str){
    return !isNaN(str);
}

submit.addEventListener('click',(e)=>{
    const loc = inputSearch.value;
    if(checkNum){
        getDataByZip(loc);
    }
    else{
    getDataByCity(loc);
    }
})

window.addEventListener('keyup',(e)=>{
    if(e.key == 'Enter'){
        if(checkNum(inputSearch.value)){
            getDataByZip(inputSearch.value);
        }
        else{
        getDataByCity(inputSearch.value);
        }
    }
})

function getNews(country){
   mainNews.innerHTML = "";
   fetch(`https://api.newscatcherapi.com/v2/latest_headlines?countries=${country}`,{
    method: 'GET',
    headers: {'x-api-key': newsKey}
   }).then((res)=>{
        res.json().then((data)=>{
            console.log(data);
            for(let i=0;i<Math.min(15,data.page_size);i++){
                showNews(data.articles[i]);
            }
        })
   }).catch((err)=>{
    mainNews.classList.add('invisible');
   })
}


function showNews(data){
    const newDiv = document.createElement('div');
    newDiv.classList.add('newsCard');
    const title = document.createElement('h2');

    const hr = document.createElement('hr');
    hr.setAttribute('width','100%')
    title.classList.add('newsTitle');
    const url = document.createElement('a');
    title.innerHTML = data.title;
    url.setAttribute('target','blank');
    url.innerHTML = '<i class="fa-solid fa-circle-info newsLink"></i>';
    url.classList.add('newsLink');
    url.setAttribute('href',data.link);
    newDiv.appendChild(title);
    newDiv.appendChild(url);
    newDiv.appendChild(hr);
    mainNews.appendChild(newDiv);
    newsMain.classList.remove('invisible');
}
newsMain.classList.add('invisible');
getfirstLocationIP();
