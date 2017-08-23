// first task =======================================================================================

function getJSON(url) {
    return new Promise((resolve, reject) => {
        fetch(url).then(res => {
            if (res.ok) {
                res.json().then(result => {
                    resolve(result);
                })
            }
        }).catch(err => {
            reject(err);
        })
    })
}

//  invocation example is below

//var getAstros = getJSON('http://api.open-notify.org/astros.json');
//console.log(typeof getAstros); // -> “object”
//getAstros
//    .then(function (data) {
//        console.log(data.message); // -> “success”
//    }, function (error) {
//        console.log(error);
//    });


//====================================================================================================
// second task is below

let container = document.getElementById('container');
let counter = 0;
let page = 1;
let dataArr;
let dataInfo = {};
let timer;

function appendScript() {
    error();
    container.innerHTML = '<div class="loader"></div>';
    script = document.createElement('script');
    script.setAttribute("src", `http://marsweather.ingenology.com/v1/archive/?page=${page}&format=jsonp&callback=archive`);
    script.setAttribute("id", `script`);
    document.body.appendChild(script);
}

function showInfo() {
    let h1;
    let next;
    let prev;
    container.innerHTML = `<h1>The weather on mars on ${dataArr[counter].terrestrial_date}</h1>
                                <p>MAX: ${dataArr[counter].max_temp}&deg;C</p>
                                <p>MIN: ${dataArr[counter].min_temp}&deg;C</p>
                                <p>Wind Power: ${dataArr[counter].wind_speed}</p>
                                <p>Wind Direction: ${dataArr[counter].wind_direction}</p>
                                <span id='prev' class='is-hover'>&lt;&lt;Prev</span>
                                <span id='next'class='is-hover'>Next&gt;&gt;</span>`;
    next = document.getElementById('next');
    prev = document.getElementById('prev');
    h1 = container.childNodes[0];
    if ((counter === 0) && (dataInfo.previous === null)) {
        next.classList.remove('is-hover');
        h1.innerHTML = `The latest data of weather on mars is on ${dataArr[counter].terrestrial_date}`;
    } else if ((counter === 9) && (dataInfo.next === null)) {
        prev.classList.remove('is-hover');
    }
}

function nextData() {
        if ((page === 1) && (counter === 0)) {
            counter = 0;
        } else {
            counter--;
        }

        if ((page > 1) && (counter === (-1))) {
            page--;
            counter = 9;
        }
}

function prevData() {
    counter++;
    if (counter > 9) {
        page++;
        counter = 0;
    }
}

function showMarsWeather(event) {
    let next = document.getElementById('next');
    let prev = document.getElementById('prev');
    let deleteScript = document.getElementById('script');
    let scriptPage = deleteScript.getAttribute('src').match(/([^\?]*)\?page=(\d*)/)[2];
    let h1;

    if (event.target === next) {
        nextData();
        showInfo();
    } else if (event.target === prev) {
        prevData();
        showInfo();
    }

    if ((event.target === next) || event.target === prev) {
        if (parseInt(scriptPage, 10) !== page) {
            deleteScript = document.body.getElementsByTagName('script')[1];
            document.body.removeChild(deleteScript);
            appendScript();
        }

    }

}

function archive(data) {
    let next;
    let prev;
    let h1;
    
    clearTimeout(timer);
    data.results.forEach(function (el) {
        if (el.wind_speed === null) {
            el.wind_speed = 'No data';
        }
        if (el.wind_direction === '--') {
            el.wind_direction = 'No data';
        }
    })

    dataArr = data.results.map(el => Object.assign({}, el));
    Object.assign(dataInfo, data);

    container.innerHTML = `<h1>The weather on mars on ${data.results[counter].terrestrial_date}</h1>
                                <p>MAX: ${data.results[counter].max_temp}&deg;C</p>
                                <p>MIN: ${data.results[counter].min_temp}&deg;C</p>
                                <p>Wind Power: ${data.results[counter].wind_speed}</p>
                                <p>Wind Direction: ${data.results[counter].wind_direction}</p>
                                <span id='prev' class='is-hover'>&lt;&lt;Prev</span>
                                <span id='next'class='is-hover'>Next&gt;&gt;</span>`;

    next = document.getElementById('next');
    prev = document.getElementById('prev');
    h1 = container.childNodes[0];
    
    if ((counter === 0) && (data.previous === null)) {
        next.classList.remove('is-hover');
        h1.innerHTML = `The latest data of weather on mars is on ${data.results[counter].terrestrial_date}`;
    } else if ((counter === 9) && (data.next === null)) {
        prev.classList.remove('is-hover');
    }
}

function error() {
    timer = setTimeout(function () {
        container.innerHTML = `<p>Sorry, data cannot be loaded</p>
                               <p>Try again later</p>`;
        throw new Error('Cannot Load data');
    }, 5000);
}


appendScript();
container.addEventListener('click', showMarsWeather);
