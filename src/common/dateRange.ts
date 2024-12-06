import moment, { Moment } from 'moment';

export const getRangeMap = (t = 0) => {
  const map: { [key: string]: [Moment, Moment] } = {
    昨天: [
      moment().subtract(1, 'days').startOf('day'),
      moment().subtract(1, 'days').endOf('day'),
    ],
    今天: [moment().startOf('day'), moment().endOf('day')],
    近7天: [
      moment()
        .add(t - 6, 'days')
        .startOf('day'),
      moment().add(t, 'days').endOf('day'),
    ],
    近14天: [
      moment()
        .add(t - 13, 'days')
        .startOf('day'),
      moment().add(t, 'days').endOf('day'),
    ],
    近30天: [
      moment()
        .add(t - 29, 'days')
        .startOf('day'),
      moment().add(t, 'days').endOf('day'),
    ],
  };
  if (t < 0) {
    delete map.今天;
  }
  return map;
};
export const tipsMap: { [key: string]: string } = {
  '0': '提示：在线数据，近7天、近14天、近30天包含今天',
  '-1': '提示：离线数据，近7天、近14天、近30天不包含今天',
};
