//function getJSON(url) {
//    let promise = new Promise((resolve, reject) => {
//        fetch(url).then(res => {
//            if (res.status === 200) {
//                res.json().then(result => {
//                    resolve(result);
//                })
//            } else {
//                reject(new Error(`Response status ${res.status}. ${Error.message}`));
//            }
//        })
//    })
//
//    return promise;
//}
//
//
//var getAstros = getJSON('http://api.open-notify.org/astros.json');
//console.log(typeof getAstros); // -> “object”
//getAstros
//    .then(function (data) {
//        console.log(data.message); // -> “success”
//    }, function (error) {
//        console.log(error);
//    });
//
//let script = document.getElementById('script');
//
//fetch('?jsonp=parseResponse').then(res=>{
//    console.log(res)
//})
//
//
//function parseResponse(data){
//    console.log(data);
//}


let archiveScript = document.createElement('script');
let container = document.getElementById('container');
let counter = 0;
let page = 1;



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
    let next = document.getElementsByTagName('span')[1];
    container.innerHTML = '<div class="loader"></div>';
    if (event.target.innerHTML.includes('Next') && (counter > 0)) {
        counter--;
    } else if (event.target.innerHTML.includes('Prev')) {
        counter++;
    }

    if (counter > 9) {
        page++;
        counter = 0;
    } else if ((counter < 9) && (page !== 1)) {
        page--;
        counter = 0;
    }

    
    let deleteScript = document.body.getElementsByTagName('script')[1];
    document.body.removeChild(deleteScript);
    let script = document.createElement('script');
    script.setAttribute("src", `http://marsweather.ingenology.com/v1/archive/?page=${page}&format=jsonp&callback=archive`);
    document.body.appendChild(script);

}




archiveScript.setAttribute("src", 'http://marsweather.ingenology.com/v1/archive/?page=1&format=jsonp&callback=archive');
document.body.appendChild(archiveScript);

container.addEventListener('click', showMarsWeather);




function archive(data) {


    container.innerHTML = `<h1>The latest result of weather on mars on ${data.results[counter].terrestrial_date}</h1>
                                <p>MAX ${data.results[counter].max_temp}&deg;C</p>
                                <p>MIN ${data.results[counter].min_temp}&deg;C</p>
                                <p>Current Earch Time ${currentTime()}</p>
                                <span class='is-hover'>&lt;&lt;Prev</span>
                                <span class='is-hover'>Next&gt;&gt;</span>`
}
