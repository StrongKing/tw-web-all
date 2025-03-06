import React, { useEffect, useState, useRef } from 'react';
import { Button, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import request from '@/common/fileRequest';
import { ButtonProps } from 'antd/lib/button';
import './index.less';

const BaseUpload = ({
  onFinish,
  listType = 'text',
  multiple,
  accept,
  value,
  buttonProps,
  requestUrl,
  ...props
}: UploadProps & {
  buttonProps?: ButtonProps;
  value?: any;
  requestUrl: string;
  onFinish: (data: any) => void;
}) => {
  const headers = {
    Authorization: (window as any).token,
  };

  const typesMap: any = {
    image: 'image/*',
    doc: '.doc,.docx,.txt,.pdf,.xlsx,.xls',
    video: 'video/*',
    zip: '.rar,.zip',
    audio: 'audio/*',
  };

  const [_accept, setAccept] = useState<string>('');
  const [uploadFiles, setUploadFiles] = useState<RcFile[]>([]);

  useEffect(() => {
    if (accept) {
      const acceptArr = accept.split(',');
      const acceptTypes = acceptArr
        .map((val) => {
          return val in typesMap ? typesMap[val] : val;
        })
        .filter((val) => {
          return !!val;
        })
        .join(',');
      setAccept(acceptTypes);
    }
  }, [accept]);

  const customRequest = () => {
    const formData = new FormData();
    uploadFiles.forEach((file) => {
      formData.append(`file`, file);
    });
    request(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    }).then((res) => {
      onFinish(res);
    });
  };

  const beforeUpload = (file: RcFile, FileList: RcFile[]) => {
    setUploadFiles(FileList);
    return false;
  };
  const uploadProps = {
    headers,
    listType,
    multiple,
    accept: _accept,
    beforeUpload,
    customRequest,
    ...props,
  };
  useEffect(() => {
    if (uploadFiles.length > 0) {
      customRequest();
    }
  }, [uploadFiles]);

  return (
    <div className="upload-container">
      <Upload {...uploadProps}>
        <Button {...buttonProps}>上传</Button>
      </Upload>
    </div>
  );
};

export default BaseUpload;
