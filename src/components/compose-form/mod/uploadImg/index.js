/*
 * @Description:
 * @Author: 大鸡腿
 * @Date: 2023-04-20 19:27:52
 * @LastEditTime: 2023-05-11 11:16:41
 * @LastEditors: 大鸡腿
 */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import React, { useEffect, useState, useRef } from 'react';
import { Upload, message, Image, Modal } from 'antd';
import ImgCrop from 'antd-img-crop';
import { stringify } from 'qs';
import { LoadingOutlined } from '@ant-design/icons';
import request from '@/common/fileRequest';
import request2 from '@/common/request2';
import delIcon from './imgs/del.svg';
import preIcon from './imgs/pre.svg';
import './index.less';

const getImageResolution = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader?.readAsDataURL(file);
    reader.onload = function () {
      if (reader?.readyState === 2) {
        const img = new window.Image();
        img.src = reader?.result;
        img.onload = function () {
          resolve(this.height * this.width);
        };
        img.onerror = function () {
          reject(new Error('image load error'));
        };
      }
    };
  });
};

/**
 * @description: form表单上传图片组件
 * @param maxCount 图片数量限制，默认1
 * @param maxSize 图片大小限制，默认10M
 * @param requestUrl 上传接口
 * @param appCode 应用code
 * @param isCrop 是否开启剪裁，默认false
 * @param requestParams 上传接口额外需要传的参数
 * @param resolution 分辨率限制
 * @param isUseGroupId 是否返回groupId，默认true
 * @param typeMaxSize 分别设置不同类型图片大小限制 比如 {gif: 1}
 * @param saveUrlKey 不返回groupId时使用的key
 * @return groupId | url
 * @Author: 大鸡腿
 * @Date: 2023-05-10 19:00:33
 */
