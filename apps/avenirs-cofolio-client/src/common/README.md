# common

This folder contains shared logic and utilities that are **used across multiple features**.

## Subfolders:
- `api/`: Contains reusable API service logic like `axios` instances or HTTP helpers.
- `composables/`: Vue composables (`useX`) that are generic and not tied to any single feature.
- `exceptions/`: Custom error classes or error-handling utilities shared app-wide.

# 🧱 Exceptions

This folder contains centralized logic for handling **backend API errors** in a consistent and type-safe way throughout the application.

## 📦 Structure

| File                   | Responsibility                                                             |
|------------------------|-----------------------------------------------------------------------------|
| `base-api.exception.ts`| Core error-handling logic and utility for parsing backend exception format |
| `error-codes.ts`       | Enum of all known backend error codes used in `BaseApiExceptionResponse`   |

## 🧩 Exception Format

All errors returned by the backend must follow the following contract:

```ts
export interface BaseApiExceptionResponse {
  message: string
  status: number
  code: BaseApiErrorCode
  details?: ErrorDetails
}
