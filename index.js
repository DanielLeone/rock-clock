import {Component} from 'preact';
import {RockClock} from "./rock_clock";
import './style.css';

export default class App extends Component {
    render() {
        return (
            <div>
                <RockClock/>
            </div>
        );
    }
}
