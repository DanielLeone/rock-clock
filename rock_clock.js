import {Component} from 'preact';
import './style';

function getCurrentTime() {
    const now = new Date();
    return fromDate(now);
}

function fromDate(date) {
    return {
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
    }
}

function printTime(time) {
    return time ? `${time.hour} : ${time.minute} : ${time.second}` : ''
}

function clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
}


function difference(timeA, timeB) {
    const dateA = new Date(2000, 0, 1, timeA.hour, timeA.minute, timeA.second);
    const dateB = new Date(2000, 0, 1, timeB.hour, timeB.minute, timeB.second);

    if (dateB < dateA) {
        dateB.setDate(dateB.getDate() + 1);
    }

    const diff = dateB - dateA;

    let sec = diff / 1000;
    const hh = Math.floor(sec / 60 / 60);
    sec -= hh * 60 * 60;
    const mm = Math.floor(sec / 60);
    sec -= mm * 60;
    const ss = Math.floor(sec);
    return {
        hour: hh,
        minute: mm,
        second: ss
    };
}


export class RockClock extends Component {
    constructor(props) {
        super(props);
        this.setState({
            targetFrameRate: 1,
            alarm: {
                hour: undefined,
                minute: undefined,
                second: undefined
            },
            current: getCurrentTime()
        });

        if (typeof window !== "undefined") {
            window.onYouTubeIframeAPIReady = () => {
                const player = new YT.Player('player', {
                    height: '900',
                    width: '1600',
                    videoId: 'jufCD0pVQn4',
                    playerVars: {
                        playlist: 'jufCD0pVQn4',
                        loop: 1
                    },
                    events: {
                        'onReady': (event) => {
                            this.ready(event.target);
                        },
                        'onStateChange': () => {
                            if (event.data == YT.PlayerState.PLAYING) {
                            }
                        }
                    }
                });
            };

            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    }

    ready(player) {
        this._player = player;
    }

    fireAlarm() {
        if (this._player) {
            this._player.setVolume(100);
            this._player.playVideo();
        } else {
            console.log('someone is gonna be late for work... fuarrkk');
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.current && nextState.alarm) {
            const d = difference(nextState.current, nextState.alarm);
            if (d.hour === 0 && d.minute === 0 && d.second < 10) {
                // alarm the fuck out of this shit it's go time!
                this.fireAlarm();
            }
        }
    }

    componentDidMount() {
        this._interval = window.setInterval(() => {
            const newTime = getCurrentTime();
            if (newTime.hour !== this.state.current.hour ||
                newTime.minute !== this.state.current.minute ||
                newTime.second !== this.state.current.second)
                this.setState({
                    current: newTime
                });
        }, 100);
    }

    componentWillUnmount() {
        if (this._interval !== undefined) {
            window.clearInterval(this._interval)
        }
    }

    updateHour(e) {
        this.setState({
            alarm: Object.assign({}, this.state.alarm, {
                hour: clamp(e.target.value, 0, 23)
            })
        });
    }

    updateMinute(e) {
        this.setState({
            alarm: Object.assign({}, this.state.alarm, {
                minute: clamp(e.target.value, 0, 59)
            })
        });
    }

    updateSecond(e) {
        this.setState({
            alarm: Object.assign({}, this.state.alarm, {
                second: clamp(e.target.value, 0, 59)
            })
        });
    }

    render(props, state, context) {
        console.log('rendering');
        return (
            <div className="container">
                <h1>rock clock</h1>
                <div>
                    <input type="number" name="hour" value={state.alarm.hour} onKeyUp={e => this.updateHour(e)}/>
                    <span>:</span>
                    <input type="number" name="minute" value={state.alarm.minute} onKeyUp={e => this.updateMinute(e)}/>
                    <span>:</span>
                    <input type="number" name="second" value={state.alarm.second} onKeyUp={e => this.updateSecond(e)}/>
                </div>
                <h1>alarm set for {printTime(state.alarm)}</h1>
                <h1>current time {printTime(state.current)}</h1>
                <h1>focus in {printTime(difference(state.current, state.alarm))}</h1>
                <div id="player"></div>
            </div>
        );
    }
}