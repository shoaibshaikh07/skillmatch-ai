import { authClient } from "./auth-client";

async function createAdminUser(): Promise<void> {
  const newUser = await authClient.admin.createUser({
    name: "shoaib Shaikh",
    email: "work@shoaibshaikh.in",
    password: "Secret@123",
    role: "user", // this can also be an array for multiple roles (e.g. ["user", "sale"])
  });
  console.log(newUser);
}

createAdminUser();
