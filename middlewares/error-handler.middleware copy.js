export default (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ errorMessage: err.message }); // joi에서 에러가 발생했을때 메시지 그대로 반환){
  } else if (err === 400) {
    return res
      .status(400)
      .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
  } else if (err === 404) {
    return res
      .status(404)
      .json({ errorMessage: '상품 조회에 실패하였습니다.' });
  } else if (err === 401) {
    return res
      .status(401)
      .json({ errorMessage: '상품을 수정/삭제할 권한이 존재하지 않습니다.' });
  }
  // 아니면? 500 : 서버 문제
  return res
    .status(500)
    .json({ errorMessage: '서버에서 예기치 못한 에러가 발생하였습니다.' });
};
