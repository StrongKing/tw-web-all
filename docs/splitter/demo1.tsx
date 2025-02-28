import React, { useState } from 'react';
import Splitter from '@/components/splitter';

export default () => {
  const [sizes, setSizes] = useState([]);
  return (
    <Splitter
      layout="vertical"
      style={{ height: 500 }}
      sizes={sizes}
      onResize={(val) => setSizes(val || [])}
    >
      <Splitter.Panel defaultSize="40%">
        <div style={{ height: 300 }}>1</div>
      </Splitter.Panel>
      <Splitter.Panel defaultSize="20%">
        <div style={{ height: 400 }}>2</div>
      </Splitter.Panel>
      <Splitter.Panel>
        <div style={{ height: 100 }}>3</div>
      </Splitter.Panel>
    </Splitter>
  );
};
