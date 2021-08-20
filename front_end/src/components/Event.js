import React from 'react';
import {PieChart} from 'react-minimal-pie-chart';


class Event extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
    }

    render() {
        return (
            <div>
                <PieChart data={this.props.eventStatus.result}
                          label={({dataEntry}) => (dataEntry.value > 0)?`${dataEntry.title}: ${dataEntry.value}`:''}
                          style={{height: '400px'}}
                          radius={PieChart.defaultProps.radius - 7}
                          labelStyle={{fontSize: '5px', fontFamily: 'sans-serif'}}
                          labelPosition={112}
                          animate={true}
                          animationDuration={500}
                          lineWidth={50}/>
            </div>
        )
    }
}

export default Event;
