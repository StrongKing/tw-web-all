/*
 * @Author: 大鸡腿 734164941@qq.com
 * @Date: 2022-01-13 12:36:27
 * @LastEditors: 大鸡腿 734164941@qq.com
 * @LastEditTime: 2022-10-10 15:06:40
 * @FilePath: \suo-uicomponent\src\components\compose-form\mod\richText.js
 *
 * Copyright (c) 2022 by 大鸡腿 734164941@qq.com, All Rights Reserved.
 */
import React from 'react';
import RichText from '@/components/RichText';

export default function richText(props) {
  return (
    <>
      <RichText {...props} />
      <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
        提示：图片上传支持格式为：jpg、jpeg、png、gif; 视频支持格式为mp4
      </div>
    </>
  );
}
