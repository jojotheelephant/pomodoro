import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import Award from "./Award";
import "./TimerBlock.css";

function TimerBlock() {
    // if counter is counting mode
    const [playState, setPlayState] = useState(false);
    // if counting pomodoro, then true, if counting rest then false
    const [pomodoroTimer, setPomodoroTimer] = useState(true);
    // default starting time 25:00 min
    const [initialSec] = useState(1500);
    // rest time 5:00 min
    const [restSec] = useState(300);
    // keeps track of number of seconds remaining in timer
    const [secRemaining, setSecRemaining] = useState(0);
    // used to help calculate time remaining in milliseconds
    const [endMS, setEndMS] = useState(0);
    // formatted display time
    const [formatted, setFormatted] = useState("");
    // ID for setInterval. use this ID to clearInterval
    const [intervalId, setIntervalId] = useState(null);
    // count total number of completed pomodoro rounds
    const [completedCount, setCompletedCount] = useState(0);

    // loads initial timer value and completed count from localstorage if there.
    useEffect(() => {
        setSecRemaining(initialSec);
        if (window.localStorage.getItem("pomodoro_award") !== null) {
            const grabCountFromLocalStorage = parseInt(window.localStorage.getItem("pomodoro_award"));
            setCompletedCount(grabCountFromLocalStorage);
        }
        // eslint-disable-next-line
    }, []);

    // updates the timer in the display.
    useEffect(() => {
        formatTime();
        toggleTimer();
        // eslint-disable-next-line
    }, [secRemaining]);

    // checks to see if play or pause has been pressed
    useEffect(() => {
        if (playState) {
            const id = window.setInterval(() => {
                const secondsRemaining = (endMS - new Date().getTime()) / 1000;
                setSecRemaining(secondsRemaining);
                setIntervalId(id);
            }, 250);
        } else if (!playState) {
            window.clearInterval(intervalId);
        }
        // eslint-disable-next-line
    }, [playState]);

    // update localstorage if count increases.
    useEffect(() => {
        window.localStorage.setItem("pomodoro_award", completedCount);
    }, [completedCount]);

    const formatTime = () => {
        let min = parseInt(secRemaining / 60, 10);
        let sec = parseInt(secRemaining % 60, 10);
        min = min < 10 ? `0${min}` : min;
        sec = sec < 10 ? `0${sec}` : sec;
        setFormatted(`${min}:${sec}`);
    };

    const playButton = () => {
        const currentTimeMS = new Date().getTime();
        setEndMS(currentTimeMS + secRemaining * 1000);
        setPlayState(!playState);
    };

    const reset = () => {
        pomodoroTimer ? setSecRemaining(initialSec) : setSecRemaining(restSec);
    };

    // this function does the following:
    // 1. checks when timer is < 0. checks if pomodoro timer or rest timer is running
    // 2. clearInterval
    // 3. Adds award to completion of pomodoro timer
    // 4. changes playstate to false
    // 5. resets timer to opposite timer
    // 6. triggers sound effect for completion.
    const toggleTimer = () => {
        if (secRemaining < 0 && pomodoroTimer) {
            window.clearInterval(intervalId);
            setCompletedCount(completedCount + 1);
            setPlayState(false);
            setPomodoroTimer(false);
            setSecRemaining(restSec);
            pomodoroSound();
        } else if (secRemaining < 0 && !pomodoroTimer) {
            window.clearInterval(intervalId);
            setPlayState(false);
            setPomodoroTimer(true);
            setSecRemaining(initialSec);
            restSound();
        }
    };

    // sound triggers when pomodoro timer reaches zero
    const pomodoroSound = () => {
        document
            .getElementById("pomodoro-sound")
            .play()
            .then()
            .catch((error) => console.log(error));
    };

    // sound triggers when rest timer reaches zero
    const restSound = () => {
        document
            .getElementById("rest-sound")
            .play()
            .then()
            .catch((error) => console.log(error));
    };

    return (
        <>
            <div className="timer-block">
                {pomodoroTimer ? (
                    <div className="remaining-time">{formatted}</div>
                ) : (
                    <div className="remaining-time restblue">{formatted}</div>
                )}

                <ProgressBar
                    initialSec={initialSec}
                    secRemaining={secRemaining}
                    pomodoroTimer={pomodoroTimer}
                    restSec={restSec}
                />
                {/* buttons */}
                <div className="play-pause__buttons">
                    {playState === false ? (
                        <>
                            <button className="play-pause" onClick={playButton}>
                                <i className="bi bi-play-fill play" width="32" height="32"></i>
                            </button>
                            <button className="play-pause stop" onClick={reset}>
                                {/* stop/reset button */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="44"
                                    height="44"
                                    fill="currentColor"
                                    className="bi bi-stop-fill"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z" />
                                </svg>
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="play-pause" onClick={() => setPlayState(!playState)}>
                                <i className="bi bi-pause-fill" width="32" height="32"></i>
                            </button>
                        </>
                    )}
                </div>
                {completedCount ? <Award completedCount={completedCount} /> : <></>}
            </div>
            <div>
                <audio id="rest-sound">
                    <source
                        src="https://freesound.org/data/previews/267/267337_3112522-lq.mp3"
                        type="audio/mpeg"
                    ></source>
                </audio>
                <audio id="pomodoro-sound">
                    <source
                        src="https://freesound.org/data/previews/527/527650_7724198-lq.mp3"
                        type="audio/mpeg"
                    ></source>
                </audio>
            </div>
        </>
    );
}

export default TimerBlock;
