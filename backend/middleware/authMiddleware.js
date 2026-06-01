const jwt = require('jsonwebtoken');

const protect = async (req, res, next)=>{
    try{

        if(!req.headers.authorization) return res.status(401).json({message: "No token, authorization denied"});
        const token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    }catch(err){
        res.status(401).json({message: "Invalid token", error: err.message});
}
};

module.exports = protect;