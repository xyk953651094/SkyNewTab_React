import React from "react";
import {Button, Card, Col, Row} from "antd";
import {LikeOutlined, DislikeOutlined, MailOutlined} from "@ant-design/icons";
import {getFontColor} from "../typescripts/publicFunctions";
import {PreferenceDataInterface} from "../typescripts/publicInterface";

type propType = {
    hoverColor: string,
    backgroundColor: string,
    fontColor: string,
    preferenceData: PreferenceDataInterface,
}

type stateType = {}

interface PreferenceLinkComponent {
    state: stateType,
    props: propType
}

class PreferenceLinkComponent extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    btnMouseOver(e: any) {
        e.currentTarget.style.backgroundColor = this.props.hoverColor;
        e.currentTarget.style.color = getFontColor(this.props.hoverColor);
    }

    btnMouseOut(e: any) {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = this.props.fontColor;
    }

    render() {
        return (
            <Card title={"联系作者"} size={"small"}
                  extra={<MailOutlined style={{color: this.props.fontColor}}/>}
                  style={{border: "1px solid " + this.props.fontColor}}
                  headStyle={{
                      backgroundColor: this.props.backgroundColor,
                      color: this.props.fontColor,
                      borderBottom: "2px solid " + this.props.fontColor
                  }}
                  bodyStyle={{backgroundColor: this.props.backgroundColor}}
            >
                <Row gutter={[0, 8]}>
                    <Col span="12">
                        <Button type={"text"} shape={this.props.preferenceData.buttonShape} icon={<LikeOutlined/>}
                                href={"mailto:xyk953651094@qq.com?&subject=云开新标签页-功能建议"} target={"_blank"}
                                onMouseOver={this.btnMouseOver.bind(this)}
                                onMouseOut={this.btnMouseOut.bind(this)}
                                style={{color: this.props.fontColor}}>
                            功能建议
                        </Button>
                    </Col>
                    <Col span="12">
                        <Button type={"text"} shape={this.props.preferenceData.buttonShape} icon={<DislikeOutlined/>}
                                href={"mailto:xyk953651094@qq.com?&subject=云开新标签页-问题反馈"} target={"_blank"}
                                onMouseOver={this.btnMouseOver.bind(this)}
                                onMouseOut={this.btnMouseOut.bind(this)}
                                style={{color: this.props.fontColor}}>
                            问题反馈
                        </Button>
                    </Col>
                </Row>
            </Card>
        );
    }
}

export default PreferenceLinkComponent;