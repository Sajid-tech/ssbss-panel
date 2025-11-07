import { Table } from "antd";

const SGSTable = ({
  data = [],
  columns = [],
  rowKey = "id",
  pagination = { pageSize: 10 },
  scroll = { x: "max-content" },
  ...rest
}) => {
  return (
    <Table
      size="small"
      bordered
      rowKey={rowKey}
      dataSource={data}
      columns={columns}
      pagination={pagination}
      scroll={scroll}
      {...rest}
    />
  );
};

export default SGSTable;
