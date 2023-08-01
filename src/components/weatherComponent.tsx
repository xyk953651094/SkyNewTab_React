import React from "react";
import {Button, Popover, Space, Typography} from "antd";
import {changeThemeColor, getWeatherIcon, httpRequest} from "../typescripts/publicFunctions";
import {ThemeColorInterface} from "../typescripts/publicInterface";

const {Text} = Typography;

type propType = {
    themeColor: ThemeColorInterface,
    searchEngine: "bing" | "baidu" | "google"
}

type stateType = {
    backgroundColor: string,
    fontColor: string,
    weatherIcon: string,
    weatherInfo: string,
    searchEngineUrl: string,
    region: string;
    humidity: string;
    pm25: string;
    rainfall: string;
    visibility: string;
    windInfo: string;
}

interface WeatherComponent {
    state: stateType,
    props: propType
}

class WeatherComponent extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {
            backgroundColor: "",
            fontColor: "",
            weatherIcon: "",
            weatherInfo: "暂无信息",
            searchEngineUrl: "https://www.bing.com/search?q=",
            region: "暂无信息",
            humidity: "暂无信息",
            pm25: "暂无信息",
            rainfall: "暂无信息",
            visibility: "暂无信息",
            windInfo: "暂无信息",
        };
    }

    weatherBtnOnClick() {
        window.open(this.state.searchEngineUrl + "天气", "_blank",);
    }

    setWeather(data: any) {
        this.setState({
            weatherIcon: getWeatherIcon(data.weatherData.weather),
            weatherInfo: data.weatherData.weather + "｜" + data.weatherData.temperature + "°C",
            region: data.region.replace("|", " · "),
            humidity: data.weatherData.humidity,
            pm25: data.weatherData.pm25,
            rainfall: data.weatherData.rainfall + "%",
            visibility: data.weatherData.visibility,
            windInfo: data.weatherData.windDirection + data.weatherData.windPower + "级",
        });
    }

    getWeather() {
        let tempThis = this;
        let headers = {};
        let url = "https://v2.jinrishici.com/info";
        let data = {};
        httpRequest(headers, url, data, "GET")
            .then(function (resultData: any) {
                localStorage.setItem("lastWeatherRequestTime", String(new Date().getTime()));  // 保存请求时间，防抖节流
                if (resultData.status === "success" && resultData.data.weatherData !== null) {
                    localStorage.setItem("lastWeather", JSON.stringify(resultData.data));      // 保存请求结果，防抖节流
                    tempThis.setWeather(resultData.data);
                }
            })
            .catch(function () {
                // 请求失败也更新请求时间，防止超时后无信息可显示
                localStorage.setItem("lastWeatherRequestTime", String(new Date().getTime()));  // 保存请求时间，防抖节流
            });
    }

    componentDidMount() {
        // 防抖节流
        let lastRequestTime: any = localStorage.getItem("lastWeatherRequestTime");
        let nowTimeStamp = new Date().getTime();
        if (lastRequestTime === null) {  // 第一次请求时 lastRequestTime 为 null，因此直接进行请求赋值 lastRequestTime
            this.getWeather();
        } else if (nowTimeStamp - parseInt(lastRequestTime) > 60 * 60 * 1000) {  // 必须多于一小时才能进行新的请求
            this.getWeather();
        } else {  // 一小时之内使用上一次请求结果
            let lastWeather: any = localStorage.getItem("lastWeather");
            if (lastWeather) {
                lastWeather = JSON.parse(lastWeather);
                this.setWeather(lastWeather);
            }
        }
    }

    componentWillReceiveProps(nextProps: any, prevProps: any) {
        if (nextProps.themeColor !== prevProps.themeColor) {
            this.setState({
                backgroundColor: nextProps.themeColor.componentBackgroundColor,
                fontColor: nextProps.themeColor.componentFontColor,
            }, () => {
                changeThemeColor("#weatherBtn", this.state.backgroundColor, this.state.fontColor);
            });
        }

        if (nextProps.searchEngine !== prevProps.searchEngine) {
            let tempSearchEngineUrl: string;
            switch (nextProps.searchEngine) {
                case "baidu":
                    tempSearchEngineUrl = "https://www.baidu.com/s?wd=";
                    break;
                case "bing":
                    tempSearchEngineUrl = "https://www.bing.com/search?q=";
                    break;
                case "brave":
                    tempSearchEngineUrl = "https://search.brave.com/search?q=";
                    break;
                case "duckduckgo":
                    tempSearchEngineUrl = "https://duckduckgo.com/?q=";
                    break;
                case "ghostery":
                    tempSearchEngineUrl = "https://ghosterysearch.com/search?q=";
                    break;
                case "google":
                    tempSearchEngineUrl = "https://www.google.com/search?q=";
                    break;
                case "sogou":
                    tempSearchEngineUrl = "https://www.sogou.com/web?query=";
                    break;
                case "startpage":
                    tempSearchEngineUrl = "https://startpage.com/do/search?q=";
                    break;
                case "wuzhuiso":
                    tempSearchEngineUrl = "https://www.wuzhuiso.com/s?ie=utf-8&fr=none&q=";
                    break;
                case "yandex":
                    tempSearchEngineUrl = "https://yandex.com/search/?text=";
                    break;
                default:
                    tempSearchEngineUrl = "https://www.bing.com/search?q=";
                    break;
            }
            this.setState({
                searchEngineUrl: tempSearchEngineUrl,
            })
        }
    }

    render() {
        const popoverContent = (
            <Space direction="vertical">
                <Space>
                    <i className="bi bi-moisture"></i>
                    <Text style={{color: this.state.fontColor}}>{" 空气湿度：" + this.state.humidity}</Text>
                </Space>
                <Space>
                    <i className="bi bi-water"></i>
                    <Text style={{color: this.state.fontColor}}>{" 空气质量：" + this.state.pm25}</Text>
                </Space>
                <Space>
                    <i className="bi bi-cloud-rain"></i>
                    <Text style={{color: this.state.fontColor}}>{" 降雨概率：" + this.state.rainfall}</Text>
                </Space>
                <Space>
                    <i className="bi bi-eye"></i>
                    <Text style={{color: this.state.fontColor}}>{" 视线距离：" + this.state.visibility}</Text>
                </Space>
                <Space>
                    <i className="bi bi-wind"></i>
                    <Text style={{color: this.state.fontColor}}>{" 风速情况：" + this.state.windInfo}</Text>
                </Space>
            </Space>
        );

        return (
            <Popover title={this.state.region} content={popoverContent} color={this.state.backgroundColor}>
                <Button shape="round" icon={<i className={this.state.weatherIcon}> </i>} size={"large"}
                        id={"weatherBtn"}
                        className={"componentTheme zIndexHigh"}
                        onClick={this.weatherBtnOnClick.bind(this)}
                >
                    {this.state.weatherInfo}
                </Button>
            </Popover>
        );
    }
}

export default WeatherComponent;