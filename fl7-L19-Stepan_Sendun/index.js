// first task =======================================================================================

function getJSON(url) {
    let promise = new Promise((resolve, reject) => {
        fetch(url).then(res => {
            if (res.status === 200) {
                res.json().then(result => {
                    resolve(result);
                })
            }
        }).catch(function(eror){
            reject(eror);
        })
    })

    return promise;
}

  // invocation example is below

//var getAstros = getJSON('http://api.open-notify.org/astros.json');
//console.log(typeof getAstros); // -> “object”
//getAstros
//    .then(function (data) {
//        console.log(data.message); // -> “success”
//    }, function (error) {
//        console.log(error);
//    });
//

//====================================================================================================
// second task is below

let archiveScript = document.createElement('script');
let container = document.getElementById('container');
let counter = 0;
let page = 1;


archiveScript.setAttribute("src", 'http://marsweather.ingenology.com/v1/archive/?page=1&format=jsonp&callback=archive');
document.body.appendChild(archiveScript);


function currentTime() {
    var d = new Date(),
        minutes = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes(),
        hours = d.getHours().toString().length == 1 ? '0' + d.getHours() : d.getHours(),
        ampm = d.getHours() >= 12 ? 'pm' : 'am',
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[d.getDay()] + ' ' + months[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + ' ' + hours + ':' + minutes + ampm;
}


function showMarsWeather(event) {
    if (event.target.innerHTML.includes('Next')) {

        if ((page === 1) && (counter === 0)) {
            counter = 0;
        } else {
            counter--;
        }

        if ((page > 1) && (counter === (-1))) {
            page--;
            counter = 9;
        }

    } else if (event.target.innerHTML.includes('Prev')) {
        counter++;

        if (counter > 9) {
            page++;
            counter = 0;
        }
    }

    if (event.target.getAttribute('class') === 'is-hover') {
        container.innerHTML = '<div class="loader"></div>';
        let deleteScript = document.body.getElementsByTagName('script')[1];
        document.body.removeChild(deleteScript);
        let script = document.createElement('script');
        script.setAttribute("src", `http://marsweather.ingenology.com/v1/archive/?page=${page}&format=jsonp&callback=archive`);
        document.body.appendChild(script);
    }
}

function archive(data) {
    let next;
    let prev;
    let h1;
    clearTimeout(timer);
    container.innerHTML = `<h1>The weather on mars on ${data.results[counter].terrestrial_date}</h1>
                                <p>MAX ${data.results[counter].max_temp}&deg;C</p>
                                <p>MIN ${data.results[counter].min_temp}&deg;C</p>
                                <p>Current Earch Time ${currentTime()}</p>
                                <span class='is-hover'>&lt;&lt;Prev</span>
                                <span class='is-hover'>Next&gt;&gt;</span>`;
    next = document.getElementsByTagName('span')[1];
    prev = document.getElementsByTagName('span')[0];
    h1 = container.childNodes[0];
    if ((counter === 0) && (data.previous === null)) {
        next.classList.remove('is-hover');
        h1.innerHTML = `The latest data of weather on mars is on ${data.results[counter].terrestrial_date}`;
    } else if ((counter === 9) && (data.next === null)) {
        prev.classList.remove('is-hover');
    }
}

// generate error message if data wasn't load in 5 seconds
let timer = setTimeout(function () {
    container.innerHTML = `<p>Sorry, data cannot be loaded</p>
                        <p>Try again later</p>`;
    throw new Error('Cannot Load data');
}, 5000);


container.addEventListener('click', showMarsWeather);
