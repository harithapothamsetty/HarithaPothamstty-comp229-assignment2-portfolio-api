const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "6d33e051ad8fcca937920723f0d72d992aae06a283477eab9a5f05f2ef8642a6",
  mongoUri: process.env.MONGODB_URI || "mongodb+srv://pothamsettyharitha_db_user:MongoDB@cluster0.j8hewwu.mongodb.net/Portfolio?retryWrites=true&w=majority&appName=Cluster0"
}

export default config