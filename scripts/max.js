document.querySelector('.username').textContent = "Lacrymira";
    function get_max() {
        fetch('/get_max',{
            method: 'GET'
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            let best30 = 0, recent10 = 0;
            let tr = document.querySelector('tr');
            for (let i = 0; i < data.length; i++) {
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
            document.querySelector('.rank-img').src = "/assets/others/rating_7.png";
            best30 = (best30/30).toFixed(3);
            recent10 = (recent10/10).toFixed(3);
            document.querySelector('.recent-10').textContent = `Recent 10: ${recent10}`;
            document.querySelector('.best-30').textContent = `Best 30: ${best30}`;
            document.querySelector('.max-potential').textContent = `Max Potential: ${(best30*0.75+recent10*0.25).toFixed(3)}`;
            let maxptt = best30*0.75 + recent10*0.25;
            let p = document.createElement('p');
            let p1 = document.createElement('p');
            let p2 = document.createElement('p');
            p.style.display = 'flex';
            p.style.alignItems = 'end';
            p.style.flexDirection = 'row';
            p1.textContent = `${maxptt.toString().slice(0, maxptt.toString().indexOf('.'))}.`;
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
        }).catch(error => console.log(error));
    }
    get_max();