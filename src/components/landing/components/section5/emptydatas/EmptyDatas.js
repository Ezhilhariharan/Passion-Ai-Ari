import React, { Component } from "react";
import { getBackDatas } from "../api/Get";
class EmptyDatas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: [],
    };
  }
  componentDidMount() {
    this.getDatadKalai();
  }
  getDatadKalai() {
    getBackDatas()
      .then((res) => {
      })
      .catch((err) => {
      });
  }
  render() {
    return <div></div>;
  }
}
export default EmptyDatas;
