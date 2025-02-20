import SplitterComp from './Splitter';
import Panel from './Panel';

type CompoundedComponent = typeof SplitterComp & {
  Panel: typeof Panel;
};

const Splitter = SplitterComp as CompoundedComponent;
Splitter.Panel = Panel;

export default Splitter;
