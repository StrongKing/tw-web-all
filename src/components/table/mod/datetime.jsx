import { mapProps } from 'recompose';
import moment from 'dayjs';
import Text from './text';

export default mapProps(({ value, format, comparsion, ...others }) => {
  let comparsionDate;
  if (comparsion.enable && comparsion.value) {
    comparsionDate = new Date(comparsion.value);
    if (comparsionDate.toString() === 'Invalid Date') {
      comparsionDate = undefined;
    }
  }
  return {
    value: value ? moment(new Date(value)).format(format) : '',
    comparsion: {
      ...comparsion,
      value:
        comparsion.enable && comparsionDate
          ? moment(comparsionDate).format(format)
          : comparsion.value,
    },
    ...others,
  };
})(Text);
