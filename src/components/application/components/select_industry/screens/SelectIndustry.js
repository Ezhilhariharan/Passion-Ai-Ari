import React, { Component } from "react";
import "../styles/Option.scss";
import "../styles/Selection.scss";
import { withRouter } from "react-router-dom";
import ReactPlayer from "react-player";
import axios from "axios";
import Selection from "./Selection";
import { Modal } from "bootstrap";
import { selectindustryText } from "../const/Const_selectIndustry";
import { API } from "../api/Api";
import { connect } from "react-redux";
import HorizontalScroll from "react-scroll-horizontal";
import ScrollArea from "react-scrollbar";
import ErrorModal from "../../../../common_Components/popup/ErrorModalpoup";
class Option extends Component {
  constructor(props) {
    super(props);
    this.state = {
      industries: [],
      getdata: "",
      data: "",
      setfilterlist: true,
      modalShow: false,
      error_messsage: "",
      playstate: false,
      locationKeys: [],
    };
    this.getselectindustrydata = this.getselectindustrydata.bind(this);
    this.onChange = this.onChange.bind(this);
    this.api = new API();
    this.modalRef = React.createRef();
    this.confirmModalRef = React.createRef();
    this.errorModal = React.createRef();
    this.showLoading = this.showLoading.bind(this);
    // window.location.replace("/carrerpath")
  }
  showModal = () => {
    const modalEle = this.modalRef.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
    this.play();
  };
  hideModal = () => {
    const modalEle = this.modalRef.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
    this.pause();
  };
  showConfirmModal = () => {
    const modalEle = this.confirmModalRef.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  hideConfirmModal = () => {
    const modalEle = this.confirmModalRef.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };
  showErrorModal = () => {
    const modalEle = this.errorModal.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  hideErrorModal = () => {
    const modalEle = this.errorModal.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };
  play = () => {
    this.setState({ playstate: true });
  };
  pause = () => {
    this.setState({ playstate: false });
  };
  showLoading() {
    this.props.loading({ loadingState: new Date().getTime() });
  }
  componentDidMount() {
    window.addEventListener("popstate", (event) => {
      window.location.assign("/carrerpath");
    });
    if (this.props.filterdata.filterData.length !== 0) {
      this.setState({
        industries: this.props.filterdata.filterData,
        industryList: this.props.filterdata.filterData,
        setfilterlist: false,
      });
    } else {
      this.api.getIndustry().then((response) => {
        if (response.status) {
          this.setState({
            industries: response.data,
            industryList: response.data,
          });
        }
      });
    }
    if (typeof axios.defaults.headers.common["Authorization"] === "undefined") {
      axios.defaults.headers.common["Authorization"] =
        "Token " + localStorage.getItem("passion_token");
    }
  }
  onChange(e) {
    this.setState({
      industries: this.state.industryList.filter((item) => {
        return item.name.toLowerCase().includes(e.target.value.toLowerCase());
      }),
    });
  }
  selectindustry = (id) => {
    this.showLoading();
    this.api.confirmIndustry(id).then((res) => {
      this.showLoading();
      // 
      if (res.status) {
        this.hideModal();
        this.hideConfirmModal();
        this.props.history.push("/home");
      } else {
        // this.showErrorModal();
        if (res.message) {
          if (typeof res.message === "object") {
            let value = Object.values(res.message);
            this.setState({ error_messsage: value[0], modalShow: true });
          } else {
            // 
            this.setState({ error_messsage: res.message, modalShow: true });
          }
        } else {
          this.setState({
            error_messsage: "Something Went Wrong",
            modalShow: true,
          });
        }
      }
    });
  };
  getselectindustrydata(props) {
    this.api.getIndustryVideo(props).then((res) => {
      if (res.status) {
        this.setState({ getdata: res.data }, () => {
          this.showModal();
        });
      } else {
        // this.showErrorModal();
        if (res.message) {
          if (typeof res.message === "object") {
            let value = Object.values(res.message);
            this.setState({ error_messsage: value[0], modalShow: true });
          } else {
            // 
            this.setState({ error_messsage: res.message, modalShow: true });
          }
        } else {
          this.setState({
            error_messsage: "Something Went Wrong",
            modalShow: true,
          });
        }
      }
    });
  }
  closeErrorModal = () => {
    this.setState({ error_messsage: "", modalShow: false });
  };
  render() {
    return (
      <div className="option">
        <div className="option-header  ">
          <div className="content-wrapper">
            <h1 className="">{selectindustryText.title}</h1>
            <div className="form-group mt-5 d-flex flex-row">
              <input
                type="text"
                className="input"
                onChange={(e) => this.onChange(e)}
                placeholder="Search"
              />
              <i class="fa-light fa-magnifying-glass mt-2"></i>
            </div>
          </div>
        </div>
        <div className="option-selection d-none d-sm-block ">
          {this.state.setfilterlist ? (
            <HorizontalScroll>
              <div className="slider">
                {this.state.industries.map((items, index) => (
                  <Selection
                    getselectindustrydata={this.getselectindustrydata}
                    items={items}
                    key={index}
                  />
                ))}
              </div>
            </HorizontalScroll>
          ) : (
            <HorizontalScroll>
              <div className="slider">
                {this.state.industries.map((items, index) => (
                  <Selection
                    getselectindustrydata={this.getselectindustrydata}
                    items={items}
                    key={index}
                  />
                ))}
              </div>
            </HorizontalScroll>
          )}
        </div>
        <div className="option-selection d-block d-sm-none">
          {this.state.setfilterlist ? (
            <ScrollArea
              speed={0.5}
              className="slider-mobile"
              horizontal={false}
              verticalScrollbarStyle={{
                background: "transparent",
                width: "0px",
              }}
              smoothScrolling={true}
              minScrollSize={1}
            >
              <div>
                {this.state.industries.map((items, index) => (
                  <Selection
                    getselectindustrydata={this.getselectindustrydata}
                    items={items}
                    key={index}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div>
              {this.state.industries.map((items, index) => (
                <Selection
                  getselectindustrydata={this.getselectindustrydata}
                  items={items}
                  key={index}
                />
              ))}
            </div>
          )}
        </div>
        <div className="option-footer d-flex flex-row justify-content-center">
          <button
            className="btn-yellow  "
            onClick={() => this.props.history.goBack()}
          >
            {selectindustryText.back}
          </button>
        </div>
        <div className="selectindustry-video">
          <div className="modal " id="selectindustry" ref={this.modalRef}>
            <div class="modal-dialog modal-dialog-centered 	modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <div className="w-100 d-flex flex-row justify-content-end mt-2 me-3">
                    <i
                      class="fa-regular fa-circle-xmark  "
                      onClick={this.hideModal}
                    ></i>
                  </div>
                </div>
                <div class="modal-body">
                  <div className="player-selectindustry">
                    <ReactPlayer
                      className="video-player"
                      url={this.state.getdata.description_video}
                      width="100%"
                      height="100%"
                      controls={true}
                      playing={this.state.playstate}
                      onPlay={this.play}
                      onPause={this.pause}
                    />
                  </div>
                  <h1 className="selectindustry-modaltitle mt-3">
                    {this.state.getdata.name}
                  </h1>
                  <p className="selectindustry-modalpara mt-1">
                    {this.state.getdata.description}
                  </p>
                  <div className="btn-center d-flex flex-row justify-content-center mt-5 mb-3">
                    <button
                      className="btn-yellow"
                      onClick={this.showConfirmModal}
                    >
                      {selectindustryText.confirm}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="selectindustry"
          ref={this.confirmModalRef}
        >
          <div class="modal-dialog modal-dialog-centered 	modal-sm">
            <div class="modal-content">
              <div class="modal-header">
                <div className="w-100 d-flex flex-row justify-content-end ">
                  <i
                    class="fa-regular fa-circle-xmark  "
                    onClick={this.hideConfirmModal}
                  ></i>
                </div>
              </div>
              <div class="modal-body">
                <div className="w-100 d-flex flex-row justify-content-center">
                  <img
                    src="image/changeindustrywarning.png"
                    alt=""
                    className="confirm-wrk"
                  />
                </div>
                <div className="mt-3">{selectindustryText.content}</div>
                <div className="btn-center d-flex flex-row justify-content-center mt-4 mb-3">
                  <button
                    className="btn-yellow"
                    onClick={() => this.selectindustry(this.state.getdata.id)}
                  >
                    {selectindustryText.sure}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div
                    className="modal fade"
                    id="selectindustry"
                    ref={this.errorModal}
                >
                    <div class="modal-dialog modal-dialog-centered 	modal-sm">
                        <div class="modal-content">
                            <div class="modal-header">
                                <div className="w-100 d-flex flex-row justify-content-end ">
                                    <i
                                        class="fa-regular fa-circle-xmark  "
                                        onClick={this.hideErrorModal}
                                    ></i>
                                </div>
                            </div>
                            <div class="modal-body">
                                <div className="w-100">
                                    <center className="mt-5 mb-3">
                                        <h4>
                                            <b>{this.state.error_messsage}</b>
                                        </h4>
                                    </center>
                                </div>
                                <div className="btn-center d-flex flex-row justify-content-center mt-4 mb-3">
                                    <button
                                        className="btn-yellow"
                                        onClick={this.hideErrorModal}
                                    >
                                        {selectindustryText.Ok}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
        <ErrorModal
          message={this.state.error_messsage}
          value={this.state.modalShow}
          closeModal={this.closeErrorModal}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    filterdata: state.filterdata,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    loading: (data) => {
      dispatch({ type: "Loading", value: data });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Option));
