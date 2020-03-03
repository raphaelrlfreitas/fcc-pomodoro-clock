import React from 'react'
import './../styles/PomodoroClock.css'
import TimeLengthController from './TimeLengthController';

class PomodoroClock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      breakLength: 5,
      sessionLength: 25,
      running: false,
      clockType: 'Session',
      buzzer: false,
      timer: 1500,
      intervalID: '',
    }

    this.handleTimerController = this.handleTimerController.bind(this);
    this.clockify = this.clockify.bind(this);
    this.handleTimer = this.handleTimer.bind(this);
    this.beginCountdown = this.beginCountdown.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.clockTypeControl = this.clockTypeControl.bind(this);

  }

  handleTimerController(e) {

    const {breakLength, sessionLength, timer, running} = this.state;

    if(!running){

      e.target.getAttribute('value') === 'inc' ? 
      this.setState({
        breakLength: 
          (e.target.getAttribute('id').indexOf('break') !== -1 && breakLength < 60) ?
          breakLength + 1 :
          breakLength,
        sessionLength: 
          (e.target.getAttribute('id').indexOf('session') !== -1 && sessionLength < 60) ?
          sessionLength + 1 :
          sessionLength,
        timer: 
          e.target.getAttribute('id').indexOf('session') !== -1 ?
          (sessionLength + 1) * 60 :
          timer 
      })
      :
      this.setState({
        breakLength: 
        (e.target.getAttribute('id').indexOf('break') !== -1 && breakLength !== 1) ?
        breakLength - 1 :
        breakLength,
        sessionLength: 
        (e.target.getAttribute('id').indexOf('session') !== -1 && sessionLength !== 1) ?
        sessionLength - 1 :
        sessionLength,
        timer: 
        (e.target.getAttribute('id').indexOf('session') !== -1 && sessionLength !== 1)?
        (sessionLength - 1) * 60 :
        timer 
      })

    }
  }

  clockify() {
    const { timer } = this.state;
    
    let minutes = Math.floor(timer/60);
    let seconds = timer - (minutes * 60);

    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return minutes + ':' + seconds
  }

  beginCountdown() {
    this.setState({
      intervalID: setInterval(() => {
        this.decrementTimer(); 
       }, 1000)
    })
  }

  decrementTimer() {
    let timer = this.state.timer;
    this.setState({
      timer: timer -1,
    })
    this.clockTypeControl();

  }

  handleTimer() {
    const {running, intervalID} = this.state;

    if (!running) {
      this.beginCountdown();
      this.setState({
        running: true,
      })
    }
    else {
      this.setState({
        running: false,
      })
      clearInterval(intervalID); 
    }
  }

  handleReset(){
    const { intervalID } = this.state;

    this.setState({
      breakLength: 5,
      sessionLength: 25,
      running: false,
      clockType: 'Session',
      buzzer: false,
      timer: 1500,
      intervalID: '',
    })
    clearInterval(intervalID);
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }

  clockTypeControl(){
    let { timer, clockType, sessionLength, breakLength } = this.state;
    
    if(timer < 0){
      this.setState({
        clockType: clockType === 'Session' ? 'Break' : 'Session',
        timer: clockType === 'Session' ? (breakLength * 60) : (sessionLength * 60)
      })
      this.audioBeep.play();
    }

  }

  render(){
    const {
      sessionLength,
      breakLength,
      running,
      clockType,
    } = this.state
    return(
      <div className="clock-container">
        <h1>My Pomodoro Clock</h1>
        <div className="controllers-container">
          <TimeLengthController 
            title="Session Duration"
            titleID="session-label"
            incrementID="session-increment"
            decrementID="session-decrement"
            timerID="session-length"
            timerLength={sessionLength}
            onClick={this.handleTimerController}
          />
          <TimeLengthController 
            title="Break Duration"
            titleID="break-label"
            incrementID="break-increment"
            decrementID="break-decrement"
            timerID="break-length"
            timerLength={breakLength}
            onClick={this.handleTimerController}
          />
        </div>

        <div className="timer-container">
          <h2 id="timer-label">{clockType}</h2>
          <div id="time-left">{this.clockify()}</div>
        </div>

        <div className="timer-controllers">
          <span id="start_stop" onClick={this.handleTimer}>{ running ? '\u23F8' : '\u25B6'}</span>
          <span id="reset" onClick={this.handleReset}>{'\u21BB'}</span>
        </div>

        <audio id="beep" preload="auto" 
          src="https://goo.gl/65cBl1"
          ref={(audio) => { this.audioBeep = audio; }} />
      </div>
    )
  }

}

export default PomodoroClock;