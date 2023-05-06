console.clear();

const sliderProps = {
    fill: '#0B1EDF',
    background: 'rgba(255, 255, 255, 0.214'
};

const slider = document.querySelector('.range__slider');
const sliderValue = document.querySelector('.length__title');

slider.querySelector('input').addEventListener('input', (event) => {
    applyFill(event.target);
});

function applyFill(slider) {
    const percentage =
        (100 * (slider.value - slider.min)) / (slider.max - slider.min);
    const bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%,
        ${sliderProps.background} ${percentage + 0.1}%)`;
    slider.style.background = bg;
    sliderValue.setAttribute('data-length', slider.value);
}

applyFill(slider.querySelector('input'));

const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol,
}

function secureMathRandom() {
    return (
        window.crypto.getRandomValues(new Uint32Array(1))[0] / (Math.pow(2, 32) - 1)
    );
}

function getRandomLower() {
    return string.fromCharCode(Math.floor(Math.random() * 26) + 97)
}

function getRandomUpper() {
    return string.fromCharCode(Math.floor(Math.random() * 26) + 65)
}

function getRandomNumber() {
    return string.fromCharCode(
        Math.floor(secureMathRandom() * 10) + 48);
}

function getRandomSymbol() {
    const symbols = `~!@#$^&*()_+{":?><:.,}`;
    return symbols[Math.floor(Math.random() * symbols.length)]
}

const resultEl = document.getElementById('result');
