function get_username() {
    fetch('/username',{
        method: 'GET'
    }).then(response => response.json())
    .then(data => {
        document.querySelector('.username').textContent = data.username;
    }).catch(error => console.log(error));
}
function get_bests() {
    fetch('/get_bests',{
        method: 'GET'
    }).then(response => response.json())
    .then(data => {
        console.log(data);
        let best30 = 0, recent10 = 0;
        let tr = document.querySelector('tr');
        for (let i = 0; i < data.length; i++) {
            if (data[i].rating == 0){
                break;
            }
            best30 += data[i].rating;
            if (i < 10){
                recent10 += data[i].rating;
            }
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
            var url = data[i].id;
            if(data[i].class == 'Beyond'){
                url = `${data[i].id}_byd`;
            }
            div2.innerHTML = `
                <div class="song-illustration">
                    <img src="/assets/illustrations/${url}.jpg" alt="">
                </div>
                <div class="song-score">
                    <div class="score">${data[i].score}</div>
                    <div class="rating">${data[i].difficulty}→${data[i].rating}</div>
                </div>
            `;
            th.appendChild(div1);
            th.appendChild(div2);
            tr.appendChild(th);
        }
        best30 = (best30/30).toFixed(3);
        recent10 = (recent10/10).toFixed(3);
        document.querySelector('.best-30').textContent = `Best 30: ${best30}`;
        document.querySelector('.recent-10').textContent = `Recent 10: ${recent10}`;
        document.querySelector('.max-potential').textContent = `Max Potential: ${(best30*0.75 + recent10*0.25).toFixed(3)}`;
        let maxptt = best30*0.75 + recent10*0.25;
        let p = document.createElement('p');
        let p1 = document.createElement('p');
        let p2 = document.createElement('p');
        p.style.display = 'flex';
        p.style.alignItems = 'end';
        p.style.flexDirection = 'row';
        p1.textContent = `${maxptt.toString().slice(0, maxptt.toString().indexOf('.'))}.`;
        p1.textContent = p1.textContent == "." ? "0." : p1.textContent;
        p1.style.webkitTextStroke = "0.3px black";
        p2.textContent = maxptt.toString().slice(maxptt.toString().indexOf('.')+1, maxptt.toString().indexOf('.')+ 3);
        p2.style.webkitTextStroke = "0.2px black";
        p1.style.fontSize = "20px";
        p2.style.fontSize = "17px";
        p1.style.margin = '0px';
        p1.style.padding = '0px';
        p1.style.position = 'relative';
        p1.style.bottom = '1px'
        p2.style.position = 'relative';
        p2.style.bottom = '2px'
        p2.style.margin = '0px';
        p2.style.padding = '0px';
        p.appendChild(p1);
        p.appendChild(p2);
        document.querySelector('.rank-rating').appendChild(p);
        if (maxptt >= 13.00){
            document.querySelector('.rank-img').src = "/assets/others/rating_7.png";
        } else if (maxptt >= 12.50){
            document.querySelector('.rank-img').src = "/assets/others/rating_6.png";
        } else if (maxptt >= 12.00){
            document.querySelector('.rank-img').src = "/assets/others/rating_5.png";
        } else if (maxptt >= 11.00){
            document.querySelector('.rank-img').src = "/assets/others/rating_4.png";
        } else if (maxptt >= 10.00){
            document.querySelector('.rank-img').src = "/assets/others/rating_3.png";
        } else if (maxptt >= 7.00){
            document.querySelector('.rank-img').src = "/assets/others/rating_2.png";
        } else if (maxptt >= 3.50){
            document.querySelector('.rank-img').src = "/assets/others/rating_1.png";
        } else {
            document.querySelector('.rank-img').src = "/assets/others/rating_0.png";
        }
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
get_bests();