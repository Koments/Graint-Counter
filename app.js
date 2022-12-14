const btn = document.querySelector('#btn');
const load = document.querySelector('#post-array');
const resultContainer = document.querySelector('#result');
const storage = document.querySelector('#storage');

function findLeftBorderIndex(levels) {
    for (i = 0; i < levels.length; i++) {
        if (levels[i] > 0)
            return i
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
        } else if (alternativeRightBorderIndex !== -1 && levels[i] > levels[alternativeRightBorderIndex] && levels[i] > 0) {
            alternativeRightBorderIndex = i
        }
    }

    return alternativeRightBorderIndex;
}

function loadGrain(levels, grainMap = new Map(), globalIndex = 0) {
    //Search start border index.
    const leftBorderIndex = findLeftBorderIndex(levels);
    if (leftBorderIndex === -1)
        return grainMap;

    //Search end border index.
    const rightBorderIndex = findRightBorderIndex(levels, leftBorderIndex);
    if (rightBorderIndex === -1)
        return grainMap;

    //Checking the contiguity of the parties.
    if (rightBorderIndex - leftBorderIndex === 1)
        return loadGrain(levels.slice(rightBorderIndex), grainMap, globalIndex + rightBorderIndex);

    //Calculation of the smaller side.
    const smallerBorder = Math.min(levels[leftBorderIndex], levels[rightBorderIndex]);

    //Computing free space on the smaller side.
    for (let i = leftBorderIndex + 1; i < rightBorderIndex; i++) {
        const grainCount = smallerBorder - levels[i];
        grainMap.set(globalIndex + i, grainCount);
    }

    //Checking the contiguity of the parties
    return loadGrain(levels.slice(rightBorderIndex), grainMap, globalIndex + rightBorderIndex);
}

btn.addEventListener('click', e => {
    //Creating an array from given parameters
    const arr = load.value.split(' ');

    //Removing empty lines
    const strs = arr.filter(function (el) {
        return el !== '';
    });

    //Convert string to numbers
    const grainParam = strs.map(function (str) {
        return parseInt(str);
    });

    //Check of free space and positions for placing grain
    const resultMap = loadGrain(grainParam);
    let grainTotal = 0;

    //Summation of the result
    resultMap.forEach(value => {
        grainTotal += value;
    });

    //Displaying the result on the screen
    resultContainer.innerHTML = ` ${grainTotal}`
    
    //Warehouse design visualization
    loadStorage(grainParam, resultMap);
})

function loadStorage(arr, grainMap) {
    storage.innerHTML = '';

    //Building Blocks    
    for (let i = 0; i < arr.length; i++) {
        const parrentDiv = document.createElement('div');
        parrentDiv.className = `storage-parrent-div-${i} storage-containers`;
        storage.appendChild(parrentDiv);

        //Creating empty cells
        if (grainMap.get(i))
            drawDrains(grainMap.get(i), i);

        //Creating specified cells
        for (let a = 0; a < arr[i]; a++) {
            const storageParrent = document.querySelector(`.storage-parrent-div-${i}`);
            const childDiv = document.createElement('div');
            childDiv.className = `setted-containers`;
            storageParrent.appendChild(childDiv);
        };
        
        //Num of creating specified cells
        const countContainers = document.createElement('div');
        parrentDiv.appendChild(countContainers);
        countContainers.textContent = `${arr[i]}`
    }
}

function drawDrains(grainsCount, i) {
    //Loop to add to correct slot
    for (let b = 0; b < grainsCount; b++) {
        const parrentDiv = document.querySelector(`.storage-parrent-div-${i}`);
        const childDiv = document.createElement('div');
        childDiv.className = `grain-containers`;
        parrentDiv.appendChild(childDiv);
    }
}

// Test
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
