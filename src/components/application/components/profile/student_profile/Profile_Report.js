import React from "react";
import ScrollArea from "react-scrollbar";
import { studentProfileText } from "../../../../admin/components/profile/components/studentProfile/Const_StudentProfile";
function Profile_Report(props) {
  const { topiclearned, currentstage, showtopiclearned, course_status } = props;
  // 
  return (
    <div className="topic p-4">
      {showtopiclearned ? (
        <>
          {course_status === "completed" && currentstage === 3 ? (
            <div className="">
              <div className="Industry-Expert-comments ">
                <h4 className="mb-4 ms-3">
                  {studentProfileText.topicslearned}
                </h4>
                <ScrollArea
                  speed={0.5}
                  className="scroll"
                  horizontal={false}
                  verticalScrollbarStyle={{
                    background: "transparent",
                    width: "0px",
                  }}
                  smoothScrolling={true}
                >
                  <div>
                    {/* {topiclearned.map((data, index) => ( */}
                    <p className="ps-4">{topiclearned.content}</p>
                    {/* ))} */}
                  </div>
                </ScrollArea>
              </div>
            </div>
          ) : (
            <div className="atlaststage">
              <img src="/image/atlaststage.png" alt="" className=" mt-5" />
              <p className="mt-5">{studentProfileText.content}</p>
            </div>
          )}
        </>
      ) : (
        <>
          {course_status === "completed" && currentstage === 3 ? (
            <center>
              <h1>{studentProfileText.notfound}</h1>
            </center>
          ) : (
            <div className="atlaststage">
              <img src="/image/atlaststage.png" alt="" className=" mt-5" />
              <p className="mt-5">{studentProfileText.content}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default Profile_Report;
