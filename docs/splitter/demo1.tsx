import React from 'react';
import Splitter from '@/components/splitter';

export default () => {
  return (
    <Splitter layout="vertical">
      <Splitter.Panel>1</Splitter.Panel>
      <Splitter.Panel>2</Splitter.Panel>
    </Splitter>
  );
};
