import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "super_tajna_sifra");

async function createToken(role) {
  return await new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(secret);
}

const run = async () => {
  console.log("USER token:", await createToken("USER"));
  console.log("FREELANCER token:", await createToken("FREELANCER"));
  console.log("COMPANY token:", await createToken("COMPANY"));
};

run();
