import jwt from "jsonwebtoken";

const secret = "tvoj_secret"; // isti kao u .env (JWT_SECRET)

// Primer za USER
const userToken = jwt.sign({ id: 1, role: "USER" }, secret, { expiresIn: "1h" });
console.log("USER token:", userToken);

// Primer za FREELANCER
const freelancerToken = jwt.sign({ id: 2, role: "FREELANCER" }, secret, { expiresIn: "1h" });
console.log("FREELANCER token:", freelancerToken);

// Primer za COMPANY
const companyToken = jwt.sign({ id: 3, role: "COMPANY" }, secret, { expiresIn: "1h" });
console.log("COMPANY token:", companyToken);
