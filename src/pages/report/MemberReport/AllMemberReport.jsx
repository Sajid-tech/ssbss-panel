import React, { useState, useEffect } from "react";
import MemberReport from "./MemberReport";
import { Tabs } from "antd";
import { useApiMutation } from "../../../hooks/useApiMutation";

const { TabPane } = Tabs;

const AllMemberReport = () => {
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const { trigger: fetchCategories } = useApiMutation();

  // Fetch member categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetchCategories({
          url: "https://agsdemo.in/ssbssapi/public/api/panel-fetch-member-category",
        });
        
        if (res.data && Array.isArray(res.data)) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, []);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div>
      <Tabs 
        activeKey={activeTab} 
        onChange={handleTabChange}
        type="card"
        className="mb-4"
      >
        <TabPane tab="All Members" key="all">
          <MemberReport 
            title="All Members" 
            categoryFilter={null} 
            key="all"
          />
        </TabPane>
        {categories.map(category => (
          <TabPane 
            tab={category.member_category} 
            key={category.id.toString()}
          >
            <MemberReport 
              title={category.member_category} 
              categoryFilter={category.id}
              key={category.id}
            />
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default AllMemberReport;