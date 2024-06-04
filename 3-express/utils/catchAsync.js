module.exports = (fn) => {
  return (req, res, next) => {
    // console.log('Inside of catchAsync  function returned function <0-------');
    fn(req, res, next).catch(next);
  };
};
