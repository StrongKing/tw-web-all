import React from 'react';
import Splitter from '@/components/splitter';

export default () => {
  return (
    <Splitter layout="horizontal" disabled disabledHideBar={false}>
      <Splitter.Panel defaultSize="40%">1</Splitter.Panel>
      <Splitter.Panel defaultSize="20%">2</Splitter.Panel>
      <Splitter.Panel>3</Splitter.Panel>
    </Splitter>
  );
};
