import { AuthRole, AuthSession } from "@/types";

export const INDIVIDUAL_DEMO_USERNAME = "kullanici1";
export const CORPORATE_DEMO_USERNAME = "a bankasi";
export const DEMO_PASSWORD = "1234";

function normalize(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll("ı", "i");
}

export function authenticateDemoUser(role: AuthRole, username: string, password: string) {
  if (password !== DEMO_PASSWORD) return null;

  const normalizedUsername = normalize(username);

  if (role === "individual" && normalizedUsername === INDIVIDUAL_DEMO_USERNAME) {
    const session: AuthSession = {
      role: "individual",
      username: INDIVIDUAL_DEMO_USERNAME,
      displayName: "kullanici1",
      createdAt: new Date().toISOString(),
    };

    return session;
  }

  if (role === "corporate" && normalizedUsername === CORPORATE_DEMO_USERNAME) {
    const session: AuthSession = {
      role: "corporate",
      username: CORPORATE_DEMO_USERNAME,
      displayName: "A Bankasi",
      organizationName: "A Bankasi",
      createdAt: new Date().toISOString(),
    };

    return session;
  }

  return null;
}
