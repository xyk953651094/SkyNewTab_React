import React from "react";
import {Popover, Button, Space, Typography} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";
import {
    getTimeDetails,
    getGreetContent,
    getGreetIcon,
    httpRequest, changeThemeColor
} from "../typescripts/publicFunctions";
import {ThemeColorInterface} from "../typescripts/publicInterface";

const {Text} = Typography;

type propType = {
    themeColor: ThemeColorInterface,
}

type stateType = {
    backgroundColor: string,
    fontColor: string,
    greetIcon: string,
    greetContent: string,
    holidayContent: string,
    calendar: string,
    suit: string,
    avoid: string,
}

interface GreetComponent {
    state: stateType,
    props: propType
}

class GreetComponent extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {
            backgroundColor: "",
            fontColor: "",
            greetIcon: getGreetIcon(),
            greetContent: getGreetContent(),
            holidayContent: "暂无信息",
            calendar: getTimeDetails(new Date()).showDate4 + " " + getTimeDetails(new Date()).showWeek,
            suit: "暂无信息",
            avoid: "暂无信息",
        };
    }

    // 请求完成后处理步骤
    setHoliday(data: any) {
        let holidayContent = data.solarTerms;
        if (data.solarTerms.indexOf("后") === -1) {
            holidayContent = "今日" + holidayContent;
        }
        if (data.typeDes !== "休息日" && data.typeDes !== "工作日"){
            holidayContent = holidayContent + " · " + data.typeDes;
        }

        let timeDetails = getTimeDetails(new Date());
        this.setState({
            holidayContent: holidayContent,
            calendar: timeDetails.showDate4 + " " + timeDetails.showWeek + "｜" +
                data.yearTips + data.chineseZodiac + "年｜" + data.lunarCalendar,
            suit: data.suit.replace(/\./g, " · "),
            avoid: data.avoid.replace(/\./g, " · "),
        });
    }

    // 获取节假日信息
    getHoliday() {
        let tempThis = this;
        let headers = {};
        let url = "https://www.mxnzp.com/api/holiday/single/" + getTimeDetails(new Date()).showDate3;
        let data = {
            "app_id": "cicgheqakgmpjclo",
            "app_secret": "RVlRVjZTYXVqeHB3WCtQUG5lM0h0UT09",
        };
        httpRequest(headers, url, data, "GET")
            .then(function(resultData: any){
                localStorage.setItem("lastHolidayRequestTime", String(new Date().getTime()));  // 保存请求时间，防抖节流
                if (resultData.code === 1) {
                    localStorage.setItem("lastHoliday", JSON.stringify(resultData.data));      // 保存请求结果，防抖节流
                    tempThis.setHoliday(resultData.data);
                }
            })
            .catch(function(){
                // 请求失败也更新请求时间，防止超时后无信息可显示
                localStorage.setItem("lastHolidayRequestTime", String(new Date().getTime()));  // 保存请求时间，防抖节流
            });
    }

    componentDidMount() {
        // 防抖节流
        let lastRequestTime: any = localStorage.getItem("lastHolidayRequestTime");
        let nowTimeStamp = new Date().getTime();
        if(lastRequestTime === null) {  // 第一次请求时 lastRequestTime 为 null，因此直接进行请求赋值 lastRequestTime
            this.getHoliday();
        }
        else if(nowTimeStamp - parseInt(lastRequestTime) > 60 * 60 * 1000) {  // 必须多于一小时才能进行新的请求
            this.getHoliday();
        }
        else {  // 一小时之内使用上一次请求结果
            let lastHoliday: any = localStorage.getItem("lastHoliday");
            if (lastHoliday) {
                lastHoliday = JSON.parse(lastHoliday);
                this.setHoliday(lastHoliday);
            }
        }

        setInterval(() => {
            this.setState({
                greetIcon: getGreetIcon(),
                greetContent: getGreetContent(),
            })
        }, 60 * 1000);
    }

    componentWillReceiveProps(nextProps: any, prevProps: any) {
        if (nextProps.themeColor !== prevProps.themeColor) {
            this.setState({
                backgroundColor: nextProps.themeColor.componentBackgroundColor,
                fontColor: nextProps.themeColor.componentFontColor,
            }, ()=>{
                changeThemeColor("#greetBtn", this.state.backgroundColor, this.state.fontColor);
            });
        }
    }

    render() {
        const popoverContent = (
            <Space direction="vertical">
                <Space>
                    <CheckCircleOutlined />
                    <Text style={{color: this.state.fontColor}}>{" 宜：" + this.state.suit}</Text>
                </Space>
                <Space>
                    <CloseCircleOutlined />
                    <Text style={{color: this.state.fontColor}}>{" 忌：" + this.state.avoid}</Text>
                </Space>
            </Space>
        );
        
        return (
            <Popover
                title={this.state.calendar}
                content={popoverContent} placement="topLeft" color={this.state.backgroundColor}>
                <Button shape="round" icon={<i className={this.state.greetIcon}> </i>} size={"large"}
                        id={"greetBtn"}
                        className={"componentTheme zIndexHigh"}
                        style={{}}
                >
                    {this.state.greetContent  + "｜" + this.state.holidayContent}
                </Button>
            </Popover>
        );
    }
}

export default GreetComponent;