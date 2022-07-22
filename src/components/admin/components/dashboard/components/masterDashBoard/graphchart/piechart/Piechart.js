import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
function Piechart(props) {
  const { industryname, industryvalue } = props;
  const [industry, setIndustry] = useState([]);
  const [industrydata, setIndustrydata] = useState([]);
  useEffect(() => {
    let _industry = [];
    let _industryvalue = [];
    industryname.slice(0, 3).forEach((item) => {
      _industry.push(item.industryname);
    });
    industryvalue.slice(0, 6).forEach((item) => {
      _industryvalue.push(item.total);
    });
    setIndustry(_industry);
    setIndustrydata(_industryvalue);
  }, [industryname]);
  const chartData = {
    labels: [...industry],
    datasets: [
      {
        data: [...industrydata],
        backgroundColor: [
          "#FB9B51",
          "#11224E",
          "#1A3B70",
          "#2C599D",
          "#5C83C4",
          "#F88125",
        ],
        hoverBackgroundColor: [
          "#FB9B51",
          "#11224E",
          "#1A3B70",
          "#2C599D",
          "#5C83C4",
          "#F88125",
        ],
      },
    ],
  };
  // 
  return (
    <div className="chart ">
      <Chart type="doughnut" data={chartData} style={{ position: 'relative', }} />
    </div>
  );
}
export default Piechart;
