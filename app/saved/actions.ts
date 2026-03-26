"use server";

import { revalidatePath } from "next/cache";

export async function saveLayout(formData: FormData): Promise<void> {
  const name = formData.get("name");
  if (typeof name !== "string" || name.trim().length === 0) {
    throw new Error("Layout name is required.");
  }

  // Demo-only: persist nothing, but acknowledge the intent.
  void name;

  revalidatePath("/saved");
}
