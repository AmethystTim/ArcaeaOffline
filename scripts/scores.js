function calcptt(difficulty, score) {
    if (score == '' || !score){
        return 0;
    }
    if (score >= 1000_0000){
        return difficulty + 2;
    } else if (score >= 980_0000){
        return difficulty + 1 + (score - 980_0000) / 20_0000
    } else{
        return Math.max(difficulty + (score - 950_0000) / 30_0000, 0)
    }
}
function update_chart(data) {
    document.querySelector('.songsTable').innerHTML = `
        <tr id="table-header">
            <th>id</th>
            <th>曲名</th>
            <th>曲师</th>
            <th>分类</th>
            <th>定数</th>
            <th>分数</th>
            <th>游玩潜力值</th>
        </tr>
    `;
    for (let i = 0; i < data.length; i++) {
        let tr = document.createElement('tr');

        let th_id = document.createElement('th');
        let th_name = document.createElement('th');
        let th_artist = document.createElement('th');
        let th_difficulty = document.createElement('th');
        let th_class = document.createElement('th');
        
        let th_score = document.createElement('th');
        
        th_name.innerText = data[i].title;
        th_artist.innerText = data[i].artist;
        th_difficulty.innerText = data[i].difficulty;
        th_class.innerText = data[i].class;
        th_id.innerText = data.length-i;
        th_class.style.borderRadius = '10px';
        switch (data[i].class) {
            case "Past":{
                th_class.style.background = `linear-gradient(45deg, #0077ff, transparent)`;
                break;
            }
            case "Present":{
                th_class.style.background = `linear-gradient(45deg, #01b73a, transparent)`;
                break;
            }
            case "Future":{
                th_class.style.background = `linear-gradient(45deg, #B056FF, transparent)`;
                break;
            }
            case "Beyond":{
                th_class.style.background = `linear-gradient(45deg, #db004f, transparent)`;
                break;
            }
            case "Eternal":{
                th_class.style.background = `linear-gradient(45deg, #5f63ff, transparent)`;
                break;
            }
            default:{
                th_class.style.background = `linear-gradient(45deg, #B056FF, transparent)`;
                break;
            }
        }
        let playptt = document.createElement('th');
        playptt.innerText = (data[i].rating).toFixed(3);
        let scoreinput = document.createElement('input');
        scoreinput.value = data[i].score;
        scoreinput.type = 'number';
        scoreinput.addEventListener('change', function() {
            playptt.innerText = calcptt(data[i].difficulty, this.value).toFixed(3);
            fetch('/update_chart',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: data[i].id,
                    class: data[i].class,
                    score: this.value
                })
            }).catch(error => console.log(error));
        });
        th_score.appendChild(scoreinput);

        tr.appendChild(th_id);
        tr.appendChild(th_name);
        tr.appendChild(th_artist);
        tr.appendChild(th_class);
        tr.appendChild(th_difficulty);
        tr.appendChild(th_score);
        tr.appendChild(playptt);

        document.getElementById('table-header').insertAdjacentElement('afterend', tr);
    }
    // 快速输入
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === 'Tab' || event.key === 'ArrowDown') {
                event.preventDefault(); 
                if (index + 1 < inputs.length) {
                    inputs[index + 1].focus();
                }
            } else if (event.key === 'ArrowUp') {
                event.preventDefault(); 
                if (index - 1 >= 0) {
                    inputs[index - 1].focus();
                }
            }
        });
    });
}
function get_chart() {
    fetch('/get_chart',{
        method: 'POST'
    }).then(response => response.json()).then(data => {
        console.log(data);
        update_chart(data);
    }).catch(error => console.log(error));
}
get_chart();
function export_chart() {
    fetch('/export_chart',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(()=>{
        alert('done : )');
    })
    .catch(error => {
        alert('Ops : (');
        console.log(error)}
    );
}
function import_chart() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.style.display = 'none';
    input.addEventListener('change', ()=>{
        const file = event.target.files[0];
        const formdata = new FormData();
        formdata.append('file', file);
        if (!confirm('导入成绩会覆盖掉原本数据，确定要导入吗？')) {
            return;
        }
        fetch('/import_chart',{
            method: 'POST',
            body: formdata
        })
        .then(response => response.json())
        .then(data => {
             console.log(data);
             window.location.reload();
             alert('done : )');
        })
        .catch(error => console.log(error));
    });
    input.click();
}
function get_difficulty(difficulty, elementID) {
    let element = document.getElementById(elementID);
    element.innerText = parseFloat(difficulty).toFixed(1);
}
function apply_sorter() {
    var minDifficulty = parseFloat(document.getElementById('minDifficulty').innerText);
    var maxDifficulty = parseFloat(document.getElementById('maxDifficulty').innerText);
    var sorter = document.getElementById('sorter').value;
    fetch('/apply_sorter',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            minDifficulty: minDifficulty,
            maxDifficulty: maxDifficulty,
            sorter: sorter,
            classes: {
                'Past': document.getElementById('Past').innerHTML.includes('<i class="fa fa-check"></i>'),
                'Present': document.getElementById('Present').innerHTML.includes('<i class="fa fa-check"></i>'),
                'Future': document.getElementById('Future').innerHTML.includes('<i class="fa fa-check"></i>'),
                'Beyond': document.getElementById('Beyond').innerHTML.includes('<i class="fa fa-check"></i>'),
                'Eternal': document.getElementById('Eternal').innerHTML.includes('<i class="fa fa-check"></i>')
            }
        })
    }).then(response => response.json()).then(data => {
        console.log(data);
        update_chart(data)
    }).catch(error => console.log(error));
}
function select_class(elementID){
    let element = document.getElementById(elementID);
    if(element.innerHTML.includes('<i class="fa fa-check"></i>')){
        element.innerHTML = `${elementID}`
        return
    } else{
        element.innerHTML = `${elementID} <i class="fa fa-check"></i>`
    }
}