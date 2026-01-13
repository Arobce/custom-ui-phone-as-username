import {
  invalidateFormField
} from "@kinde/infrastructure";

export const workflowSettings = {
  id: "onUsernameProvided",
  name: "Validate username as phone number",
  trigger: "user:new_username_provided",
  failurePolicy: {
    action: "stop",
  },
  bindings: {
    "kinde.widget": {}, // Required for accessing the UI
  },
};

export default async function Workflow(event: any) {
  console.log("Workflow triggered: onUsernameProvided");
  console.log("Event received:", JSON.stringify(event, null, 2));

  const username = event?.context?.auth?.suppliedUsername;
  console.log("Extracted username:", username);

  if (!username || typeof username !== "string") {
    console.log("No username provided or username is not a string.");
    return;
  }

  /**
   * Phone validation (E.164):
   * - Must include country code with leading '+'
   * - First digit cannot be 0
   * - Total digits up to 15
   * Example: +14155552671
   */
  const phoneRegex = /^\+[1-9]\d{1,14}$/;

  if (!phoneRegex.test(username.trim())) {
    console.log("Username failed E.164 phone number validation.");
    invalidateFormField(
      "p_username",
      "Enter a valid phone with country code, e.g. +14155552671."
    );
    return;
  }

  console.log("Username is a valid phone number.");
}
