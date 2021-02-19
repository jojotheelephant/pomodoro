import React, { useEffect, useState } from "react";
import "./Award.css";

function Award({ completedCount }) {
    const [stars, setStars] = useState([]);

    useEffect(() => {
        getStars();
        // eslint-disable-next-line
    }, [completedCount]);

    const getStars = () => {
        let tempStars = [];
        for (let i = 0; i < completedCount; i++) {
            tempStars.push(<i key={i} className="bi bi-star-fill starr"></i>);
        }
        setStars(tempStars);
    };

    return (
        <>
            <div className="awards">
                <i className="bi bi-award-fill awardd"></i>
                <div className="star-block">{stars}</div>
            </div>
        </>
    );
}

export default Award;
