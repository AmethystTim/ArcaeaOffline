function get_username() {
    fetch('/username',{
        method: 'GET'
    }).then(response => response.json())
    .then(data => {
        document.querySelector('.username').textContent = data.username;
    }).catch(error => console.log(error));
}
function get_p30() {
    fetch('/get_p30',{
        method: 'GET'
    }).then(response => response.json())
    .then(data => {
        console.log(data);
        let best30 = 0;
        let tr = document.querySelector('tr');
        for (let i = 0; i < data.length; i++) {
            best30 += data[i].rating;
            let th = document.createElement('th');
            style = "";
            let div1 = document.createElement('div');
            let div2 = document.createElement('div');
            div1.innerHTML = `#${i+1} ${data[i].name}`;
            div1.classList.add('song-name');
            div1.style.textAlign = "left";
            switch (data[i].class) {
                case "Past":{
                    div1.style.background = `linear-gradient(to right, #0077ff, #000000)`;
                    break;
                }
                case "Present":{
                    div1.style.background = `linear-gradient(to right, #01b73a, #000000)`;
                    break;
                }
                case "Future":{
                    div1.style.background = `linear-gradient(to right, #B056FF, #000000)`;
                    break;
                }
                case "Beyond":{
                    div1.style.background = `linear-gradient(to right, #db004f, #000000)`;
                    break;
                }
                case "Eternal":{
                    div1.style.background = `linear-gradient(to right, #5f63ff, #000000)`;
                    break;
                }
                default:{
                    div1.style.background = `linear-gradient(to right, #B056FF, #000000)`;
                    break;
                }
            }
            div2.classList.add('layer');
            div2.innerHTML = `
                <div class="song-illustration">
                    <img src="/assets/illustrations/${data[i].id}.jpg" alt="">
                </div>
                <div class="song-score">
                    <div class="score">${data[i].score}</div>
                    <div class="rating">${data[i].difficulty}->${data[i].rating}</div>
                </div>
            `;
            th.appendChild(div1);
            th.appendChild(div2);
            tr.appendChild(th);
        }
        document.querySelector('.avg-rating').textContent = `AVG Rating: ${(best30/(data.length)).toFixed(3)}`;
        best30 = (best30/30).toFixed(3);
        document.querySelector('.best-30').textContent = `P30: ${best30}`;
    }).catch(error => console.log(error));
}
function avatar_list_toggle() {
    let avatar_list = document.querySelector('.avatar-list');
    if (avatar_list.style.opacity == 1) {
        avatar_list.style.opacity = 0;
        avatar_list.style.zIndex = -10;
    } else {
        avatar_list.style.opacity = 1;
        avatar_list.style.zIndex = 1000;
        fetch('/avatar_list',{
            method: 'GET'
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            let avatar_list = document.querySelector('.avatar-list');
            for (let i = 0; i < data.length; i++) {
                if (data[i]=='.gitkeep'){
                    continue;
                }
                let img = document.createElement('img');
                img.src = "/assets/avatars/"+data[i];
                img.onclick = function() {
                    avatar_list.style.opacity = 0;
                    avatar_list.style.zIndex = -10;
                    document.querySelector('.avatar img').src = this.src;
                    fetch('/set_avatar',{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            avatar: data[i]
                        })
                    }).catch(error => console.log(error));
                }
                avatar_list.appendChild(img);
            }
        });
    }
}
function get_avatar() {
    fetch('/get_avatar',{
        method: 'GET'
    }).then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.avatar == 'default.png'){
            document.querySelector('.avatar img').src = "/assets/others/"+data.avatar;
        } else {
            document.querySelector('.avatar img').src = "/assets/avatars/"+data.avatar;
        }
    }).catch(error => console.log(error));
}
get_username();
get_avatar();
get_p30();