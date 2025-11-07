import { ConfigProvider, App as AntdApp } from "antd";

const AppThemeProvider = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#fb6332",
        },
        components: {
          Menu: {
            itemSelectedBg: "#fb6332",
            itemSelectedColor: "#ffffff",
            itemHoverBg: "#fb7c55",
            itemHoverColor: "#ffffff",
          },
        },
      }}
    >
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
};

export default AppThemeProvider;
