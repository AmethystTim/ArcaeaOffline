function get_username() {
    fetch('/username',{
        method: 'GET'
    }).then(response => response.json())
    .then(data => {
        document.querySelector('.username').textContent = data.username;
    }).catch(error => console.log(error));
}
function printer(text, interval, span){
    let i = 0;
    const intervalid = setInterval(() => {
        span.innerHTML = text.slice(0, i);
        document.querySelector('.chat-box').scrollTop = document.querySelector('.chat-box').scrollHeight;
        i++;
        if (i >= text.length) {
            clearInterval(intervalid)
        }
    }, interval);
}
function chat(id){
    fetch('/chat',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "id": id
        })
    }).then(response => response.json())
    .then(data => {
        div = document.createElement('div');
        div.classList.add('dlg-aichan');
        img = document.createElement('img');
        img.src = '/assets/others/aichan.jpg';
        img.alt = '';
        span = document.createElement('span');
        span.innerHTML = '';
        div.appendChild(img);
        div.appendChild(span);
        document.querySelector('.chat-box').insertBefore(div, document.querySelector('.options'));
        printer(data.message, 20, span);
    }).catch(error => console.log(error));
}