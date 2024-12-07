function checkWidth() {
    var width = window.innerWidth;
    if (width < 875) {
        fetch('/template/sidebar',{
            method: 'GET',
        }).then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            document.querySelector('header').innerHTML = `<i class="fa fa-navicon" onclick="sidebarToggle()"></i>`;
            const sidebar = document.querySelector(".sidebar");
            sidebar.style.display = "flex";
            sidebar.style.left = "-200px";
        }).catch(error => console.error(error));
    }else{
        fetch('/template/header',{
            method: 'GET',
        }).then(response => response.text())
        .then(data => {
            document.querySelector('header').innerHTML = data;
        }).catch(error => console.error(error));
        document.querySelector(".sidebar").remove();
    }
}

window.onresize = checkWidth;

function sidebarToggle() {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar.style.left == "-200px"){
        sidebar.style.left = "0px";
    }else{
        sidebar.style.left = "-200px";
    }
}
checkWidth();