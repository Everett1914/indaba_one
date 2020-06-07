// Configuration details for connecting to MySQL database

module.exports = {
  connectionLimit : 20,
  host            : process.env.AWSRDSDB_HOST,
  user            : process.env.AWSRDSDB_USER,
  password        : process.env.AWSRDSDB_PASSWORD,
  database        : process.env.AWSRDSDB_DATABASE,
  port            : 3306,
  waitForConnections: true,
  queueLimit: 0,
  timezone: 'Z'
};
