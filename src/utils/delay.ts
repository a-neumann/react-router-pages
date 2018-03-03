// tslint:disable:no-console

export default (ms: number, untilRandom = 0, logMessage: string = null) => new Promise((resolve, reject) => {

    let delayTime = ms;

    if (untilRandom) {
        delayTime = Math.floor(Math.random() * (untilRandom - ms + 1) + ms);
    }

    setTimeout(() => {

        if (logMessage) {
            console.log(`${logMessage} — waited ${delayTime} milliseconds.`);
        }

        resolve();

    }, delayTime);
});
