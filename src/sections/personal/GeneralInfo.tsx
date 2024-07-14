import React, { useCallback, useState } from "react";
import { Divider, Progress, Tag } from "antd";
import useAuthService from "@/services/authService";
import { ROLE } from "@/constants";
import AccountInfo from "./AccountInfo";
import { UploadImage } from "@/components";

const GeneralInfo: React.FC = () => {
  const { userInfo } = useAuthService();
  const [fileChange, setFileChange] = useState<string>("");
  const role = userInfo?.role;

  const handleFileChange = useCallback((newFileChange: string) => {
    setFileChange(newFileChange);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        <div className="col-span-3 rounded-3xl border border-gray-100 p-5 shadow-md md:col-span-1">
          <div className="flex flex-col items-center">
            <div className="h-[110px]">
              <UploadImage
                initialImage={userInfo?.["avatar-url"]}
                onFileChange={handleFileChange}
              />
            </div>
            <strong className="text-2xl">{userInfo?.["full-name"]}</strong>
            <Tag
              color={role === ROLE.ADMIN ? "blue" : "red"}
              className="mt-2 rounded-md px-4 py-1"
            >
              {userInfo?.role}
            </Tag>
          </div>
          <Divider />
          <div>
            <strong>Tiến trình</strong>
            <Progress strokeLinecap="butt" percent={100} />
          </div>
          <Divider />
          <div className="">
            <strong className="">Mô tả bản thân</strong>
            {userInfo?.role === ROLE.ADMIN ? (
              <p>Tôi là admin quản lý hệ thống</p>
            ) : (
              <p>Tôi là công ty chuyên cung cấp các chuyến xe du lịch. </p>
            )}
          </div>
        </div>
        <div className="col-span-2 rounded-3xl border border-gray-100 p-5 shadow-md">
          <AccountInfo fileChange={fileChange} />
        </div>
      </div>
    </>
  );
};

export default GeneralInfo;
