import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function createToken(id, role, extra = {}) {
  return await new SignJWT({ id, role, ...extra })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(secret);
}

const run = async () => {
  console.log("USER token:", await createToken(1, "USER"));
  console.log("FREELANCER token:", await createToken(2, "FREELANCER"));
  console.log("COMPANY token:", await createToken(3, "COMPANY"));
  console.log(
    "RESET token:",
    await createToken(2, "FREELANCER", { action: "reset" })
  );
};

run();
