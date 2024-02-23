function errorHandler(error, req, res, next){

if (error.status && error.msg) {
    res.status(error.status).send({ msg: error.msg });
  }

  if(error.code === '23502' || error.code === '23503' || error.code === "22P02") {
    res.status(400).send({msg: 'Bad Request' })
  }
  if (error.code = '23505'){
    res.status(403).send({msg:'Already Exists'})
  }
 else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

module.exports = errorHandler