import React, { useEffect, useState } from "react";
import "./ProgressBar.css";

function ProgressBar({ initialSec, secRemaining, pomodoroTimer, restSec }) {
    const [progressionStyle, setProgressionStyle] = useState({
        height: "5px",
        borderRadius: "10px",
        width: "0px",
    });

    useEffect(() => {
        progression();
        // eslint-disable-next-line
    }, [secRemaining]);

    const progression = () => {
        let percentProgress;
        if (pomodoroTimer) {
            percentProgress = (initialSec - secRemaining) / initialSec;
        } else {
            percentProgress = (restSec - secRemaining) / restSec;
        }
        const proessionByPx = Math.floor(percentProgress * 300, 1);
        setProgressionStyle({ width: `${proessionByPx}px` });
    };

    return (
        <div className="progress-bar">
            <div className="bar">
                <div id="progression" style={progressionStyle}></div>
            </div>
        </div>
    );
}

export default ProgressBar;
