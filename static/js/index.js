let index = 0;
let attempts = 0; // 시도 횟수
let timer;

function appStart() {
    const displayGameOver = () => {
        // const div = document.createElement('div');
        // div.innerText = '게임이 종료됐습니다.'
        // div.style = "display: flex; justify-content: center; align-item: center; position: absolute; top: 40vh; left: 45vw;"
        // document.body.appendChild(div);
        alert("게임이 종료됐습니다!!!");
    };

    // 다음 라인으로 넘기기
    const nextLine = () => {
        if (attempts === 6) return gameOver();
        attempts += 1;
        index = 0;
    };

    const gameOver = () => {
        GameOver();
        window.removeEventListener("keydown", handleKeyDown);
        clearInterval(timer);
    };

    // 5개 입력 후 엔터 누른 후
    const handleEnterKey = async() => {
        let 맞은갯수 = 0;
        const 응답 = await fetch('/answer'); // answer로 응답 요청보내서 받고
        const 정답_객체 = await 응답.json(); // 그 값을 json으로 바꿔줌 -> 객체 형태 (서버에서 객체로 내보내서)
        const 정답 = 정답_객체.answer;

        console.log(응답);
        console.log(정답_객체);
        console.log(정답);

        for (let i = 0; i < 5; i++) {
            const block = document.querySelector(
                `.board-block[data-index='${attempts}${i}']`
            );
            const 입력한글자 = block.innerHTML;
            const 정답글자 = 정답[i];

            console.log(`입력글자 : ${입력한글자}, 정답글자 : ${정답글자}`);
            console.log(맞은갯수);

            if (입력한글자 === 정답글자) {
                block.style.backgroundColor = "#6AAA64";
                맞은갯수 += 1;
            } else if (정답.includes(입력한글자))
                block.style.backgroundColor = "#C9B458";
            else block.style.backgroundColor = "#787C7E";

            block.style.color = "white";
        }

        if (맞은갯수 === 5) gameOver();
        else nextLine();
    };

    const handleBackspace = () => {
        if (index > 0) {
            const preBlock = document.querySelector(
                `.board-block[data-index='${attempts}${index - 1}']`
            );
            preBlock.innerHTML = "";
        }
        if (index !== 0) index -= 1;
    };

    const handleKeyDown = (e) => {
        const key = e.key.toUpperCase();
        const keyCode = e.keyCode;
        const thisBlock = document.querySelector(
            `.board-block[data-index='${attempts}${index}']`
        );

        if (e.key === "Backspace") handleBackspace();
        else if (index === 5)
            if (e.key === "Enter") handleEnterKey();
            else return;
        else if ("a" <= e.key && e.key <= "z") {
            thisBlock.innerHTML = key;
            index += 1;
        }
    };

    const startTimer = () => {
        const 시작_시간 = new Date();

        function setTime() {
            const 현재_시간 = new Date();
            const 흐른_시간 = new Date(현재_시간 - 시작_시간);

            const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
            const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");

            const timeH1 = document.querySelector(".time");
            timeH1.innerHTML = `${분}:${초}`;
        }

        timer = setInterval(setTime, 1000);
    };

    startTimer();
    window.addEventListener("keydown", handleKeyDown);
}

appStart();
