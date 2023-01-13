window.addEventListener('DOMContentLoaded',()=> {
	const numberButtons = document.querySelectorAll('[data-num]');
	const deleteButton = document.querySelector('[data-del]');
	const equalsButton = document.querySelector('[data-equals]');
	const clearButton = document.querySelector('[data-clears]');
	let current = document.querySelector('.display__current');
	let prev = document.querySelector('.display__prev');
	let calcString = "";
	let res;

	function addNum(btnValue) {
		calcString += btnValue
		calcString = checkExpressions(calcString);
		current.innerHTML = calcString;
	}

	function checkExpressions(testString) {
		let symb = testString.slice(length - 1);
		let symPrev = testString.slice(length - 2);
		let symbRes;

		if(symPrev.includes(symb)) {
			symbRes = symb;
		}

		testString = testString.replace(/^\./, '');
		testString = testString.replace(/\.{2,}/g, ".");
		testString = testString.replace(/(\W{2,})/g, symbRes || '');
		return testString;
	}

	function compute() {
		try {
			res = calculation(calcString);
		} catch (e) {
			return res = "Ошибка, проверьте выражение.";
		}

		if (calcString === ''){
			setTimeout(clearPrev, 2000);
		} else {
			current.innerHTML = calcString + "=" + res;
		}
	}

	function calculation(buffString) {
		buffString = buffString.replace(/([^[0-9.]{1})/g, " $1 ").trim();
		buffString = buffString.replace(/ {1,}/g, " ");
		let buffArray = buffString.split(/\s/);
		let polishString = [];
		let polishStack = [];
		let stringId = -1;
		let stackId = -1;

		for (let i = 0; i < buffArray.length; i++) {
			switch (buffArray[i]) {
				case "+":
					while (stackId >= 0 && (polishStack[stackId] === "+" || polishStack[stackId] === "-" || polishStack[stackId] === "*" || polishStack[stackId] === "/")) {
						stringId++;
						polishString[stringId] = polishStack[stackId];
						stackId--;
					}
					stackId++;
					polishStack[stackId] = buffArray[i];
					break;
				case "-":
					while (stackId >= 0 && (polishStack[stackId] === "+" || polishStack[stackId] === "-" || polishStack[stackId] === "*" || polishStack[stackId] === "/")) {
						stringId++;
						polishString[stringId] = polishStack[stackId];
						stackId--;
					}
					stackId++;
					polishStack[stackId] = buffArray[i];
					break;
				case "*":
					while (stackId >= 0 && (polishStack[stackId] === "*" || polishStack[stackId] === "/")) {
						stringId++;
						polishString[stringId] = polishStack[stackId];
						stackId--;
					}
					stackId++;
					polishStack[stackId] = buffArray[i];
					break;
				case "/":
					while (stackId >= 0 && (polishStack[stackId] === "*" || polishStack[stackId] === "/")) {
						stringId++;
						polishString[stringId] = polishStack[stackId];
						stackId--;
					}
					stackId++;
					polishStack[stackId] = buffArray[i];
					break;
				default:
					stringId++;
					polishString[stringId] = buffArray[i];
			}
		}
		while (stackId >= 0) {
			stringId++;
			polishString[stringId] = polishStack[stackId];
			stackId--;
		}

		stackId = -1;
		let stringIdMax = stringId;

		for (stringId = 0; stringId <= stringIdMax; stringId++ ) {
			switch (polishString[stringId]) {
				case "+":
					stackId--;
					polishStack[stackId] = polishStack[stackId] + polishStack[stackId + 1];
					break;
				case "-":
					stackId--;
					polishStack[stackId] = polishStack[stackId] - polishStack[stackId + 1];
					break;
				case "*":
					stackId--;
					polishStack[stackId] = polishStack[stackId] * polishStack[stackId + 1];
					break;
				case "/":
					stackId--;
					if (polishStack[stackId + 1] === 0){
						polishStack[stackId] = (polishStack[stackId] / polishStack[stackId + 1]).toFixed(8);
						if (polishStack[stackId].toString() === 'Infinity') {
							polishStack[stackId] = 'Ошибка, но 0 делить нельзя!';
							prev.innerHTML = polishStack[stackId];
							clearDisplay();
							polishStack[stackId] = '';
						}
					} else {
						polishStack[stackId] = (polishStack[stackId] / polishStack[stackId + 1]).toFixed(8);
					}
					break;
				default:
					stackId++;
					polishStack[stackId] = parseFloat(polishString[stringId]);
			}
		}
		return polishStack[stackId];
	}

	function clearDisplay() {
		calcString = "";
		current.innerHTML = calcString;
	}

	function clearPrev() {
		prev.innerHTML = "";
	}

	function delValue() {
		calcString = calcString.substr(0,calcString.length - 1);
		current.innerHTML = calcString;
	}

	numberButtons.forEach(button => {
		button.addEventListener('click', () => {
			addNum(button.textContent);
		});
	});

	equalsButton.addEventListener('click', () => {
		compute();
	});

	deleteButton.addEventListener('click', () => {
		delValue();
	});

	clearButton.addEventListener('click', () => {
		clearDisplay();
	});

});