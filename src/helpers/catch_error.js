export default async function catchError(promise) {
  try {
    await promise;
  } catch (error) {
    return error.message || error;
  }
}