export default function UploadImage({
  onChange,
  appCode,
  value = 0,
  maxCount = 1,
  maxSize = 10,
  isMultiple = false,
  tips,
  requestUrl,
  listType = 'picture-card',
  isCrop = false,
  requestParams = {},
  disabled = false,
  resolution,
  isUseGroupId = true,
  typeMaxSize = {},
  thumbnailUrl = 'urlTiny',
  previewUrlKey = 'url', // url 大图 urlMid 中图 urlTiny 小图
  saveUrlKey = 'urlMid',
  ...otherProps
}) {
  const headers = {
    Authorization: window.token,
    'app-code': appCode,
  };

  const [bizGroupId, setbizGroupId] = useState(0); // 用于存储首次上传的groupId,后端要用。
  const isFirst = useRef(false);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Array.isArray(value)) {
      setFileList(value);
    } else if (value?.toString().indexOf('http') !== -1) {
      setFileList([
        {
          status: 'done',
          uid: 1,
          fileId: 1,
          name: 1,
          url: value,
        },
      ]);
    } else if (value && value !== '0') {
      const params = {
        ...requestParams,
        appCode,
        groupId: value,
      };
      const url = `${requestUrl}/web/file/get?${stringify(params)}`;
      request(url)
        .then((data) => {
          const { medias = [], groupId: id } = data || {};
          const list = medias.map((val) => {
            const {
              url: _url,
              mediaId: fileId,
              fileName: name,
              urlMid,
              urlTiny,
            } = val || {};
            return {
              status: 'done',
              uid: fileId,
              fileId,
              name,
              url: _url,
              urlMid,
              urlTiny,
            };
          });
          !isFirst.current && setbizGroupId(id);
          isFirst.current = true;
          setFileList(list);
          setLoading(false);
        })
        .catch(() => {
          setFileList([]);
          setLoading(false);
        });
    } else {
      setFileList([]);
    }
  }, [value]);

  const onRemove = (file) => {
    const { uid } = file || {};
    if (uid === 1) {
      const newsFiles = fileList?.filter((val) => val?.uid !== uid);
      setFileList(newsFiles);
      onChange('');
      setLoading(false);
    } else {
      const resFiles = fileList
        .filter((val) => val?.uid !== file?.uid)
        .map((val) => val?.fileId || val?.response?.data?.files[0].fileId);
      request2(`${requestUrl}/web/file/del`, {
        method: 'POST',
        data: {
          fileIds: resFiles,
          groupId: value || 0,
          bizGroupId,
          ...requestParams,
          appCode,
        },
      })
        .then((res) => {
          if (res === 0 || res === '0') {
            // antd必填校验中认为0是有效值，但删除最后一张图片时groupId返回为0，故需要转为空串。
            res = '';
          }
          onChange(res);
        })
        .catch(() => {
          onChange('');
        });
    }
  };

  const beforeUpload = async (file) => {
    const { size, type } = file || {};
    if (type?.includes('image')) {
      if (size > maxSize * 1024 * 1024) {
        message.error(`上传图片不得超过${maxSize}M`);
        return false;
      }
      const imgType = (type || '').replace(/^image\//, '').toLowerCase();
      if (
        imgType &&
        typeMaxSize[imgType] &&
        size > typeMaxSize[imgType] * 1024 * 1024
      ) {
        message.error(`上传${imgType}图片不得超过${typeMaxSize[imgType]}M`);
        return false;
      }
    } else {
      message.error('请选择图片格式文件');
      return false;
    }

    if (resolution) {
      const curImgResolution = await getImageResolution(file);
      if (curImgResolution > resolution) {
        message.error(`图片总分辨率不能超过${resolution}`);
        return false;
      }
    }

    return true;
  };

  const onChangeUpload = ({ fileList: newFileList, file }) => {
    const { status, response } = file;
    if (status === 'uploading') {
      setLoading(true);
    }
    if (status) {
      setFileList(newFileList);
      if (status === 'done') {
        if (response?.code === 0) {
          const { data } = response || {};
          const { groupId = '', files = [] } = data || {};
          if (!isUseGroupId) {
            onChange(
              files?.[0]?.[saveUrlKey] || files?.[0]?.urlMid || files?.[0]?.url,
            );
          } else {
            onChange(groupId);
            newFileList[newFileList.length - 1].previewUrl =
              files?.[0]?.[previewUrlKey];
          }
        } else {
          newFileList?.pop();
          setFileList(newFileList);
          message.error(response.msg);
        }
        setLoading(false);
      } else if (status === 'error') {
        newFileList?.pop();
        setFileList(newFileList);
        message.error('图片过大，上传失败，请调整后重新上传');
        setLoading(false);
      }
    }
  };
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const handleCancel = () => setPreviewVisible(false);

  const onPreview = async (file) => {
    setPreviewImage(file?.previewUrl || file?.url);
    setPreviewVisible(true);
    setPreviewTitle(file?.url?.substring(file?.url?.lastIndexOf('/') + 1));
  };

  const params = {
    ...requestParams,
    appCode,
    groupId: value || 0,
    bizGroupId,
    isSyncZip: 1,
  };

  const uploadProps = {
    action: `${requestUrl}/web/file/uploadFileList?${stringify(params)}`,
    headers,
    listType,
    maxCount: maxCount * 1,
    fileList,
    multiple: isMultiple,
    onChange: onChangeUpload,
    onRemove,
    onPreview,
    beforeUpload,
    showUploadList: !(maxCount * 1 === 1),
    disabled,
    ...otherProps,
  };

  return (
    <>
      {isCrop ? (
        <>
          {disabled && (!fileList?.length || !fileList?.[0]?.url) ? (
            <span>-</span>
          ) : (
            <div className="upload-img">
              {value && maxCount === 1 ? (
                <div className="upload-img-single">
                  <div className="upload-img-single-mask">
                    <img
                      src={preIcon}
                      onClick={() => onPreview(fileList?.[0])}
                      alt=""
                    />
                    {disabled ? null : (
                      <img
                        src={delIcon}
                        onClick={() => onRemove(fileList?.[0])}
                        alt=""
                      />
                    )}
                  </div>
                  <Image
                    style={{ width: 80, height: 80 }}
                    src={fileList?.[0]?.[thumbnailUrl] || fileList?.[0]?.url}
                    alt=""
                  />
                </div>
              ) : (
                <ImgCrop rotate>
                  <Upload {...uploadProps}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {loading ? <LoadingOutlined /> : <span>+</span>}
                      <span style={{ fontSize: '12px', paddingTop: '2px' }}>
                        上传
                      </span>
                    </div>
                  </Upload>
                </ImgCrop>
              )}
              {tips && <div style={{ color: '#8c8c8c' }}>{tips}</div>}
            </div>
          )}

          {tips && (
            <div style={{ marginTop: '-5px', color: '#8c8c8c' }}>{tips}</div>
          )}
        </>
      ) : (
        <>
          {disabled && (!fileList.length || !fileList?.[0]?.url) ? (
            <span>-</span>
          ) : (
            <div className="upload-img">
              {value && maxCount === 1 ? (
                <div className="upload-img-single">
                  <div className="upload-img-single-mask">
                    <img
                      src={preIcon}
                      onClick={() => onPreview(fileList?.[0])}
                      alt=""
                    />
                    {disabled ? null : (
                      <img
                        src={delIcon}
                        onClick={() => onRemove(fileList?.[0])}
                        alt=""
                      />
                    )}
                  </div>
                  <Image
                    style={{ width: 80, height: 80 }}
                    src={fileList?.[0]?.[thumbnailUrl] || fileList?.[0]?.url}
                    alt=""
                  />
                </div>
              ) : (
                <Upload {...uploadProps}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {loading ? <LoadingOutlined /> : <span>+</span>}
                    <span style={{ fontSize: '12px', paddingTop: '2px' }}>
                      上传
                    </span>
                  </div>
                </Upload>
              )}
              {tips && (
                <div
                  style={{
                    color: '#999',
                    fontSize: '12px',
                    wordBreak: 'break-all',
                  }}
                >
                  {tips}
                </div>
              )}
            </div>
          )}
        </>
      )}
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        width={600}
        onCancel={handleCancel}
      >
        <img alt="" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
}
