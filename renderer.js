const btn = document.getElementById('btn');
const searchElement = document.getElementById('search');
const resultElement = document.getElementById('result');
const loaderElement = document.getElementById('loader');

btn.addEventListener('click', async () => {
    btn.disabled = true;
    loaderElement.style.display = 'inline';
    const result = await electronAPI.search(searchElement.value);
    loaderElement.style.display = 'none';
    btn.disabled = false;

    resultElement.innerHTML = '';
    if (typeof result == 'string') {
        resultElement.textContent = result;
    }
    result.forEach(element => {
        element.torrents.forEach(t => {
            let h4 = document.createElement('h4');
            let link = document.createElement('a');
            link.href = t.link;
            link.text = t.name;
            link.target = '_blank';
            h4.appendChild(link);
            resultElement.appendChild(h4);
        });

    });

    console.log(result);
});