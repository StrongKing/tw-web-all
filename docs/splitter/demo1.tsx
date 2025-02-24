import React from 'react';
import Splitter from '@/components/splitter';

export default () => {
  return (
    <Splitter layout="vertical" style={{ height: 500 }}>
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
