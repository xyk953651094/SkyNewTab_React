import React from "react";
import {Button, Tooltip} from "antd";
import {CalendarOutlined} from "@ant-design/icons";
import {ThemeColorInterface} from "../../typescripts/publicInterface";
import {changeThemeColor} from "../../typescripts/publicFunctions";

type propType = {
    themeColor: ThemeColorInterface,
    display: "none" | "block",
    imageData: any,
}

type stateType = {
    backgroundColor: string,
    fontColor: string,
    createTime: string,
}

interface CreatTimeComponent {
    state: stateType,
    props: propType
}

class CreatTimeComponent extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {
            backgroundColor: "",
            fontColor: "",
            createTime: "暂无拍摄时间",
        };
    }

    componentWillReceiveProps(nextProps: any, prevProps: any) {
        if (nextProps.themeColor !== prevProps.themeColor) {
            this.setState({
                backgroundColor: nextProps.themeColor.componentBackgroundColor,
                fontColor: nextProps.themeColor.componentFontColor,
            });
        }

        if (nextProps.imageData && nextProps.imageData !== prevProps.imageData) {
            this.setState({
                createTime: nextProps.imageData.created_at.split("T")[0]
            }, ()=>{
                changeThemeColor("#createTimeBtn", this.state.backgroundColor, this.state.fontColor);
            })
        }
    }

    render() {
        return (
            <Tooltip title={"拍摄日期：" + this.state.createTime}  placement="bottomRight" color={this.state.backgroundColor}>
                <Button shape="round" icon={<CalendarOutlined />} size={"large"}
                        id={"createTimeBtn"}
                        className={"componentTheme zIndexHigh"}
                        style={{
                            display: this.props.display,
                            cursor: "default"
                        }}
                >
                    {this.state.createTime}
                </Button>
            </Tooltip>
        );
    }
}

export default CreatTimeComponent;