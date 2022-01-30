import "reflect-metadata";
import { createConnection } from "typeorm";

export default async () => {
  try {
    await createConnection();
    console.log("Database connected successfully");
  } catch (error) {
      throw error;
  }
};
