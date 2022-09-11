function findLeftBorderIndex(levels) {
    for (i = 0; i < levels.length; i++) {
        if (levels[i] > 0) {
            return i
        }
    }

    return -1;
}

function findRightBorderIndex(levels, leftBorderIndex) {
    let alternativeRightBorderIndex = -1;

    for (i = 0; i < levels.length; i++) {
        if (i > leftBorderIndex && levels[i] >= levels[leftBorderIndex])
            return i

        if (i > leftBorderIndex && levels[i] > 0 && alternativeRightBorderIndex === -1) {
            alternativeRightBorderIndex = i
        } else if (alternativeRightBorderIndex !== -1 && levels[i] > levels[alternativeRightBorderIndex] && levels[i] > 0)
            alternativeRightBorderIndex = i
    }

    return alternativeRightBorderIndex;
}

function loadGrain(levels, grainCount = 0) {
    //проверка которая убирает варианты когда передаётся пустой массив или массив который состоит из кол-ва элементов в которые не имеют пустых зон.
    if (levels.length <= 2)
        return grainCount;
    //начальная точка.
    const leftBorderIndex = findLeftBorderIndex(levels);

    if (leftBorderIndex === -1)
        return grainCount;
    //конечная точка.
    const rightBorderIndex = findRightBorderIndex(levels, leftBorderIndex);

    if (rightBorderIndex === -1)
        return grainCount;
    //рекурсия если правая и левая сторона соприкасаются.
    if (rightBorderIndex - leftBorderIndex === 1)
        return loadGrain(levels.slice(rightBorderIndex), grainCount);
    //определения меньшей стороны, для определения кол-ва свободного места.
    const smallerBorder = Math.min(levels[leftBorderIndex], levels[rightBorderIndex]);
    //цикл, который вычесляет свободное место между начальной и конечной точками.
    for (let i = leftBorderIndex + 1; i < rightBorderIndex; i++)
        grainCount += smallerBorder - levels[i];
    //рекурсия с новым массивом, обрезаный по проверенную часть
    return loadGrain(levels.slice(rightBorderIndex), grainCount);
}

const btn = document.querySelector('#btn');
const load = document.querySelector('#post-array');
const resultContainer = document.querySelector('#result');
const storage = document.querySelector('#storage');

btn.addEventListener('click', e => {
    const arr = load.value.split(' ');
    const correctArr = arr.filter(function (el) {
        return el !== '';
    });
    console.log(correctArr)
    loadContainer(correctArr);
    const result = loadGrain(correctArr);
    resultContainer.innerHTML = ` ${result}`
})

function loadContainer(arr) {
    storage.innerHTML = '';
    for (let i = 0; i < arr.length; i++) {
        let parrentDiv = document.createElement('div');
        parrentDiv.className = `storage-parrent-div-${i} storage-containers`;
        storage.appendChild(parrentDiv);
        if (arr[i] === '0') {
            let parrentDiv = document.querySelector(`.storage-parrent-div-${i}`);
            let emptyChildDiv = document.createElement('div');
            emptyChildDiv.className = `empty-setted-containers`;
            parrentDiv.appendChild(emptyChildDiv);
            // let countContainers = document.createElement('div');
            // countContainers.innerHTML = `${arr[i]}`
            // parrentDiv.appendChild(countContainers);
        } else {
            for (let a = 0; a < arr[i]; a++) {
                let parrentDiv = document.querySelector(`.storage-parrent-div-${i}`);
                let childDiv = document.createElement('div');
                childDiv.className = `setted-containers`;
                parrentDiv.appendChild(childDiv);
                console.log()
                if (arr[a] === '0') {
                    // let countContainers = document.createElement('div');
                    // countContainers.innerHTML = `${arr[i]}`
                    // parrentDiv.appendChild(countContainers);
                }
            }
        }
    }
}


// console.log(loadGrain([4, 5, 3, 1, 3])) // 2
// console.log(loadGrain([2, 1, 5, 2, 7, 4, 10])) // 7
// console.log(loadGrain([2, 0, 1, 5, 2, 7])) // 6
// console.log(loadGrain([2, 4, 2])) // 0
// console.log(loadGrain([7, 4])) // 0
// console.log(loadGrain([])) // 0

// console.log(loadGrain([4, 0, 1, 3, 4, 2])) // 8
// console.log(loadGrain([0,0,0,0,0,0,0,1])) // 0
// console.log(loadGrain([1, 0, 0, 0, 0, 0, 0, 1])) // 6
// console.log(loadGrain([5, 0, 0, 5, 0, 0, 0, 5])) // 25
