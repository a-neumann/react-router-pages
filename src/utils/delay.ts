export default (ms: number, untilRandom = 0, logMessage: string = null) => new Promise((res, rej) => {

    let delayTime = ms;

    if (untilRandom) {
        delayTime = Math.floor(Math.random() * (untilRandom - ms + 1) + ms);
    }

    if (logMessage) {
        console.log(logMessage);
    }

    setTimeout(() => {

        const message = logMessage ?
            `${logMessage} — done after ${delayTime} millisecond.` :
            `…${delayTime} millisecond had passed.`;

        console.log(message);

        res();
    }, delayTime);
});