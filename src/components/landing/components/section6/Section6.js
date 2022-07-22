import React, { useState }  from "react";
import "./styles/Section6.scss";
import contact_right_image from "../../../../assets/landing_images/landing_contact_speak.webp";
import { LandingText } from "../../const/Const_Landing";
import instance from "services/Instance";

function Section6() {
  const [datacall, setDatacall] = useState({});
  const [submitBTN, setSubmitbtn] = useState(false);
  const sendEmail = (e) => {  
    e.preventDefault();
    // console.log(datacall) 
    setSubmitbtn(true)
    let formData = new FormData();
    formData.append("name", datacall.name);
    formData.append("email", datacall.email);
    formData.append("contact_no", datacall.contact_number);
    formData.append("user_type", datacall.usertype);
    return new Promise((success, reject) => {
      instance
        .post("users/common/send_contact_email/", formData)
        .then((res) => {
          success(res);
          e.target.reset()
          setSubmitbtn(false)
        })
        .catch((err) => {
        });
    });
  };
  const onChange = (e) => {    
    const name = e.target.name;
    const value = e.target.value;
    setDatacall(values => ({...values, [name]: value}))
  }

  return (
    <div className="section7" id="contacts">
      <div className="inside_section7">
        <h1 className="contact_landing">{LandingText.ContactUs}</h1>
        <div className="main_section7">
          <div className="inside_body_section7">
            <div className="left_input_box">
              <form onSubmit={sendEmail}>
                <input type="text" 
                placeholder="NAME"
                 className="mb-5"
                 name="name"
                 required
                 onChange={(e) => onChange(e)}
                 >
                 </input>
                <input
                  type="email"
                  placeholder="E-MAIL ID"
                  className="mb-5"
                  name="email"
                  onChange={(e) => onChange(e)}
                  required
                ></input>
                <input
                  type="text"
                  placeholder="CONTACT NUMBER"
                  className="mb-5"
                  name="contact_number"
                  minlength="10"
                  maxlength="10"
                  onChange={(e) => onChange(e)}
                  required
                ></input>
                <input
                  type="text"
                  placeholder="USER TYPE"
                  className="mb-5"
                  name="usertype"
                  onChange={(e) => onChange(e)}
                  required
                ></input>
                {/* <input type="button" className="buttons read_more" value="Submit"></input> */}
                <div className="buttons_contact mx-auto ">
                  <button className="read_more" type="submit" disabled={submitBTN}>
                  {submitBTN ? LandingText.Submiting:LandingText.Submit}</button>
                </div>
              </form>
            </div>
            <div className="right_image_landing_box">
              <img src={contact_right_image} className="img1 mt-3 mt-xl-0" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Section6;
