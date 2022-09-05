import React from "react";
import "../../App.css";
import {Button, message, Tooltip} from "antd";
import {changeThemeColor, getFontColor, getThemeColor} from "../../typescripts/publicFunctions";

type propType = {
    imageColor: string,
}

type stateType = {
    display: "none" | "block",
    backgroundColor: string,
    fontColor: string,
    weatherInfo: string,
}

interface WeatherComponent {
    state: stateType,
    props: propType
}

class WeatherComponent extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {
            display: "none",
            backgroundColor: "",
            fontColor: "",
            weatherInfo: "暂无天气信息",
        };
    }

    componentWillMount() {
        let tempThis = this;
        let weatherXHR  =new XMLHttpRequest();
        weatherXHR.open("GET","https://v2.jinrishici.com/info");
        weatherXHR.onload = function(){
            if(weatherXHR.status === 200){
                let reasult = JSON.parse(weatherXHR.responseText);

                if (reasult.status === 'success') {
                    tempThis.setState({
                        display: "block",
                        weatherInfo: reasult.data.weatherData.weather  + " ｜ "
                            + reasult.data.weatherData.temperature + "°C",
                    });
                }
                else {}
            }
            else{}
        }
        weatherXHR.onerror=function(){}
        weatherXHR.send();
    }

    componentWillReceiveProps(nextProps: any, prevProps: any) {
        if (nextProps !== prevProps) {
            changeThemeColor("#weatherBtn", nextProps.imageColor);
        }
    }

    render(){
        return (
            <Tooltip title={this.state.weatherInfo}>
                <Button shape="round" size={"large"}
                        id={"weatherBtn"}
                        className={"frostedGlass zIndexHigh"}
                        style={{
                            display: this.state.display,
                            backgroundColor: this.state.backgroundColor,
                            color: this.state.fontColor,
                            cursor: "default"
                        }}
                >
                    {this.state.weatherInfo}
                </Button>
            </Tooltip>
        );
    }
}

export default WeatherComponent;