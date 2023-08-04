import React from "react";
import {Row, Col, Avatar, Button, Divider, List, message, Popover, Space, Typography} from "antd";
import {
    CameraOutlined,
    EnvironmentOutlined,
    InfoCircleOutlined,
    LinkOutlined,
    UserOutlined
} from "@ant-design/icons";
import {unsplashUrl} from "../typescripts/publicConstants";
import {changeThemeColor, getFontColor, isEmptyString} from "../typescripts/publicFunctions";
import {ThemeColorInterface} from "../typescripts/publicInterface";
import "../stylesheets/publicStyles.scss"

const {Text} = Typography;
const btnMaxSize = 50;

type propType = {
    themeColor: ThemeColorInterface,
    display: "none" | "block",
    imageData: any,
}

type stateType = {
    hoverColor: string,
    backgroundColor: string,
    fontColor: string,
    authorName: string,
    authorLink: string,
    authorIconUrl: string,
    authorCollections: number,
    authorLikes: number,
    authorPhotos: number,
    imageLink: string,
    imagePreviewUrl: string,
    imageLocation: string,
    imageDescription: string,
    btnMaxSize: number,
}

interface AuthorComponent {
    state: stateType,
    props: propType
}

class AuthorComponent extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {
            hoverColor: "",
            backgroundColor: "",
            fontColor: "",
            authorName: "暂无信息",
            authorLink: "",
            authorIconUrl: "",
            authorCollections: 0,
            authorLikes: 0,
            authorPhotos: 0,
            imageLink: "",
            imagePreviewUrl: "",
            imageLocation: "暂无信息",
            imageDescription: "暂无信息",
            btnMaxSize: 45,
        };
    }

    btnMouseOver(e: any) {
        e.currentTarget.style.backgroundColor = this.state.hoverColor;
        e.currentTarget.style.color = getFontColor(this.state.hoverColor);
    }

    btnMouseOut(e: any) {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = this.state.fontColor;
    }

    authorBtnOnClick() {
        if (!isEmptyString(this.state.authorLink)) {
            window.open(this.state.authorLink);
        } else {
            message.error("暂无链接")
        }
    }

    gotoAuthorBtnOnClick() {
        if (!isEmptyString(this.state.authorLink)) {
            window.open(this.state.authorLink + unsplashUrl);
        } else {
            message.error("无跳转链接");
        }
    }

    gotoImageBtnOnClick() {
        if (!isEmptyString(this.state.imageLink)) {
            window.open(this.state.imageLink + unsplashUrl);
        } else {
            message.error("无跳转链接");
        }
    }

    componentWillReceiveProps(nextProps: any, prevProps: any) {
        if (nextProps.themeColor !== prevProps.themeColor) {
            this.setState({
                hoverColor: nextProps.themeColor.themeColor,
                backgroundColor: nextProps.themeColor.componentBackgroundColor,
                fontColor: nextProps.themeColor.componentFontColor,
            });
        }

        if (nextProps.imageData && nextProps.imageData !== prevProps.imageData) {
            this.setState({
                authorName: nextProps.imageData.user.name,
                authorLink: nextProps.imageData.user.links.html,
                authorIconUrl: nextProps.imageData.user.profile_image.small,
                authorCollections: nextProps.imageData.user.total_collections,
                authorLikes: nextProps.imageData.user.total_likes,
                authorPhotos: nextProps.imageData.user.total_photos,
                imageLink: nextProps.imageData.links.html,
                imagePreviewUrl: nextProps.imageData.urls.thumb,
                imageLocation: isEmptyString(nextProps.imageData.location.name) ? "暂无信息" : nextProps.imageData.location.name,
                imageDescription: isEmptyString(nextProps.imageData.alt_description) ? "暂无信息" : nextProps.imageData.alt_description,
            }, () => {
                changeThemeColor("#authorBtn", this.state.backgroundColor, this.state.fontColor);
            })
        }
    }

    render() {
        const popoverTitle = (
            <Row align={"middle"}>
                <Col span={10}>
                    <Text style={{color: this.state.fontColor}}>{"摄影师与图片信息"}</Text>
                </Col>
                <Col span={14} style={{textAlign: "right"}}>
                    <Space>
                        <Button type="text" shape="round" icon={<LinkOutlined/>}
                                onMouseOver={this.btnMouseOver.bind(this)}
                                onMouseOut={this.btnMouseOut.bind(this)} onClick={this.gotoAuthorBtnOnClick.bind(this)}
                                style={{color: this.state.fontColor}}>
                            {"摄影师主页"}
                        </Button>
                        <Button type="text" shape="round" icon={<LinkOutlined/>}
                                onMouseOver={this.btnMouseOver.bind(this)}
                                onMouseOut={this.btnMouseOut.bind(this)}
                                onClick={this.gotoImageBtnOnClick.bind(this)}
                                style={{color: this.state.fontColor}}>
                            {"图片主页"}
                        </Button>
                    </Space>
                </Col>
            </Row>
        );

        const popoverContent = (
            <List>
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar size="large" src={this.state.authorIconUrl} alt={"作者"}/>}
                        title={
                            <Button type="text" shape="round" icon={<UserOutlined/>} style={{color: this.state.fontColor, cursor: "default"}}
                                    onMouseOver={this.btnMouseOver.bind(this)} onMouseOut={this.btnMouseOut.bind(this)}>
                                {this.state.authorName.length < btnMaxSize? this.state.authorName : this.state.authorName.substring(0, btnMaxSize) + "..."}
                            </Button>
                        }
                        description={
                            <Space>
                                <Button type="text" shape="round" icon={<i className="bi bi-collection"></i>} style={{color: this.state.fontColor, cursor: "default"}}
                                        onMouseOver={this.btnMouseOver.bind(this)} onMouseOut={this.btnMouseOut.bind(this)}>
                                    {" " + this.state.authorCollections}
                                </Button>
                                <Divider type="vertical" style={{borderColor: this.state.fontColor}}/>
                                <Button type="text" shape="round" icon={<i className="bi bi-heart"></i>} style={{color: this.state.fontColor, cursor: "default"}}
                                        onMouseOver={this.btnMouseOver.bind(this)} onMouseOut={this.btnMouseOut.bind(this)}>
                                    {" " + this.state.authorLikes}
                                </Button>
                                <Divider type="vertical" style={{borderColor: this.state.fontColor}}/>
                                <Button type="text" shape="round" icon={<i className="bi bi-images"></i>} style={{color: this.state.fontColor, cursor: "default"}}
                                        onMouseOver={this.btnMouseOver.bind(this)} onMouseOut={this.btnMouseOut.bind(this)}>
                                    {" " + this.state.authorPhotos}
                                </Button>
                            </Space>
                        }
                    />
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar size="large" shape={"square"} src={this.state.imagePreviewUrl} alt={"信息"}/>}
                        title={
                            <Button type="text" shape="round" icon={<EnvironmentOutlined/>} style={{color: this.state.fontColor, cursor: "default"}}
                                    onMouseOver={this.btnMouseOver.bind(this)} onMouseOut={this.btnMouseOut.bind(this)}>
                                {this.state.imageLocation.length < btnMaxSize? this.state.imageLocation : this.state.imageLocation.substring(0, btnMaxSize) + "..."}
                            </Button>
                        }
                        description={
                            <Button type="text" shape="round" icon={<InfoCircleOutlined/>} style={{color: this.state.fontColor, cursor: "default"}}
                                    onMouseOver={this.btnMouseOver.bind(this)} onMouseOut={this.btnMouseOut.bind(this)}>
                                {this.state.imageDescription.length < btnMaxSize? this.state.imageDescription : this.state.imageDescription.substring(0, btnMaxSize) + "..."}
                            </Button>
                        }
                    />
                </List.Item>
            </List>
        );

        return (
            <Popover title={popoverTitle} content={popoverContent} placement="topRight" color={this.state.backgroundColor}
                     overlayStyle={{width: "500px"}}>
                <Button shape="round" icon={<CameraOutlined/>} size={"large"}
                        id={"authorBtn"}
                        className={"componentTheme zIndexHigh"}
                        onClick={this.authorBtnOnClick.bind(this)}
                        style={{
                            display: this.props.display,
                        }}
                >
                    {"by " + this.state.authorName + " on Unsplash"}
                </Button>
            </Popover>
        );
    }
}

export default AuthorComponent;