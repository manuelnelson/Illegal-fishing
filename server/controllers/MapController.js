let client = require('../middleware/database').client;

const get = async (req,res,next) => {
  console.log(req.query)  
  let query = `SELECT Rad_DNB, Lon_DNB, Lat_DNB, QF_Detect, Date_Mscan FROM vbd WHERE ST_Intersects(ST_SetSRID(ST_MakeBox2D(ST_MakePoint($1, $2),ST_MakePoint($3, $4)),4326), geom) AND Qf_Detect IN (1, 2, 3, 8) AND (LI < 0.0001) AND Date_Mscan >= $5 AND Date_Mscan < $6;` // ORDER BY Date_Mscan
  let values = [req.query.lng1, req.query.lat1, req.query.lng2, req.query.lat2, req.query.startDate, req.query.endDate];
  let result = await client.query(query,values)
  console.log(result)
  return res.json({results:result.rows})
}
module.exports  = {get}