import React from 'react';
import { Image } from 'antd';

export interface PropTypes {
  value: string | { urlMid: string; urlTiny: string; url: string };
}

function Index({ value }: PropTypes) {
  const pictureStyle = {
    display: 'flex',
    height: '32px',
    width: '32px',
  };
  if (typeof value === 'string') {
    return (
      <div style={pictureStyle}>
        {value ? <Image width={32} height={32} src={value} /> : '-'}
      </div>
    );
  }

  if (typeof value === 'object') {
    return (
      <div style={pictureStyle}>
        {value ? (
          <Image
            width={32}
            preview={{
              src: value?.url,
            }}
            height={32}
            src={value?.urlTiny || value?.url}
          />
        ) : (
          '-'
        )}
      </div>
    );
  }

  return null;
}

export default Index;
