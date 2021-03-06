import React, { Component } from "react";
import ReactDOM from "react-dom";
import Row from 'antd/lib/Row';
import Col from 'antd/lib/Col';
import Button from 'antd/lib/Button';
import Modal from 'antd/lib/Modal';
import Input from 'antd/lib/Input';
import Card from 'antd/lib/Card';
import Table from 'antd/lib/Table';
import { message } from "antd";
import { stringify } from "qs";
import mock from "../../../mockers/index.js";
import request from "./request";
import { host, port, isStatic, docPort } from "./config";
import { isObject, parseKey, handleRequest } from "./utils";

const { TextArea } = Input;
/* eslint no-underscore-dangle:0 */
const mockData = mock.__mockData || mock;


class ApiItem extends Component {
  state = {
    urlValue: "",
    theMockData: {},
    postParams: undefined
  };
  handleChange = e => {
    this.setState({
      urlValue: e.target.value
    });
  };

  handlePostParams = e => {
    let postParams = e.target.value;

    this.setState({
      postParams
    });
  };

  handleShowData = data => {
    if (this.props.onPostClick) {
      this.props.onPostClick(data);
    }
  };

  handlePostRequest = (u, url, postParams, method) => {
    let params;
    if (Object.prototype.toString.call(postParams) === "[object String]") {
      try {
        params = JSON.parse(postParams);
      } catch (e) {
        message.error("parse params error: ", JSON.stringify(e, null, 2));
      }
    }
    if (params) {
      if (method != "GET" && port) {
        request(`https://${host}${docPort}${u}`, {
          method: "POST",
          body: params
        }).then(data => {
          this.handleShowData(data);
        });
      } else {
        handleRequest(u, url, params, this.handleShowData);
      }
    }
  };

  render() {
    const { req, data } = this.props;
    const { method, url: u } = parseKey(req);
    const url = `https://${host}${port ? `:${port}` : ""}${u}`;
    let { urlValue, postParams } = this.state;

    const params = data.$params || {};
    const desc = data.$desc || "";

    const columns = [
      {
        key: "p",
        dataIndex: "p",
        title: "参数"
      },
      {
        key: "desc",
        dataIndex: "desc",
        title: "说明"
      },
      {
        key: "exp",
        dataIndex: "exp",
        title: "样例"
      }
    ];

    const dataSource = [];
    const getParams = {};
    Object.keys(params).forEach(p => {
      const pd = params[p];
      if (isObject(pd)) {
        getParams[p] = params[p].exp;
        dataSource.push({
          p,
          desc: params[p].desc,
          exp: params[p].exp
        });
      } else {
        getParams[p] = params[p];
        dataSource.push({
          p,
          desc: "",
          exp: params[p]
        });
      }
    });

    if (method === "GET") {
      if (!urlValue && dataSource.length > 0) {
        urlValue = `${url}?${stringify(getParams)}`;
      }
    }
    if (!urlValue) {
      urlValue = url;
    }

    if (!postParams) {
      postParams = JSON.stringify(getParams, null, 2);
    }

    return (
      <Card
        title={
          <p >
            <span>{method}</span>
            <span>{u}</span>
          </p>
        }
      >
        {!isStatic &&
          method === "GET" && (
            <div >
              <Row gutter={16}>
                <Col span={20}>
                  <Input
                    value={urlValue}
                    onChange={this.handleChange}
                    placeholder={url}
                  />
                </Col>
                <Col span={4}>
                  <a target="_blank" href={urlValue}>
                    send
                  </a>
                </Col>
              </Row>
            </div>
          )}
        {((isStatic && method === "GET") || method !== "GET") && (
          <div >
            <Row gutter={16}>
              <Col span={20}>
                <Input
                  value={urlValue}
                  onChange={this.handleChange}
                  placeholder={url}
                />
              </Col>
              <Col span={4}>
                <Button
                  type="primary"
                  onClick={() =>
                    this.handlePostRequest(u, url, postParams, method)
                  }
                  style={{ width: "100%" }}
                >
                  send
                </Button>
              </Col>
            </Row>
            {method !== "GET" &&
              dataSource.length > 0 && (
                <Row gutter={16}>
                  <Col span={24}>
                    <TextArea
                      style={{ marginTop: 16, width: "100%" }}
                      autosize={{ minRows: 2, maxRows: 20 }}
                      value={postParams}
                      onChange={this.handlePostParams}
                    />
                  </Col>
                </Row>
              )}
          </div>
        )}
        {desc && <p style={{ marginTop: 16 }}>{desc}</p>}
        {dataSource.length > 0 && (
          <div >
            <h3>Params</h3>
            <Table
              rowKey={record => record.p}
              pagination={false}
              size="small"
              columns={columns}
              dataSource={dataSource}
            />
          </div>
        )}
      </Card>
    );
  }
}

// eslint-disable-next-line
class ApiDoc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theMockData: {},
      modalVisible: false
    };
  }

  handleShowData = data => {
    this.setState({
      theMockData: data,
      modalVisible: true
    });
  };

  handleModalCancel = () => {
    this.setState({
      modalVisible: false
    });
  };

  render() {
    const { modalVisible, theMockData } = this.state;
    return (
      <div>
        <h1>API DOCS</h1>
        <Row>
          <Col md={16} xs={24}>
            <div>
              {Object.keys(mockData).map(key => (
                <ApiItem
                  key={key}
                  req={key}
                  data={mockData[key]}
                  onPostClick={this.handleShowData}
                />
              ))}
            </div>
          </Col>
        </Row>
        <Modal
          title="Response Body"
          visible={modalVisible}
          onOk={this.handleModalCancel}
          onCancel={this.handleModalCancel}
        >
          <TextArea
            autosize={{ minRows: 2, maxRows: 20 }}
            value={JSON.stringify(theMockData, null, 2)}
          />
        </Modal>
      </div>
    );
  }
}

export default ApiDoc;
