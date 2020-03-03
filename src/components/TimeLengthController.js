import React from 'react'
import './../styles/TimeLengthController.css'

const TimeLengthController = ({ title, titleID, timerLength, timerID, incrementID, decrementID, onClick }) => {

    return(
      <div className="time-controller">
        <h2 id={titleID}>{title}</h2>
        <span value="inc" id={incrementID} onClick={onClick}>&uarr;</span>
        <h2 id={timerID}>{timerLength}</h2>
        <span value="dec" id={decrementID} onClick={onClick}>&darr;</span>
      </div>
    );
}

export default TimeLengthController;