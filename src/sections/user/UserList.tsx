import React, { useState } from "react";
import { Button, Input, Table, Tag } from "antd";
import type { TablePaginationConfig, TableProps } from "antd";
import { FilterOutlined, UserAddOutlined } from "@ant-design/icons";
import ExportUser from "./ExportUser";
import AddUserModal from "./AddUserModal";
import useUserService from "@/services/userService";
import { formatDate2 } from "@/util/validate";
import DropdownUserFunc from "./DropdownUserFunc";
import { Roles } from "@/enums/enums";
import { UserInfo } from "@/types/auth.types";

// export interface DataType {
//   id: number;
//   key: string;
//   name: string;
//   image: string;
//   description: string;
//   gender: number;
//   dob: string | Date;
//   "role-id": number;
// }

const UserList: React.FC = React.memo(() => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { users, isFetching, totalCount } = useUserService();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setCurrentPage(pagination.current || 1);
  };

  const columns: TableProps<UserInfo>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, _record, index) => index + 1,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "20%",
    },
    {
      title: "Họ và tên",
      dataIndex: "full-name",
      width: "15%",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      width: "15%",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: "17%",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone-number",
      width: "10%",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      width: "5%",
      render: (roleName) => {
        let roleText = "";
        let tagColor = "";
        switch (roleName) {
          case "CUSTOMER":
            roleText = "CUSTOMER";
            tagColor = "pink";
            break;
          case Roles.DRIVER.toString():
            roleText = "DRIVER";
            tagColor = "green";
            break;
          case Roles.BUSCOMPANY.toString():
            roleText = "BUS";
            tagColor = "red";
            break;
          case Roles.ADMIN.toString():
            roleText = "ADMIN";
            tagColor = "blue";
            break;
          default:
            roleText = "UNKNOWN";
            tagColor = "gray";
            break;
        }
        return <Tag color={tagColor}>{roleText}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        let statusText = "";
        let tagColor = "";
        switch (status) {
          case "ACTIVE":
            statusText = "ACTIVE";
            tagColor = "green";
            break;
          case "INACTIVE":
            statusText = "INACTIVE";
            tagColor = "pink";
            break;
          default:
            statusText = "UNKNOWN";
            tagColor = "gray";
            break;
        }
        return <Tag color={tagColor}>{statusText}</Tag>;
      },
      width: "10%",
    },
    {
      title: "",
      dataIndex: "",
      render: (_, record) => (
        <>
          <DropdownUserFunc userInfo={record} />
        </>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-x-2">
          <Input
            placeholder="Tìm kiếm..."
            className="h-8 max-w-lg rounded-lg sm:mb-5 sm:w-[300px]"
          />
          <Button className="flex items-center" type="primary">
            <FilterOutlined className="align-middle" />
            Sắp xếp
          </Button>
        </div>
        <div className="flex gap-x-2">
          <div>
            <ExportUser />
          </div>
          <div>
            <Button type="primary" onClick={() => setIsOpen(true)}>
              <div className="flex justify-center">
                <UserAddOutlined className="mr-1 text-lg" /> Thêm người dùng
              </div>
            </Button>
          </div>
        </div>
      </div>
      <Table
        className="pagination"
        id="myTable"
        columns={columns}
        dataSource={users?.map((record: { id: unknown; dob: string, ["address"]:string, ["phone-number"]:string }) => ({
          ...record,
          key: record.id,
          dob: record.dob ? formatDate2(record.dob) : "N/A",
          ["address"]: record.address ? record.address : "N/A",
          ["phone-number"]: record["phone-number"] ? record["phone-number"] : "N/A"
        }))}
        pagination={{
          current: currentPage,
          total: totalCount || 0,
          pageSize: 5,
        }}
        onChange={handleTableChange}
        loading={isFetching}
        rowKey={(record) => record.id}
      />
      <AddUserModal setIsOpen={setIsOpen} isOpen={isOpen} />
    </>
  );
});

export default UserList;
