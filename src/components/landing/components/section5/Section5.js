import React, { useEffect, useState, useRef } from "react";
import "./styles/Section5.scss";
import Slider from "react-slick";
import { getBackDatas } from "./api/Get";
import Next from "./next/Next";
import Pre from "./pre/Pre";
import no_image_back from "../../../../assets/landing_images/no_image_back.svg";
import { Modal } from "bootstrap";
import { LandingText } from "../../const/Const_Landing";
function Section5() {
  const [setdatas, setDatas] = useState([]);
  const [setupdate, setUpdates] = useState([]);
  const useref = useRef(null);
  useEffect(() => {
    getStroeData();
  }, []);
  const getStroeData = () => {
    getBackDatas()
      .then((res) => {
        setDatas(res.data.data.results);
      })
  };
  const filterdata = (id) => {
    let datasShow = setdatas;
    datasShow.forEach((element) => {
      if (element.id === id) {
        setUpdates(element);
        showModal();
      }
    });
  };
  const showModal = () => {
    const modalEle = useref.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };
  const hideModal = () => {
    const modalEle = useref.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2200,
    pauseOnHover: true,
    nextArrow: <Next />,
    preletrow: <Pre />,
    responsive: [
      {
        breakpoint: 1680,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: true,
          dots: false,
        },
      },
      {
        breakpoint: 1441,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: true,
          dots: false,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          dots: false,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          dots: false,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          dots: false,
        },
      },
      {
        breakpoint: 375,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };
  return (
    <>
      <div className="section6" id="blogs">
        <h1 className="text-center mb-3" style={{ color: "white" }}>
          {LandingText.Blogs}
        </h1>
        <div className="slider_blogs">
          <Slider {...settings}>
            {setdatas.map((items, index) => {
              return (
                <div key={index}>
                  <div class="">
                    <div className="cards">
                      <div className="image_blog">
                        {!items.image ? (
                          <div className="noimage">
                            <img src={no_image_back} alt="" />
                          </div>
                        ) : (
                          <div className="backend_image">
                            <img src={items.image} alt="" />
                          </div>
                        )}
                      </div>
                      <div className="text_loreams">
                        <p className="loream">{items.title}</p>
                        <p className="ever">
                          {items.description}                        
                        </p>
                      </div>
                      <button
                        className="read_more"
                        onClick={() => filterdata(items.id)}
                      >
                        {LandingText.ReadMore}
                      </button>
                    </div>
                    <p className="readmore"></p>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
        <div className="pop-up-show">
          <p
            type="buttons"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
          ></p>
          <div
            class="modal fade"
            id="staticBackdrop"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabindex="-1"
            ref={useref}
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog  modal-dialog-centered modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <div className="images">
                    {!setupdate.image ? (
                      <div className="back-imagess">
                        <img src={no_image_back} alt="" />
                      </div>
                    ) : (
                      <div className="back-images">
                        <img src={setupdate.image} alt="" />
                      </div>
                    )}
                  </div>
                </div>
                <div class="modal-body">
                  <div className="pop-content mt-2">
                    <p className="title">{setupdate.title}</p>
                    <p className="description">
                      {setupdate.description}
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Fermentum ullamcorper lacinia placerat ante amet turpis
                        in. Rutrum eleifend scelerisque bibendum turpis
                        scelerisque sit viverra ut. Massa sed leo turpis
                        pellentesque ullamcorper duis tincidunt ultricies
                        suscipit. At viverra nulla magna ultrices letius a.
                        Mauris est fringilla semper pharetra egestas ante
                        scelerisque.
                      </p>
                    </p>
                  </div>
                </div>
                <div class="modal-footer">
                  <button className="read_mores" data-bs-dismiss="modal">
                    {LandingText.Close}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Section5;
