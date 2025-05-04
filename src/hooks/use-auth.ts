import React from "react";

import { accountApi } from "@/features/accounts/api/account"

export function useAuth() {
  return accountApi.getSessionUser()
}