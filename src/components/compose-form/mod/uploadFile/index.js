/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import { Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import request from '@/common/fileRequest';
import request2 from '@/common/request2';
import { getVideoDuration } from '@/common/util';

const uploadFIle = ({
  value = 0,
  onChange,
  appCode,
  maxSize = 10,
  maxCount,
  accept,
  orgId,
  requestUrl,
  ...otherProps
}) => {
  const headers = {
    Authorization: window.token,
    'app-code': appCode,
    'page-log': `upload-file=1.0.0&appCode=${appCode}`,
  };

  const typesMap = {
    image: 'image/*',
    doc: '.doc,.docx,.txt,.pdf,.xlsx,.xls',
    video: 'video/*',
    zip: '.rar,.zip',
    audio: 'audio/*',
  };

  const [fileList, setFileList] = useState([]);
  const [_groupId, setGroupId] = useState(value);
  const [bizGroupId, setbizGroupId] = useState(value);
  const [isFirst, setIsFirst] = useState(false);
  const [_accept, setAccept] = useState(undefined);
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    if (accept) {
      const acceptArr = accept.split(',');
      const acceptTypes = acceptArr
        .map((val) => {
          return typesMap[val] ? typesMap[val] : val;
        })
        .filter((val) => {
          return !!val;
        })
        .join(',');
      setAccept(acceptTypes);
    }
  }, [accept]);

  useEffect(() => {
    if (value) {
      if (Array.isArray(value)) {
        setFileList(value);
      } else if (value.toString().indexOf('http') !== -1) {
        setFileList([
          {
            status: 'done',
            uid: 1,
            fileId: 1,
            name: 1,
            url: value,
          },
        ]);
      } else {
        const __url = orgId
          ? `${requestUrl}/web/file/get?orgId=${orgId}&appCode=${appCode}&groupId=${value}`
          : `${requestUrl}/web/file/get?appCode=${appCode}&groupId=${value}`;
        request(__url).then((data) => {
          const { medias, groupId: id } = data;
          const list = medias.map((val) => {
            const { url: _url, mediaId: fileId, fileName: name } = val;
            return {
              status: 'done',
              uid: fileId,
              fileId,
              name,
              url: _url,
            };
          });
          setGroupId(id);
          !isFirst && setbizGroupId(id);
          setIsFirst(true);
          setFileList(list);
        });
      }
    }
  }, [value]);

  const onChangeFile = ({ fileList: newFileList, file }) => {
    const { status, size } = file;
    if (size > maxSize * 1024 * 1024) {
      return false;
    }
    setFileList(newFileList);
    if (status) {
      if (status === 'done') {
        const { response } = file;
        if (response.code === 0) {
          const { data } = response || {};
          const { groupId: id, files = [] } = data || {};
          const { fileId, fileName, url } = files[0] || {};
          newFileList.pop();
          setGroupId(id);
          onChange(id);
          setFileList([
            ...newFileList,
            {
              status: 'done',
              uid: fileId,
              fileId,
              name: fileName,
              url,
            },
          ]);
        } else {
          newFileList.pop();
          setFileList([...newFileList]);
          message.error(response.msg);
        }
      }
    }
  };

  const beforeUpload = async (file) => {
    const { size, type } = file;
    if (size > maxSize * 1024 * 1024) {
      message.error(`上传文件不得超过${maxSize}M`);
      throw new Error(`上传文件不得超过${maxSize}M`);
    }
    if (maxCount * 1 === 1) {
      setGroupId(0);
    }
    if (/^video\//.test(type)) {
      const fileDuration = await getVideoDuration(file);
      setDuration(fileDuration);
    } else {
      setDuration(0);
    }
    return file;
  };

  const onRemove = (file) => {
    const resFiles = fileList
      .filter((val) => val.uid !== file.uid)
      .map((val) =>
        val.fileId ? val.fileId : val.response.data.files[0].fileId,
      );
    request2(`${requestUrl}/web/file/del`, {
      method: 'POST',
      data: {
        fileIds: resFiles,
        groupId: _groupId || 0,
        bizGroupId: bizGroupId || 0,
        orgId,
        appCode,
      },
    }).then((res) => {
      if (res === '0' || res === 0) {
        res = '';
      }
      setGroupId(res);
      onChange(res);
    });
  };

  const onPreview = async (file) => {
    const src = file.url;
    // if (!src) {
    //   src = await new Promise((resolve) => {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file.originFileObj);
    //     reader.onload = () => resolve(reader.result);
    //   });
    // }
    // const image = new Image();
    // image.src = src;
    window.open(src);
    // imgWindow.document.write(image.outerHTML);
  };
  let ___url = orgId
    ? `${requestUrl}/web/file/uploadFileList?appCode=${appCode}&groupId=${
        _groupId || 0
      }&bizGroupId=${bizGroupId || 0}&orgId=${orgId}`
    : `${requestUrl}/web/file/uploadFileList?appCode=${appCode}&groupId=${
        _groupId || 0
      }&bizGroupId=${bizGroupId || 0}`;
  if (duration) {
    ___url += `&duration=${duration}`;
  }

  return (
    <>
      <Upload
        action={___url}
        headers={headers}
        fileList={fileList}
        onChange={onChangeFile}
        onRemove={onRemove}
        onPreview={onPreview}
        beforeUpload={beforeUpload}
        accept={_accept}
        maxCount={maxCount * 1}
        {...otherProps}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Button type="primary" icon={<UploadOutlined />}>
            上传
          </Button>
        </div>
      </Upload>
    </>
  );
};

export default uploadFIle;
