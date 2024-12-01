function checkWidth() {
    var width = window.innerWidth;
    if (width < 875) {
        const sidebar = document.querySelector(".sidebar");
        sidebar.style.display = "flex";
        sidebar.style.left = "-200px";
        document.querySelector('header').innerHTML=`<i class="fa fa-navicon" onclick="sidebarToggle()"></i>`
    }else{
        const sidebar = document.querySelector(".sidebar");
        document.querySelector('header').innerHTML=`
        <h3 onclick="window.location.reload()">Arcaea Offline</h3>
        <a href="/scores">成绩维护 <i class="fa fa-database"></i></a>
        <a href="/bests">Arcaea Best30 <i class="fa fa-list"></i></a>
        <a href="/aichan">AI酱 <i class="fa fa-comments-o"></i></a>
        <a href="/settings">设置 <i class="fa fa-gear"></i></a>
        <a href="/index">登出 <i class="fa fa-sign-out"></i></a>
        `
        sidebar.style.display = "none";
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