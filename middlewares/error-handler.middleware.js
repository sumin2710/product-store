export default (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ errorMessage: err.message }); // joi에서 에러가 발생했을때 메시지 그대로 반환){
  }
  // 아니면? 500 : 서버 문제
  return res
    .status(500)
    .json({ errorMessage: '서버에서 예기치 못한 에러가 발생하였습니다.' });
};
