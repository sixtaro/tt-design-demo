const Money = props => (
  <Statistic className="inline" prefix="￥" precision={2} valueStyle={{ color: '#FF0045' }} {...props}>
    {props.children}
  </Statistic>
);

export default Money;